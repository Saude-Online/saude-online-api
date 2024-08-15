import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { fetchPatientsUseCase } from '@/use-cases/fetch-patients'

export async function searchPatient(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const searchPatientsQuerySchema = z.object({
    query: z.string().optional().default(''),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = searchPatientsQuerySchema.parse(request.query)

  const { patients } = await fetchPatientsUseCase({
    query,
    page,
  })

  return reply.status(200).send({
    patients,
  })
}
