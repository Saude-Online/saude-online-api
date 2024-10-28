import { prisma } from '@/lib/prisma'
import { PatientAlreadyExistsError } from '@/use-cases/errors/patient-already-exists'

interface CreatePatientUseCaseRequest {
  name: string
  age: number
  document: string
}

export async function createPatientUseCase({
  name,
  age,
  document,
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
      age,
      document,
    },
  })
}
