# 割り勘アプリ (bill-split-app)

このプロジェクトは [Next.js](https://nextjs.org) を使用し、[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)で構築されています。

## プロジェクトの構造

```
src/
├── app/                  # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx          # ルートページ
│   ├── login/            # ログインページ
│   ├── signup/           # サインアップページ
│   ├── mypage/           # マイページ
│   └── payments/         # 支払い関連ページ
│       ├── page.tsx           # 支払い一覧
│       ├── card.tsx          # 支払いカードコンポーネント
│       ├── [id]/             # 支払い詳細ページ
│       │   ├── page.tsx
│       │   ├── card.tsx
│       │   └── paymentDetail.tsx
│       ├── fromme/          # 自分が作成した支払い
│       │   ├── page.tsx
│       │   └── card.tsx
│       ├── new/            # 新規支払い作成
│       │   ├── page.tsx
│       │   └── billingsForm.tsx
│       └── tome/           # 自分への支払い
│           ├── page.tsx
│           └── card.tsx
│
├── components/           # 再利用可能なコンポーネント
│   └── common/
│       ├── loading.tsx
│       ├── navigation.tsx
│       ├── form/            # フォームコンポーネント
│       │   ├── inputField.tsx
│       │   ├── inputNumberField.tsx
│       │   ├── submitButton.tsx
│       │   └── textarea.tsx
│       └── providers/
│
├── hooks/               # カスタムReactフック
│   └── useAuth.ts
│
├── lib/                # ライブラリと設定
│   └── supabase/
│       └── supabaseClient.ts
│
├── repositories/       # データアクセス層
│   ├── authRepository.ts
│   ├── debtRelationRepository.ts
│   ├── paymentRepository.ts
│   └── userRepository.ts
│
├── services/          # ビジネスロジック層
│   ├── authService.ts
│   ├── debtRelationService.ts
│   └── paymentService.ts
│
├── stores/            # 状態管理
│   ├── navigation.ts
│   ├── payments.ts
│   └── users.ts
│
├── styles/           # グローバルスタイル
│   └── globals.css
│
└── types/            # TypeScript型定義
    ├── debtRelation.ts
    ├── payment.ts
    └── user.ts
```

### ディレクトリ構造の詳細

#### App Router (`src/app/`)

- Next.js 13+のApp Routerを使用したページ構成
- 各機能ごとにディレクトリを分割し、関連するコンポーネントを配置

#### コンポーネント (`src/components/`)

- 再利用可能なUIコンポーネント
- `common/`: アプリケーション全体で使用される共通コンポーネント
- `form/`: フォーム関連のコンポーネント

#### リポジトリ (`src/repositories/`)

- データアクセス層
- Supabaseとの通信を担当
- 各機能ごとにリポジトリクラスを実装

#### サービス (`src/services/`)

- ビジネスロジック層
- リポジトリを使用してデータの操作を行う
- アプリケーションのコアロジックを実装

#### ストア (`src/stores/`)

- アプリケーションの状態管理
- Zustandを使用した状態管理の実装

#### 型定義 (`src/types/`)

- TypeScriptの型定義
- インターフェースやタイプエイリアスを定義

#### その他のディレクトリ

- `hooks/`: カスタムReactフック
- `lib/`: 外部ライブラリの設定（Supabaseなど）
- `styles/`: グローバルスタイル定義

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
