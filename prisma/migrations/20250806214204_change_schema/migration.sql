-- AlterTable
ALTER TABLE "public"."transactions" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "paymentChannel" DROP NOT NULL;
