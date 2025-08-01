/*
  Warnings:

  - You are about to drop the `new_accounts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "new_accounts";

-- CreateTable
CREATE TABLE "manual_accounts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessId" TEXT,

    CONSTRAINT "manual_accounts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "manual_accounts" ADD CONSTRAINT "manual_accounts_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
