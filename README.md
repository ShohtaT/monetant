# bill-aplit-app

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
