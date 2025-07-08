# ミニマムフロントエンドアーキテクチャ設計（Next.js App Router × React × FSD）

## 1. アーキテクチャ全体像

- **Features中心構造**を採用（FSDライト版）
- **App Routerは薄いレイヤー**（ルーティング + 呼び出しのみ）
- **機能単位での明確な分離**

### ディレクトリ構成

```
src/
├── app/                           # Next.js App Router（ページ呼び出しのみ）
│   ├── login/
│   │   └── page.tsx
│   └── signup/
│       └── page.tsx
└── frontend/                      # フロントエンド専用
    ├── features/                  # 機能別実装
    │   ├── dashboard/
    │   │   ├── components/
    │   │   │   ├── DashboardPage.tsx
    │   │   │   ├── StatisticsCards.tsx
    │   │   │   └── RecentTransactions.tsx
    │   │   ├── hooks/
    │   │   │   ├── useDashboard.ts
    │   │   │   └── useTransactions.ts
    │   │   └── api.ts             # ダッシュボード機能のAPI関数
    │   ├── settings/
    │   │   ├── components/
    │   │   │   ├── SettingsPage.tsx
    │   │   │   ├── ProfileForm.tsx
    │   │   │   └── AccountSettings.tsx
    │   │   ├── hooks/
    │   │   │   └── useSettings.ts
    │   │   └── api.ts             # 設定機能のAPI関数
    │   ├── login/
    │   │   ├── components/
    │   │   │   ├── LoginPage.tsx
    │   │   │   └── LoginForm.tsx
    │   │   ├── hooks/
    │   │   │   └── useLogin.ts
    │   │   └── api.ts             # ログイン機能のAPI関数
    │   └── signup/
    │       ├── components/
    │       │   ├── SignupPage.tsx
    │       │   └── SignupForm.tsx
    │       ├── hooks/
    │       │   └── useSignup.ts
    │       └── api.ts             # サインアップ機能のAPI関数
    ├── shared/                    # 共通コンポーネント・ユーティリティ
    │   ├── ui/                    # Button, Input, Card...
    │   ├── layout/                # Header, Sidebar...
    │   ├── hooks/                 # 汎用フック
    │   │   ├── useToast.ts
    │   │   ├── useLocalStorage.ts
    │   │   └── useApi.ts
    │   └── utils/
    │       ├── api.ts             # APIクライアント
    │       ├── format.ts
    │       └── cn.ts
    ├── types/                     # 型定義
    │   ├── api.ts
    │   └── common.ts
    └── lib/                       # 設定・初期化
        ├── config.ts
        └── constants.ts
```

## 2. 各層の責務

### 2.1 App Layer (`app/`)
- Next.js App Router によるルーティング
- ページレベルのレイアウト・メタデータ
- **実装はfrontend/features/配下に移譲**

```typescript
// app/login/page.tsx
import { LoginPage } from '@/frontend/features/login/components/LoginPage';

export const metadata = { title: 'Sign In | monetant' };
export default function Login() {
  return <LoginPage />;
}
```

### 2.2 Features Layer (`frontend/features/`)
- 機能別の実装とその機能固有のコンポーネント
- その機能でしか使わないコンポーネントは同じディレクトリに配置
- 機能固有のAPI・フック（`api.ts`でその機能のAPI呼び出しをまとめる）

各機能の`api.ts`例：
- `frontend/features/dashboard/api.ts` - ダッシュボード機能で使用するAPI関数
- `frontend/features/login/api.ts` - ログイン機能で使用するAPI関数
- `frontend/features/signup/api.ts` - サインアップ機能で使用するAPI関数
- `frontend/features/settings/api.ts` - 設定機能で使用するAPI関数

```typescript
// frontend/features/dashboard/api.ts
export const getDashboardStats = async () => {
  const response = await fetch('/api/v1/dashboard/stats');
  return response.json();
};

export const getRecentTransactions = async () => {
  const response = await fetch('/api/v1/transactions/recent');
  return response.json();
};
```

```typescript
// frontend/features/dashboard/components/DashboardPage.tsx
import { StatisticsCards } from './StatisticsCards';
import { RecentTransactions } from './RecentTransactions';
import { useDashboard } from '../hooks/useDashboard';

export function DashboardPage() {
  const { stats, transactions, isLoading } = useDashboard();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <StatisticsCards stats={stats} />
      <RecentTransactions transactions={transactions} />
    </div>
  );
}
```

### 2.3 Shared Layer (`frontend/shared/`)
- 複数ページで再利用可能なコンポーネント
- 汎用的なフック・ユーティリティ

```typescript
// frontend/shared/ui/Button.tsx
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
```

### 2.4 Types & Lib
- 型定義とアプリケーション設定

```typescript
// frontend/types/api.ts
export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

// frontend/shared/utils/api.ts
export const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
});
```

## 3. 開発フロー

### 新機能開発の流れ
1. **型定義** (`frontend/types/api.ts`)
2. **機能ディレクトリ作成** (`frontend/features/[feature-name]/`)
3. **機能固有API** (`frontend/features/[feature-name]/api.ts`)
4. **機能固有フック** (`frontend/features/[feature-name]/hooks/`)
5. **機能コンポーネント** (`frontend/features/[feature-name]/components/`)
6. **App Router設定** (`app/[route]/page.tsx`)

### 機能内コンポーネント追加の流れ
1. **同機能内componentsディレクトリに追加**
2. **必要に応じてhooksディレクトリに追加**
3. **共通性が出てきたらsharedに移動**

## 4. コンポーネント配置ルール

### 機能配下に配置（結合度高）
- その機能でしか使わないコンポーネント
- 機能固有のロジック・フック
- 機能固有のAPI関数（`api.ts`でその機能のAPI呼び出しをまとめる）

### shared配下に配置（結合度低）
- 複数機能で使う可能性があるコンポーネント
- 汎用的なUI部品（Button, Input, Modal など）
- 汎用的なフック・ユーティリティ

### 移動のタイミング
- **最初は機能配下で作成**
- **2つ目の機能で同じようなものが必要になったらsharedに移動**
- **premature abstractionを避ける**

---

この設計により、シンプルでありながらスケールしやすい構造を実現できます。