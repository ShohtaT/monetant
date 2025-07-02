# 割り勘アプリ (bill-split-app)

このプロジェクトは [Next.js](https://nextjs.org) を使用し、[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)で構築されています。

## アーキテクチャ

本アプリケーションはクリーンアーキテクチャの原則に基づいて設計されています。
詳細な設計思想とアーキテクチャの説明については [アーキテクチャドキュメント](./docs/architecture.md) を参照してください。

## プロジェクトの主要ディレクトリ

主要なディレクトリ構成は以下の通りです：

- `/src/app`: Next.js App Routerベースのページコンポーネント
- `/src/components`: 再利用可能なUIコンポーネント
- `/src/services`: ビジネスロジック層
- `/src/repositories`: データアクセス層（Supabase連携）
- `/src/stores`: アプリケーションの状態管理（Zustand）
- `/src/types`: TypeScript型定義

詳細なディレクトリ構造と各層の責務については [アーキテクチャドキュメント](./docs/architecture.md) を参照してください。

## 開発を始める

### 前提条件

- Node.js 20.15.0以上
- pnpm 10.10.0以上
- Docker（データベース用）

### インストール

```bash
pnpm install
```

### データベースの起動（Docker）

```bash
# PostgreSQLコンテナを起動
docker-compose up -d

# データベースの状態確認
docker-compose ps
```

### 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認できます。

`app/page.tsx` を編集することでページの編集を開始できます。ファイルを編集すると、ページは自動的に更新されます。

このプロジェクトでは、Vercelの新しいフォントファミリーである [Geist](https://vercel.com/font) を自動的に最適化して読み込むために [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) を使用しています。

### コード整形とリント

コードの整形とリントを実行するには：

```bash
pnpm lint-fix
```

### ビルド

```bash
pnpm build
```

## データベース (Prisma + PostgreSQL)

### Prismaとは

Prismaは現代的なTypeScript/JavaScript向けのORM（Object-Relational Mapping）ツールです。以下の特徴があります：

- **型安全性**: TypeScriptと完全に統合され、コンパイル時に型チェックが可能
- **スキーマファースト**: データベーススキーマを宣言的に定義
- **自動生成**: データベーススキーマからTypeScript型とクライアントコードを自動生成
- **マイグレーション**: データベーススキーマの変更を安全に管理

### データベース構成

- **データベース**: PostgreSQL 15（Dockerで起動）
- **ORM**: Prisma
- **主要テーブル**: 
  - `users`: ユーザー情報
  - `payments`: 支払い情報
  - `debt_relations`: 債務関係

### データベース操作コマンド

```bash
# データベース起動
docker-compose up -d

# データベース停止
docker-compose down

# Prismaスキーマの変更をマイグレーション
pnpm db:migrate

# Prismaクライアントの再生成
pnpm db:generate

# Prisma Studio（GUI）を起動
pnpm db:studio

# データベースをリセット（全データ削除）
pnpm db:reset
```

### Prismaの使い方

#### 1. データベース接続

```typescript
import { prisma } from '@/lib/prisma';
```

#### 2. 基本的なCRUD操作

```typescript
// ユーザー作成
const user = await prisma.user.create({
  data: {
    auth_id: 'user123',
    nickname: 'John Doe',
    email: 'john@example.com'
  }
});

// ユーザー取得
const users = await prisma.user.findMany();

// 特定ユーザー取得
const user = await prisma.user.findUnique({
  where: { id: 1 }
});

// ユーザー更新
const updatedUser = await prisma.user.update({
  where: { id: 1 },
  data: { nickname: 'Updated Name' }
});

// ユーザー削除
await prisma.user.delete({
  where: { id: 1 }
});
```

#### 3. リレーション操作

```typescript
// 支払いを関連情報と一緒に取得
const payment = await prisma.payment.findUnique({
  where: { id: 1 },
  include: {
    creator: true,
    debtRelations: {
      include: {
        payee: true
      }
    }
  }
});

// 支払いと債務関係を同時作成
const payment = await prisma.payment.create({
  data: {
    title: '飲み会',
    amount: 5000,
    creator_id: 1,
    debtRelations: {
      create: [
        {
          payee_id: 2,
          split_amount: 2500,
          status: 'AWAITING'
        }
      ]
    }
  }
});
```

### スキーマファイル

データベーススキーマは `prisma/schema.prisma` で定義されています。
スキーマを変更した後は必ず以下を実行してください：

```bash
pnpm db:migrate
```

## バックエンド (Supabase)

このプロジェクトはバックエンドとしてSupabaseを使用しています。データはダッシュボードで確認できます：

https://supabase.com/dashboard/projects

### Supabaseと連携するVercel環境

※ローカル環境はSupabaseの`bill-split-app-develop`に接続されています。

Supabaseの`bill-split-app-develop`環境：

- 開発環境
- プレビュー環境

Supabaseの`bill-split-app-prod`環境：

- 本番環境

## Vercelへのデプロイ

### 本番環境（Production）

実際のユーザーに提供するための主要なプロジェクト環境です。
本番環境にデプロイするには、`main`ブランチにプッシュします。

### プレビュー環境（Preview）

本番環境に反映する前に変更を確認するための標準環境です。
プレビュー環境にデプロイするには、任意のブランチにプッシュします。

### 開発環境（Development）

ローカル開発で環境変数を提供するために使用される標準環境です。
