/*
  Warnings:

  - Added the required column `specialistId` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "specialistId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
