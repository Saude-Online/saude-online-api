/*
  Warnings:

  - A unique constraint covering the columns `[document]` on the table `patients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `patients` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "userId" TEXT,
ALTER COLUMN "age" DROP NOT NULL,
ALTER COLUMN "age" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "patients_document_key" ON "patients"("document");

-- CreateIndex
CREATE UNIQUE INDEX "patients_userId_key" ON "patients"("userId");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
