import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { deleteScheduleUseCase } from '@/use-cases/delete-schedule'

export async function deleteSchedule(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteScheduleParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = deleteScheduleParamsSchema.parse(request.params)

  await deleteScheduleUseCase({ id })

  return reply.status(204).send()
}
