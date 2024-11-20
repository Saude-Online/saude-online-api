import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { deleteExamScheduleUseCase } from '@/use-cases/delete-exam-schedule'

export async function deleteExamSchedule(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteExamScheduleParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = deleteExamScheduleParamsSchema.parse(request.params)

  await deleteExamScheduleUseCase({ id })

  return reply.status(204).send()
}
