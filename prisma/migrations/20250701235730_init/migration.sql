-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('AWAITING', 'COMPLETED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "auth_id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "note" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'AWAITING',
    "creator_id" INTEGER NOT NULL,
    "payment_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "debt_relations" (
    "id" SERIAL NOT NULL,
    "payment_id" INTEGER NOT NULL,
    "payee_id" INTEGER NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'AWAITING',
    "split_amount" INTEGER NOT NULL,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "debt_relations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_id_key" ON "users"("auth_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "debt_relations" ADD CONSTRAINT "debt_relations_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "debt_relations" ADD CONSTRAINT "debt_relations_payee_id_fkey" FOREIGN KEY ("payee_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
