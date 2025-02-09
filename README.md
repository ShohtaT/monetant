# bill-split-app

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### ESLint and Prettier

```
yarn run lint-fix
```

## Supabase

This project uses Supabase as a backend. You can check the data on the dashboard.

https://supabase.com/dashboard/projects

### Vercel environment connected to Supabase
※Your local environment is connected to `bill-split-app-develop` in Supabase.

`bill-split-app-develop` in Supabase
- development
- preview

`bill-split-app-prod` in Supabase
- prod

## Deploy on Vercel

### Production

Primary project environment meant to serve qualified, promoted deployments to real users.
To deploy to prod environment, push to the `main` branch.

### Preview

Standard environment — included with all Vercel projects — for previewing changes before promoting them to production.
To deploy to preview environment, push to the some branch.

### Development

Standard environment — included with all Vercel projects — used to supply environment variables in local development.

## Structure
@ref https://zenn.dev/yutabeee/articles/0f7e8e2fa03946

```
src/
├── app/
│   ├── api/
│   │   └── hello/
│   │       └── route.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── button.module.css
│   │   │   │   └── button.test.tsx
│   │   │   └── card/
│   │   │       ├── page.tsx
│   │   │       ├── card.module.css
│   │   │       └── card.test.tsx
│   │   └── layout/
│   │       ├── footer/
│   │       │   ├── page.tsx
│   │       │   ├── footer.module.css
│   │       │   └── footer.test.tsx
│   │       ├── header/
│   │       │   ├── page.tsx
│   │       │   ├── header.module.css
│   │       │   └── header.test.tsx
│   │       └── layout.tsx
│   ├── hooks/
│   │   └── use-custom-hook.ts
│   ├── lib/
│   │   ├── db.ts
│   │   └── utils.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── theme.ts
│   ├── types/
│   │   └── index.d.ts
│   ├── page.tsx
│   ├── layout.tsx
│   ├── head.tsx
│   ├── error.tsx
│   └── loading.tsx
└── public/
    ├── images/
    │   ├── favicon.ico
    │   └── logo.svg
    └── fonts/
```