import { prisma } from '@/lib/prisma'
import { parseISO, isValid } from 'date-fns'

interface fetchSchedulesUseCaseRequest {
  query: string
  page: number
}

interface fetchSchedulesUseCaseResponse {
  schedules: {
    id: string
    dateHour: string
    value: string
    patient: {
      id: string
      name: string
    }
  }[]
}

function formatCurrency(valueInCents: number): string {
  const reais = (valueInCents / 100).toFixed(2)
  return `R$ ${reais.replace('.', ',')}`
}

export async function fetchSchedulesUseCase({
  query,
  page,
}: fetchSchedulesUseCaseRequest): Promise<fetchSchedulesUseCaseResponse> {
  let dateFilter: Date | undefined
  let patientFilter: any = {}

  const queryDate = parseISO(query)
  if (isValid(queryDate)) {
    dateFilter = queryDate
  } else {
    // Se não for uma data, busca pelo nome do paciente
    patientFilter = {
      patient: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    }
  }

  const schedules = await prisma.schedule.findMany({
    where: {
      ...(dateFilter ? { date: { equals: dateFilter } } : {}),
      ...(patientFilter),
    },
    take: 20,
    skip: (page - 1) * 20,
    include: {
      patient: true, // Inclui os dados do paciente relacionado
      specialist: true, // Inclui os dados da especialidade relacionada
    },
  })

  // Formata o valor e outros campos antes de retornar
  const formattedSchedules = schedules.map((schedule) => ({
    id: schedule.id,
    dateHour: schedule.dateHour.toISOString(),
    value: formatCurrency(schedule.value), // Formata o valor
    patientName: schedule.patient.name,
    patientPhone: schedule.patient.phone,
    specialtyName: schedule.specialist.name,
    patient: {
      id: schedule.patient.id,
      name: schedule.patient.name,
    },
  }))

  return {
    schedules: formattedSchedules,
  }
}
