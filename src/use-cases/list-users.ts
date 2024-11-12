import { prisma } from '@/lib/prisma'
import type { User } from '@prisma/client'

interface listUsersUseCaseRequest {
  query: string
  page: number
  isDoctor?: boolean
}

interface listUsersUseCaseResponse {
  users: User[]
}

export async function listUsersUseCase({
  query,
  page,
  isDoctor = false,
}: listUsersUseCaseRequest): Promise<listUsersUseCaseResponse> {
  const users = await prisma.user.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
      crm: isDoctor ? { not: null } : undefined,
    },
    include: {
      specialties: true,
    },
    take: 20,
    skip: (page - 1) * 20,
  })

  return {
    users,
  }
}
