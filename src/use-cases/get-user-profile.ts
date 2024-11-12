import { prisma } from '@/lib/prisma'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import type { User } from '@prisma/client'

interface getUserProfileUseCaseRequest {
  userId: string
}

interface getUserProfileUseCaseResponse {
  user: User
}

export async function getUserProfileUseCase({
  userId,
}: getUserProfileUseCaseRequest): Promise<getUserProfileUseCaseResponse> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      patient: {
        include: {
          schedules: true, // Inclui as consultas do paciente
        },
      },
    },
  })

  if (!user) {
    throw new ResourceNotFoundError()
  }

  if (user.patient) {
    user.schedules = user.patient.schedules
  }

  Reflect.deleteProperty(user, 'password')

  return {
    user,
  }
}
