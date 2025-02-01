# bill-split-app

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Directory structure

### Backend

```bash
src/
  ├── app/
  │   └── api/
  │      ├── v1/
  │      │   ├── endpoints/
  │      │   │   └── route.ts
  │      │   └── other-endpoints/
  │      │       └── route.ts
  │      ├── v2/                       # 将来のバージョン用
  │      │
  │      └── lib/
  │          ├── actions/              # DBとのやり取りやAPIロジック
  │          ├── constants/            # 共通定義（定数など）
  │          ├── errors/               # 共通エラー定義
  │          ├── types/                # 型定義をまとめる
  │          ├── domains/              # ドメインオブジェクト
  │          └── services/             # ビジネスロジックを管理
  │
```

### Frontend

@see https://zenn.dev/mybest_dev/articles/c0570e67978673

```bash
src/
  ├── app/
  │   └── page.tsx         # 一番親のコンポーネント
  │
  ├── components/          # 共通コンポーネント (Presentation Layer)
  │   ├── UI/              # 純粋なUIコンポーネント (Button, Modal)
  │   └── Layout/          # レイアウトコンポーネント (Header, Footer)
  │
  ├── pages/               # 各ページ (Feature Element)
  │   ├── Home/            # ホームページ (Feature Element)
  │   │   ├── components/  # ホームページ固有のコンポーネント (Presentation Layer)
  │   │   └── api/         # ホームページ関連API呼び出し (Data Access Layer)
  │   │
  │   └── Profile/         # プロフィールページ (Feature Element)
  │       ├── components/  # プロフィールページ固有のコンポーネント (Presentation Layer)
  │       └── api/         # プロフィール関連API呼び出し (Data Access Layer)
  │
  ├── utils/               # ユーティリティ関数 (Business Logic Layer)
  │
  ├── api/                 # グローバルなAPI通信ロジック (Data Access Layer)
  │
  ├── store/               # 状態管理 (Business Logic Layer)
  │
  └── styles/              # 共通スタイル (Presentation Layer)
```
