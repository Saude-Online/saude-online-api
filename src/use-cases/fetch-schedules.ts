import { prisma } from '@/lib/prisma'
import type { Schedule } from '@prisma/client'
import { parseISO, isValid } from 'date-fns'

interface fetchSchedulesUseCaseRequest {
  query: string
  page: number
}

interface fetchSchedulesUseCaseResponse {
  schedules: Schedule[]
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
    },
  })

  return {
    schedules,
  }
}
