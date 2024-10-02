# bill-split-app

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
% docker compose build
% docker compose up -d
```

You can now access the app at [http://localhost:3000](http://localhost:3000).

## Prisma

Prisma is an ORM (Object-Relational Mapping) tool used in this project to interact with the PostgreSQL database in a type-safe and efficient manner. It simplifies database schema management and data operations such as querying and updating.

### Prisma Setup
1. **Running Migrations**: 
To apply changes to the database, run the following Prisma migration command. This will create tables in the database based on the schema.prisma file.

```bash
npx prisma migrate dev --name init
```

This command will also generate the Prisma Client, allowing you to interact with the database through your code.

2. **Prisma Studio**: 
Prisma Studio is a web-based UI that allows you to visually interact with your database. You can start Prisma Studio with the following command:

```bash
npx prisma studio
```

After running the command, open your browser and go to http://localhost:5555 to access Prisma Studio.

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
  └── prisma/
      └── schema.prisma                # Prismaスキーマファイル
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
