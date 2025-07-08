# 簡潔なバックエンドアーキテクチャ設計（Next.js API Routes）

## 1. アーキテクチャ全体像

- **ドメイン駆動設計**を採用（DDD: Domain-Driven Design）
- **CQRS**（Command Query Responsibility Segregation）パターン
- **明確な責任分離**と**レイヤー化**

### ディレクトリ構成

```
src/
├── app/
│   └── api/v1/                    # API Routes
│       ├── auth/
│       ├── users/
│       └── transactions/
└── backend/                       # バックエンドロジック
    ├── domains/                   # ドメインロジック
    │   ├── auth/
    │   │   ├── commands/          # 書き込み操作
    │   │   ├── queries/           # 読み取り操作
    │   │   ├── entities/          # ドメインエンティティ
    │   │   └── repositories/      # リポジトリ interface
    │   ├── user/
    │   │   ├── commands/
    │   │   ├── queries/
    │   │   ├── entities/          # User, UserRequest, UserResponse
    │   │   └── repositories/
    │   └── transaction/
    │       ├── commands/
    │       ├── queries/
    │       ├── entities/
    │       └── repositories/
    ├── infrastructure/            # インフラ層
    │   ├── database/
    │   │   ├── client.ts
    │   │   ├── schema.prisma
    │   │   └── repositories/      # リポジトリ実装
    │   └── external/
    │       └── supabase.ts
    └── utils/
        ├── errors.ts
        └── validation.ts
```

## 2. 各層の責務

### 2.1 API Layer (`app/api/`)
- HTTPリクエスト/レスポンス処理
- 入力値バリデーション
- ドメインレイヤーのCommands/Queriesへの直接呼び出し

```typescript
// app/api/v1/auth/signup/route.ts
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const userRepository = new PrismaUserRepository();
    
    const body = await request.json();
    const validatedData = authSignupSchema.parse(body);
    const result = await signup(validatedData, userRepository);

    const response: AuthSignupResponse = {
      user: toUserResponse(result.user),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.status }
    );
  }
}
```

### 2.2 Domains Layer (`backend/domains/`)

#### Commands（書き込み操作）
- データの作成・更新・削除
- ビジネスルール検証

```typescript
// backend/domains/user/commands/signup.ts
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export async function createUser(
  input: CreateUserInput,
  userRepository: UserRepository
): Promise<User> {
  // ドメインルール検証
  if (await userRepository.existsByEmail(input.email)) {
    throw new DomainError('Email already exists');
  }
  
  const user = User.create(input);
  return await userRepository.save(user);
}
```

#### Queries（読み取り操作）
- データの読み取り専用操作

```typescript
// backend/domains/user/queries/getUserById.ts
export async function getUserById(
  id: string,
  userRepository: UserRepository
): Promise<User | null> {
  return await userRepository.findById(id);
}
```

#### Entities（ドメインエンティティ）
- ビジネスルール・不変条件
- ドメインオブジェクト
- API Request/Response型（DTO）

```typescript
// backend/domains/user/entities/User.ts
export class User {
  private constructor(
    public readonly id: number,
    public readonly auth_id: string,
    public readonly email: string,
    public readonly nickname: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
  
  static create(input: CreateUserInput): Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
    if (!input.auth_id || !input.email || !input.nickname) {
      throw new DomainError('Auth ID, email and nickname are required');
    }
    
    return {
      auth_id: input.auth_id,
      email: input.email,
      nickname: input.nickname.trim(),
    };
  }
}

// backend/domains/user/entities/UserResponse.ts
export interface UserResponse {
  id: number;
  email: string;
  nickname: string;
}

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
  };
}
```

### 2.3 Infrastructure Layer (`backend/infrastructure/`)
- データベースアクセス
- 外部サービス連携
- リポジトリ実装

```typescript
// backend/infrastructure/database/repositories/userRepository.ts
import { UserRepository } from '@/backend/domains/user/repositories/UserRepository';
import { User } from '@/backend/domains/user/entities/User';

class PrismaUserRepository implements UserRepository {
  async save(user: User): Promise<User> {
    const saved = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
    
    return new User(saved.id, saved.email, saved.name, saved.createdAt, saved.updatedAt);
  }
}

export const userRepository = new PrismaUserRepository();
```

## 3. Repository Interface

```typescript
// backend/domains/user/repositories/UserRepository.ts
import { User } from '../entities/User';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
```

## 4. 型定義とバリデーション

### ドメインエンティティと型定義

```typescript
// backend/domains/user/entities/User.ts
export class User {
  // ドメインエンティティの実装
}

// backend/domains/user/entities/UserRequest.ts
export interface AuthSignupRequest {
  email: string;
  password: string;
  nickname: string;
}

// backend/domains/user/entities/UserResponse.ts
export interface UserResponse {
  id: number;
  email: string;
  nickname: string;
}

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
  };
}
```

### バリデーション

```typescript
// backend/utils/validation.ts
export const authSignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  nickname: z.string().min(1).max(50)
});
```

## 5. 開発フロー

### 新機能開発の流れ（DDD）
1. **ドメインエンティティ** (`backend/domains/[feature]/entities/`)
2. **リポジトリInterface** (`backend/domains/[feature]/repositories/`)
3. **コマンド・クエリ** (`backend/domains/[feature]/commands/`, `queries/`)
4. **リポジトリ実装** (`backend/infrastructure/database/repositories/`)
5. **API エンドポイント** (`app/api/v1/[feature]/route.ts`)

### レイヤー間の依存関係
- **API Layer** → **Domain Layer**（Commands/Queries を直接呼び出し）
- **Domain Layer** → **Repository Interface**（実装には依存しない）
- **Infrastructure** → **Repository Interface** を実装

### フォルダ構成ルール
- ドメインロジックは `backend/domains/[domain-name]/` で管理
- 各ドメインは `commands/`, `queries/`, `entities/`, `repositories/` を含む
- インフラ層は `backend/infrastructure/` に配置
- API Layer でリポジトリインスタンスを注入してCommands/Queriesを呼び出し