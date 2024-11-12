import type { FastifyRequest, FastifyReply } from 'fastify'

import { getUserProfileUseCase } from '@/use-cases/get-user-profile'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify()

  const { user } = await getUserProfileUseCase({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    user,
  })
}
