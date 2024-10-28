import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { updateScheduleUseCase } from '@/use-cases/update-schedule'

export async function updateSchedule(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateScheduleParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const updateScheduleBodySchema = z.object({
    name: z.string().optional(),
    age: z.number().optional(),
    document: z.string().optional(),
  })

  const { id } = updateScheduleParamsSchema.parse(request.params)
  const data = updateScheduleBodySchema.parse(request.body)

  const updatedSchedule = await updateScheduleUseCase({
    id,
    data,
  })

  return reply.status(200).send({
    schedule: updatedSchedule,
  })
}
