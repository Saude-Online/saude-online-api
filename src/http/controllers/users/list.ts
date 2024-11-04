import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { listUsersUseCase } from '@/use-cases/list-users'

export async function list(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const searchUsersQuerySchema = z.object({
    query: z.string().optional().default(''),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = searchUsersQuerySchema.parse(request.query)

  const { users } = await listUsersUseCase({
    query,
    page,
  })

  return reply.status(200).send({
    users,
  })
}
