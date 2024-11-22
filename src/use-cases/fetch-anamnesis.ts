import { prisma } from '@/lib/prisma'
import type { Anamnesis } from '@prisma/client'

interface fetchAnamnesisUseCaseRequest {
  page: number
}

interface fetchAnamnesisUseCaseResponse {
  anamnesis: Anamnesis[]
}

export async function fetchAnamnesisUseCase({
  page,
}: fetchAnamnesisUseCaseRequest): Promise<fetchAnamnesisUseCaseResponse> {
  const anamnesis = await prisma.anamnesis.findMany({
    take: 20,
    skip: (page - 1) * 20,
  })

  return {
    anamnesis,
  }
}
