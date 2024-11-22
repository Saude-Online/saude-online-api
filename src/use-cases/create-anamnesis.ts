import { prisma } from '@/lib/prisma'

interface CreateUseCaseRequest {
  patientId: string;
  age: number;
  weight: string;
  height: string;
  symptoms: string;
  medicalHistory?: string;
  allergies?: string;
}

export async function createAnamnesisUseCase({
  patientId,
  age,
  weight,
  height,
  symptoms,
  medicalHistory,
  allergies,
}: CreateUseCaseRequest) {
  // Verificando se o paciente existe
  const existingPatient = await prisma.patient.findUnique({
    where: {
      id: patientId,
    },
  })

  if (!existingPatient) {
    throw new Error('Paciente não encontrado.')
  }

  await prisma.anamnesis.create({
    data: {
      patientId,
      age,
      weight,
      height,
      symptoms,
      medicalHistory,
      allergies,
    },
  });
}
