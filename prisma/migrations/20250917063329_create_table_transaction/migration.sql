-- CreateTable
CREATE TABLE "public"."Transaction" (
    "msisdn" TEXT NOT NULL,
    "trx_id" TEXT NOT NULL,
    "trx_date" TIMESTAMP(3) NOT NULL,
    "item" TEXT NOT NULL,
    "voucher_code" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("msisdn")
);
