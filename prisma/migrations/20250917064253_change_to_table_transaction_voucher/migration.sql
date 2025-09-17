/*
  Warnings:

  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Transaction";

-- CreateTable
CREATE TABLE "public"."TransactionVoucher" (
    "msisdn" TEXT NOT NULL,
    "trx_id" TEXT NOT NULL,
    "trx_date" TIMESTAMP(3) NOT NULL,
    "item" TEXT NOT NULL,
    "voucher_code" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "TransactionVoucher_pkey" PRIMARY KEY ("msisdn")
);
