import { prisma } from '@/lib/prisma'
import { PatientAlreadyExistsError } from '@/use-cases/errors/patient-already-exists'

interface CreatePatientUseCaseRequest {
  name: string
  age: number | null
  document: string
  userId: string
}

export async function createPatientUseCase({
  name,
  age,
  document,
  userId,
}: CreatePatientUseCaseRequest) {
  const patientWithSameDocument = await prisma.patient.findFirst({
    where: {
      document,
    },
  })

  if (patientWithSameDocument) {
    throw new PatientAlreadyExistsError()
  }

  await prisma.patient.create({
    data: {
      name,
      age: age ?? undefined,
      document,
      user: {
        connect: { id: userId }, // Conectando o paciente ao usuário existente
      },
    },
  })
}
