import { prisma } from '@/lib/prisma'
import type { ExamSchedule } from '@prisma/client'
import { parseISO, isValid } from 'date-fns'

interface fetchExamSchedulesUseCaseRequest {
  query: string
  page: number
}

interface fetchExamSchedulesUseCaseResponse {
  examSchedules: {
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


export async function fetchExamSchedulesUseCase({
  query,
  page,
}: fetchExamSchedulesUseCaseRequest): Promise<fetchExamSchedulesUseCaseResponse> {
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

  const examSchedules = await prisma.examSchedule.findMany({
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
  // Formata o valor e outros campos antes de retornar
  const formattedExamSchedules = examSchedules.map((examSchedule) => ({
    id: examSchedule.id,
    dateHour: examSchedule.dateHour,
    value: formatCurrency(examSchedule.value), // Formata o valor
    patient: {
      id: examSchedule.patient.id,
      name: examSchedule.patient.name,
    },
  }))

  return {
    examSchedules: formattedExamSchedules,
  }
}