import { prisma } from '@/lib/prisma'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import type { Patient } from '@prisma/client'

interface getPatientProfileUseCaseRequest {
  userId: string
}

interface getPatientProfileUseCaseResponse {
  patient: Patient
}

export async function getPatientProfileUseCase({
  userId,
}: getPatientProfileUseCaseRequest): Promise<getPatientProfileUseCaseResponse> {
  const patient = await prisma.patient.findUnique({
    where: {
      id: userId,
    },
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
      anamneses: true,
    },
  })

  if (!patient) {
    throw new ResourceNotFoundError()
  }

  // Formatar os valores 'value' em R$
  const formatToBRL = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100)

  if (patient) {
    // Remover campos indesejados de schedules
    patient.schedules = patient.schedules.map(schedule => {
      const { value, specialist, ...rest } = schedule // Remove 'value' e 'specialist'
      return {
        ...rest,
        formattedValue: formatToBRL(value),
        specialistName: specialist?.name,
      }
    })

    // Remover campos indesejados de examSchedule
    patient.examSchedule = patient.examSchedule.map(exam => {
      const { value, exam: examDetails, ...rest } = exam // Remove 'value' e 'exam'
      return {
        ...rest,
        formattedValue: formatToBRL(value),
        examName: examDetails?.name,
      }
    })
  }

  Reflect.deleteProperty(patient, 'password')

  return {
    patient,
  }
}
