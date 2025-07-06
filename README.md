# 割り勘アプリ (monetant)

このプロジェクトは [Next.js](https://nextjs.org) を使用し、[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)で構築されています。

## アーキテクチャ

本アプリケーションはクリーンアーキテクチャの原則に基づいて設計されています。

- **全体設計**: [アーキテクチャ概要](./docs/architecture/architecture.md)
- **バックエンド**: [バックエンドアーキテクチャ](./docs/architecture/backend-architecture.md) 
- **フロントエンド**: [フロントエンドアーキテクチャ](./docs/architecture/frontend-architecture.md)

## 要件・設計

- **機能要件・技術仕様**: [Version 1.0 設計書](./docs/designdoc/ver1-0.md)
- **API実装**: [API実装タスク](./docs/tasks/impl-api.md)

## 開発を始める

### 前提条件

- Node.js 20.15.0以上
- pnpm 10.10.0以上

### インストール

```bash
pnpm install
```

### 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認できます。

### コード整形とリント

```bash
pnpm lint-fix
```

### ビルド

```bash
pnpm build
```

## データベース

- **データベース**: PostgreSQL（Supabase）
- **ORM**: Prisma
- **スキーマファイル**: `prisma/schema.prisma`

### データベース操作コマンド

```bash
# Prismaスキーマの変更をマイグレーション
pnpm db:migrate

# Prismaクライアントの再生成
pnpm db:generate

# Prisma Studio（GUI）を起動
pnpm db:studio

# データベースをリセット（全データ削除）
pnpm db:reset
```

## バックエンド

- **認証**: Supabase Authentication
- **データベース**: Supabase PostgreSQL
- **API**: Next.js API Routes

## デプロイ

### 環境構成

- **本番環境**: `main`ブランチ → Vercel Production
- **プレビュー環境**: その他のブランチ → Vercel Preview
- **開発環境**: ローカル開発環境
