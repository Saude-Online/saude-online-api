import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { deletePatientUseCase } from '@/use-cases/delete-patient'

export async function deletePatient(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deletePatientParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = deletePatientParamsSchema.parse(request.params)

  await deletePatientUseCase({ id })

  return reply.status(204).send()
}
