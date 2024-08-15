import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { updatePatientUseCase } from '@/use-cases/update-patient'

export async function updatePatient(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updatePatientParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const updatePatientBodySchema = z.object({
    name: z.string().optional(),
    document: z.string().optional(),
  })

  const { id } = updatePatientParamsSchema.parse(request.params)
  const data = updatePatientBodySchema.parse(request.body)

  const updatedPatient = await updatePatientUseCase({
    id,
    data,
  })

  return reply.status(200).send({
    patient: updatedPatient,
  })
}
