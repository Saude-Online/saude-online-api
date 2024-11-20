import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { fetchExamSchedulesUseCase } from '@/use-cases/fetch-exam-schedules'

export async function searchExamSchedule(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const searchExamSchedulesQuerySchema = z.object({
    query: z.string().optional().default(''),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = searchExamSchedulesQuerySchema.parse(request.query)

  const { examSchedules } = await fetchExamSchedulesUseCase({
    query,
    page,
  })

  return reply.status(200).send({
    examSchedules,
  })
}
