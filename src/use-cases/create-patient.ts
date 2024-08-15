import { prisma } from '@/lib/prisma'
import { PatientAlreadyExistsError } from '@/use-cases/errors/patient-already-exists'

interface CreateUseCaseRequest {
  name: string
  document: string
}

export async function createUseCase({ name, document }: CreateUseCaseRequest) {
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
      document,
    },
  })
}
