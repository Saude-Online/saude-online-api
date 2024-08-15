import { prisma } from '@/lib/prisma'

interface deletePatientUseCaseRequest {
  id: string
}

export async function deletePatientUseCase({
  id,
}: deletePatientUseCaseRequest): Promise<void> {
  await prisma.patient.delete({
    where: {
      id,
    },
  })
}
