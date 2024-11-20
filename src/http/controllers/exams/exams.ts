import type { FastifyRequest, FastifyReply } from 'fastify'

import { fetchExamsUseCase } from '@/use-cases/fetch-exams'

export async function exams(_: FastifyRequest, reply: FastifyReply) {
  const { exams } = await fetchExamsUseCase()

  return reply.status(200).send({
    exams,
  })
}
