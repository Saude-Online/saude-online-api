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
          schedules: {
            include: {
              specialist: { select: { name: true } },
            },
          },
          examSchedule: {
            include: {
              exam: { select: { name: true } },
            },
          },
          anamneses: true
        },
      },
    },
  })

  if (!user) {
    throw new ResourceNotFoundError()
  }

  // Formatar os valores 'value' em R$
  const formatToBRL = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value / 100)

  if (user.patient) {
    // Remover campos indesejados de schedules
    user.patient.schedules = user.patient.schedules.map(schedule => {
      const { value, specialist, ...rest } = schedule // Remove 'value' e 'specialist'
      return {
        ...rest,
        formattedValue: formatToBRL(value),
        specialistName: specialist?.name,
      }
    })

    // Remover campos indesejados de examSchedule
    user.patient.examSchedule = user.patient.examSchedule.map(exam => {
      const { value, exam: examDetails, ...rest } = exam // Remove 'value' e 'exam'
      return {
        ...rest,
        formattedValue: formatToBRL(value),
        examName: examDetails?.name,
      }
    })
  }

  Reflect.deleteProperty(user, 'password')

  return {
    user,
  }
}
