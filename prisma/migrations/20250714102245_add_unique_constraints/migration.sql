/*
  Warnings:

  - A unique constraint covering the columns `[description,date,accountId,businessId]` on the table `Expense` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Expense_description_date_accountId_businessId_key" ON "Expense"("description", "date", "accountId", "businessId");
