import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { createScheduleUseCase } from '@/use-cases/create-schedule'
import { ScheduleAlreadyExistsError } from '@/use-cases/errors/schedule-already-exists'
import { parseISO } from 'date-fns'

export async function createSchedule(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createBodySchema = z.object({
    specialistId: z.string(),
    patientId: z.string(),
    dateHour: z.string(),
  })

  const { specialistId, patientId, dateHour } = createBodySchema.parse(request.body)

  try {
    const parsedDateHour = parseISO(dateHour)

    if (Number.isNaN(parsedDateHour.getTime())) {
      throw new Error('Invalid date format.')
    }

    await createScheduleUseCase({ specialistId, patientId, dateHour: parsedDateHour })
  } catch (error) {
    if (error instanceof ScheduleAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(201).send()
}
