-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('OWNER', 'ACCOUNTANT', 'MEMBER');

-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('VIEW_TRANSACTIONS', 'CREATE_TRANSACTIONS', 'EDIT_TRANSACTIONS', 'DELETE_TRANSACTIONS', 'EXPORT_REPORTS', 'MANAGE_USERS', 'MANAGE_BUDGETS');

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industry" TEXT NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "country" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "id" TEXT NOT NULL,
    "roleType" "RoleType" NOT NULL,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionOnRole" (
    "id" TEXT NOT NULL,
    "permission" "Permission" NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "PermissionOnRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_role_roleType_key" ON "user_role"("roleType");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionOnRole_permission_roleId_key" ON "PermissionOnRole"("permission", "roleId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "user_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionOnRole" ADD CONSTRAINT "PermissionOnRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "user_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
