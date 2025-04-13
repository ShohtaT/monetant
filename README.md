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

開発サーバーを起動するには：

```bash
yarn dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認できます。

`app/page.tsx` を編集することでページの編集を開始できます。ファイルを編集すると、ページは自動的に更新されます。

このプロジェクトでは、Vercelの新しいフォントファミリーである [Geist](https://vercel.com/font) を自動的に最適化して読み込むために [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) を使用しています。

### コード整形とリント

コードの整形とリントを実行するには：

```bash
yarn run lint-fix
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
