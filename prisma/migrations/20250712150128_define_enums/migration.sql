-- AlterTable
ALTER TABLE "Business" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "PermissionOnRole" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user_role" ALTER COLUMN "updatedAt" DROP DEFAULT;
