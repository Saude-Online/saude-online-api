-- CreateTable
CREATE TABLE "schedules" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "dateHour" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "patientId" ON "schedules"("patientId");

-- CreateIndex
CREATE INDEX "dateHour" ON "schedules"("dateHour");

-- CreateIndex
CREATE INDEX "patientId_date" ON "schedules"("patientId", "dateHour");

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
