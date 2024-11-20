import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { createScheduleUseCase } from '@/use-cases/create-schedule'
import { ScheduleAlreadyExistsError } from '@/use-cases/errors/schedule-already-exists'
import { parseISO } from 'date-fns'

export async function createSchedule(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Schema para validação do corpo da requisição (incluindo specialtyId)
  const createBodySchema = z.object({
    specialistId: z.string(),
    patientId: z.string(),
    specialtyId: z.string(), // Adicionando specialtyId
    dateHour: z.string(),
  })

  // Tentando fazer o parse do corpo da requisição
  try {
    const { specialistId, patientId, specialtyId, dateHour } = createBodySchema.parse(request.body)

    // Parse da data
    const parsedDateHour = parseISO(dateHour)

    // Verificação se a data é válida
    if (Number.isNaN(parsedDateHour.getTime())) {
      return reply.status(400).send({ message: 'Invalid date format. Please use the format: YYYY-MM-DDTHH:mm:ss' })
    }

    // Chamada do caso de uso para criação do agendamento
    await createScheduleUseCase({ specialistId, patientId, specialtyId, dateHour: parsedDateHour })

    // Resposta de sucesso
    return reply.status(201).send()
  } catch (error) {
    // Tratamento de erro específico de validação de dados
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ message: 'Invalid request data', errors: error.errors })
    }

    // Tratamento de erro específico se o agendamento já existir
    if (error instanceof ScheduleAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    // Tratamento de outros erros
    return reply.status(500).send({ message: error.message || 'Internal server error.' })
  }
}
