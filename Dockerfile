FROM node:20.13.1-alpine

# 必要なパッケージをインストール
RUN apk add --no-cache g++ make py3-pip git

# 作業ディレクトリを /app に設定
WORKDIR /app

# Prisma スキーマと package.json をコピー
COPY ./src/prisma ./src/prisma
COPY package*.json ./

# 依存関係をインストール（キャッシュを活用）
RUN npm install --legacy-peer-deps

# Prisma クライアントを生成
RUN npx prisma generate

# ソースコードをコピー
COPY ./src /app/src

# ビルド環境を設定
ENV NODE_ENV=development

# Next.js アプリケーションの起動
CMD ["npm", "run", "dev"]
