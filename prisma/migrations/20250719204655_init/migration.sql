-- CreateEnum
CREATE TYPE "BusinessIndustry" AS ENUM ('FINANCE', 'TECHNOLOGY', 'HEALTHCARE', 'EDUCATION', 'RETAIL', 'MANUFACTURING', 'REAL_ESTATE', 'HOSPITALITY', 'TRANSPORTATION', 'OTHER');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('ADMIN', 'OWNER', 'ACCOUNTANT', 'MEMBER');

-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('VIEW_TRANSACTIONS', 'CREATE_TRANSACTIONS', 'EDIT_TRANSACTIONS', 'DELETE_TRANSACTIONS', 'EXPORT_REPORTS', 'MANAGE_USERS', 'MANAGE_BUDGETS');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('DEPOSITORY', 'CREDIT', 'LOAN', 'INVESTMENT', 'OTHER');

-- CreateTable
CREATE TABLE "businesses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industry" "BusinessIndustry" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "profilePhotoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "country" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "dwollaCustomerUrl" TEXT NOT NULL,
    "dwollaCustomerId" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "roleType" "RoleType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission_on_role" (
    "id" TEXT NOT NULL,
    "permission" "Permission" NOT NULL,
    "roleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permission_on_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "availableBalance" DECIMAL(65,30) NOT NULL,
    "currentBalance" DECIMAL(65,30) NOT NULL,
    "officialName" TEXT NOT NULL,
    "mask" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "type" "AccountType" NOT NULL,
    "subtype" TEXT NOT NULL,
    "shareableId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bankId" TEXT NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "paymentChannel" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "pending" BOOLEAN NOT NULL,
    "category" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "image" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "senderBankId" TEXT NOT NULL,
    "receiverBankId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banks" (
    "id" TEXT NOT NULL,
    "plaidAccountId" TEXT NOT NULL,
    "plaidBankId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "fundingSourceUrl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shareableId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "businesses_name_key" ON "businesses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_roleType_key" ON "user_roles"("roleType");

-- CreateIndex
CREATE UNIQUE INDEX "permission_on_role_permission_roleId_key" ON "permission_on_role"("permission", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_name_businessId_key" ON "accounts"("name", "businessId");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_name_date_accountId_businessId_key" ON "transactions"("name", "date", "accountId", "businessId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission_on_role" ADD CONSTRAINT "permission_on_role_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "user_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "banks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
