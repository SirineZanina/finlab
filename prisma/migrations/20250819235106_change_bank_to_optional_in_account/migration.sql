-- DropForeignKey
ALTER TABLE "public"."accounts" DROP CONSTRAINT "accounts_bankId_fkey";

-- AlterTable
ALTER TABLE "public"."accounts" ALTER COLUMN "bankId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "public"."banks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
