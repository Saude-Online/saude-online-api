import { prisma } from '@/lib/prisma'
import type { Patient } from '@prisma/client'

interface fetchPatientsUseCaseRequest {
  query: string
  page: number
}

interface fetchPatientsUseCaseResponse {
  patients: Patient[]
}

export async function fetchPatientsUseCase({
  query,
  page,
}: fetchPatientsUseCaseRequest): Promise<fetchPatientsUseCaseResponse> {
  const patients = await prisma.patient.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive', // Torna a busca case-insensitive
      },
    },
    take: 20,
    skip: (page - 1) * 20,
  })

  return {
    patients,
  }
}
