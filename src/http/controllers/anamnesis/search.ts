import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { fetchAnamnesisUseCase } from '@/use-cases/fetch-anamnesis'

export async function searchAnamnesis(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const searchAnamnesisQuerySchema = z.object({
    query: z.string().optional().default(''),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = searchAnamnesisQuerySchema.parse(request.query)

  const { anamnesis } = await fetchAnamnesisUseCase({
    query,
    page,
  })

  return reply.status(200).send({
    anamnesis,
  })
}
