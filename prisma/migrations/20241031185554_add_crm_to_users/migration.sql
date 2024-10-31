/*
  Warnings:

  - A unique constraint covering the columns `[crm]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "crm" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_crm_key" ON "users"("crm");
