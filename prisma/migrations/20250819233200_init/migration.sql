-- CreateEnum
CREATE TYPE "public"."BusinessIndustry" AS ENUM ('FINANCE', 'TECHNOLOGY', 'HEALTHCARE', 'EDUCATION', 'RETAIL', 'MANUFACTURING', 'REAL_ESTATE', 'HOSPITALITY', 'TRANSPORTATION', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."RoleType" AS ENUM ('ADMIN', 'OWNER', 'ACCOUNTANT', 'MEMBER', 'GUEST');

-- CreateEnum
CREATE TYPE "public"."Permission" AS ENUM ('VIEW_TRANSACTIONS', 'CREATE_TRANSACTIONS', 'EDIT_TRANSACTIONS', 'DELETE_TRANSACTIONS', 'EXPORT_REPORTS', 'MANAGE_USERS', 'MANAGE_BUDGETS');

-- CreateEnum
CREATE TYPE "public"."AccountSource" AS ENUM ('PLAID', 'MANUAL');

-- CreateEnum
CREATE TYPE "public"."AccountType" AS ENUM ('CREDIT_CARD', 'BANK_ACCOUNT');

-- CreateEnum
CREATE TYPE "public"."BankSource" AS ENUM ('PLAID', 'MANUAL');

-- CreateTable
CREATE TABLE "public"."countries" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."currencies" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."businesses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industry" "public"."BusinessIndustry" NOT NULL,
    "currencyId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "profilePhotoUrl" TEXT,
    "country" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "dwollaCustomerUrl" TEXT NOT NULL,
    "dwollaCustomerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_roles" (
    "id" TEXT NOT NULL,
    "roleType" "public"."RoleType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."permission_on_role" (
    "id" TEXT NOT NULL,
    "permission" "public"."Permission" NOT NULL,
    "roleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permission_on_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currencyId" TEXT NOT NULL,
    "source" "public"."AccountSource" NOT NULL DEFAULT 'MANUAL',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "shareableId" TEXT NOT NULL,
    "accountType" "public"."AccountType",
    "plaidId" TEXT,
    "officialName" TEXT,
    "mask" TEXT,
    "type" TEXT,
    "subtype" TEXT,
    "availableBalance" INTEGER DEFAULT 0,
    "currentBalance" INTEGER DEFAULT 0,
    "fundingSourceUrl" TEXT,
    "businessId" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "plaidId" TEXT,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."banks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "source" "public"."BankSource" NOT NULL DEFAULT 'MANUAL',
    "institutionId" TEXT,
    "institutionType" TEXT,
    "institutionName" TEXT,
    "institutionLogo" TEXT,
    "plaidId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transactions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "payee" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "paymentChannel" TEXT,
    "pending" BOOLEAN,
    "image" TEXT,
    "notes" TEXT,
    "accountId" TEXT NOT NULL,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "public"."countries"("code");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_code_key" ON "public"."currencies"("code");

-- CreateIndex
CREATE UNIQUE INDEX "businesses_name_key" ON "public"."businesses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_roleType_key" ON "public"."user_roles"("roleType");

-- CreateIndex
CREATE UNIQUE INDEX "permission_on_role_permission_roleId_key" ON "public"."permission_on_role"("permission", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_shareableId_key" ON "public"."accounts"("shareableId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_plaidId_key" ON "public"."accounts"("plaidId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_name_businessId_key" ON "public"."accounts"("name", "businessId");

-- CreateIndex
CREATE UNIQUE INDEX "banks_code_key" ON "public"."banks"("code");

-- CreateIndex
CREATE UNIQUE INDEX "banks_plaidId_key" ON "public"."banks"("plaidId");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_name_createdAt_accountId_key" ON "public"."transactions"("name", "createdAt", "accountId");

-- AddForeignKey
ALTER TABLE "public"."businesses" ADD CONSTRAINT "businesses_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "public"."currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."businesses" ADD CONSTRAINT "businesses_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "public"."countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."permission_on_role" ADD CONSTRAINT "permission_on_role_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."user_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "public"."currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "public"."banks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
