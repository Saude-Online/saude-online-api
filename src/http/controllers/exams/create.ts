import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { createExamScheduleUseCase } from '@/use-cases/create-exam-schedule'
import { ExamScheduleAlreadyExistsError } from '@/use-cases/errors/exam-schedule-already-exists'
import { parseISO } from 'date-fns'

export async function createExamSchedule(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Schema para validação do corpo da requisição (incluindo examId)
  const createBodySchema = z.object({
    examId: z.string(),      // Validando examId
    patientId: z.string(),
    dateHour: z.string(),
  })

  try {
    // Parsing do corpo da requisição com a validação dos campos
    const { examId, patientId, dateHour } = createBodySchema.parse(request.body)

    // Verificando se a data fornecida é válida
    const parsedDateHour = parseISO(dateHour)

    if (Number.isNaN(parsedDateHour.getTime())) {
      return reply.status(400).send({ message: 'Invalid date format. Please use the format: YYYY-MM-DDTHH:mm:ss' })
    }

    // Chamada do caso de uso para criação do agendamento de exame
    await createExamScheduleUseCase({ patientId, dateHour: parsedDateHour, examId })

    // Resposta de sucesso
    return reply.status(201).send()

  } catch (error) {
    // Tratamento de erro específico se o agendamento já existir
    if (error instanceof ExamScheduleAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    // Tratamento de erro de validação
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ message: 'Invalid request data', errors: error.errors })
    }

    // Tratamento de outros erros
    return reply.status(500).send({ message: error.message || 'Internal server error.' })
  }
}
