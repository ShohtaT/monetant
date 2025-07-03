# アーキテクチャ設計概要（Next.js × TypeScript × Prisma × Supabase）

このドキュメントでは、Next.js (App Router) × TypeScript × Prisma × Supabase を用いたフルスタックアプリケーションのアーキテクチャ概要について説明します。

---

## 設計方針

- **シンプルでありながら拡張可能**な構造
- **最小限のディレクトリ層**で管理
- **明確な責任分離**による保守性の向上
- **型安全性**を重視した実装

---

## アーキテクチャ構成

### バックエンド
- **API Layer**: Next.js API Routes による RESTful API
- **Domains Layer**: ドメインロジック（Commands/Queries/Entities）
- **Infrastructure Layer**: データベース・外部サービス連携

### フロントエンド
- **App Layer**: Next.js App Router によるルーティング
- **Features Layer**: 機能別のコンポーネント・ロジック
- **Components Layer**: 共通UIコンポーネント
- **Lib Layer**: ユーティリティ・設定

---

## 詳細設計

詳細なアーキテクチャ設計については、以下のドキュメントを参照してください：

- **[バックエンドアーキテクチャ](./backend-architecture.md)**: API Routes、サービス層、データベース設計
- **[フロントエンドアーキテクチャ](./frontend-architecture.md)**: コンポーネント設計、状態管理、UI層

---

## 開発フロー

### バックエンド新機能開発
1. ドメインエンティティ (`backend/domains/[feature]/entities/`)
2. リポジトリInterface (`backend/domains/[feature]/repositories/`)
3. コマンド・クエリ (`backend/domains/[feature]/commands/`, `queries/`)
4. リポジトリ実装 (`backend/infrastructure/database/repositories/`)
5. API エンドポイント (`app/api/v1/[feature]/route.ts`)

### フロントエンド新機能開発
1. 型定義 (`frontend/types/api.ts`)
2. 機能ディレクトリ作成 (`frontend/features/[feature-name]/`)
3. 機能固有API・フック (`frontend/features/[feature-name]/api.ts`, `hooks/`)
4. 機能コンポーネント (`frontend/features/[feature-name]/components/`)
5. App Router設定 (`app/[route]/page.tsx`)

---

## ディレクトリ構成の要約

```
src/
├── app/                    # Next.js App Router + API Routes
│   ├── (app)/             # Protected pages
│   ├── auth/              # Auth pages
│   └── api/v1/            # API endpoints
├── frontend/              # フロントエンド専用
│   ├── features/         # 機能別実装（結合度の高いコンポーネント含む）
│   ├── shared/           # 共通コンポーネント・ユーティリティ
│   ├── types/            # 型定義
│   └── lib/              # 設定・初期化
└── backend/               # バックエンド専用
    ├── domains/           # ドメインロジック
    │   ├── auth/         # 認証ドメイン
    │   ├── user/         # ユーザードメイン
    │   └── transaction/  # トランザクションドメイン
    ├── infrastructure/   # インフラ層
    │   ├── database/     # データベース設定・実装
    │   └── external/     # 外部サービス
    ├── utils/            # 共通ユーティリティ
    └── types/            # 型定義
```

この設計により、シンプルでありながら拡張可能な堅牢なフルスタックアプリケーションを構築できます。