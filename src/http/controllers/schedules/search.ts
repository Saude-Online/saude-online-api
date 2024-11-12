import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { fetchSchedulesUseCase } from '@/use-cases/fetch-schedules'

export async function searchSchedule(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const searchSchedulesQuerySchema = z.object({
    query: z.string().optional().default(''),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = searchSchedulesQuerySchema.parse(request.query)

  const { schedules } = await fetchSchedulesUseCase({
    query,
    page,
  })

  return reply.status(200).send({
    schedules,
  })
}
