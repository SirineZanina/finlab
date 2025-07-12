/*
  Warnings:

  - Added the required column `updatedAt` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `industry` on the `Business` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `PermissionOnRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `user_role` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BusinessIndustry" AS ENUM ('FINANCE', 'TECHNOLOGY', 'HEALTHCARE', 'EDUCATION', 'RETAIL', 'MANUFACTURING', 'REAL_ESTATE', 'HOSPITALITY', 'TRANSPORTATION', 'OTHER');

-- DropForeignKey
ALTER TABLE "PermissionOnRole" DROP CONSTRAINT "PermissionOnRole_roleId_fkey";

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "industry",
ADD COLUMN     "industry" "BusinessIndustry" NOT NULL;

-- AlterTable
ALTER TABLE "PermissionOnRole" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "roleId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_role" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "PermissionOnRole" ADD CONSTRAINT "PermissionOnRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "user_role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
