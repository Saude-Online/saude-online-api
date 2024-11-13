import type { FastifyRequest, FastifyReply } from 'fastify'

import { fetchSpecialtiesUseCase } from '@/use-cases/fetch-specialties'

export async function specialties(_: FastifyRequest, reply: FastifyReply) {
  const { specialties } = await fetchSpecialtiesUseCase()

  return reply.status(200).send({
    specialties,
  })
}
