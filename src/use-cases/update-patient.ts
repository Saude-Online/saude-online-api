import { prisma } from '@/lib/prisma'
import type { Patient } from '@prisma/client'

interface updatePatientUseCaseRequest {
  id: string
  data: {
    name?: string
    age?: number | null
    weight?: string
    height?: string
    document?: string
    avatar?: string
  }
}

export async function updatePatientUseCase({
  id,
  data,
}: updatePatientUseCaseRequest): Promise<Patient> {
  const patient = await prisma.patient.update({
    where: {
      id,
    },
    data,
  })

  return patient
}
