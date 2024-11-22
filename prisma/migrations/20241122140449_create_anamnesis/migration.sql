-- CreateTable
CREATE TABLE "anamneses" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "symptoms" TEXT NOT NULL,
    "medicalHistory" TEXT,
    "allergies" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anamneses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "anamneses" ADD CONSTRAINT "anamneses_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
