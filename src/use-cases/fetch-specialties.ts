import { prisma } from '@/lib/prisma'
import { Specialty } from '@prisma/client'

interface fetchSpecialtiesUseCaseResponse {
  specialties: Specialty[]
}

export async function fetchSpecialtiesUseCase(): Promise<fetchSpecialtiesUseCaseResponse> {
  const specialties = await prisma.specialty.findMany()

  return { specialties }
}
