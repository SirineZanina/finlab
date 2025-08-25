/*
  Warnings:

  - Added the required column `dialCode` to the `countries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneFormat` to the `countries` table without a default value. This is not possible if the table is not empty.
  - Made the column `flagUrl` on table `countries` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."countries" ADD COLUMN     "dialCode" TEXT NOT NULL,
ADD COLUMN     "phoneFormat" TEXT NOT NULL,
ALTER COLUMN "flagUrl" SET NOT NULL;
