import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { registerUseCase } from '@/use-cases/register'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    username: z.string(),
    crm: z.string().optional(),
    password: z.string().min(6),
    role: z.enum(['USER', 'ADMIN']).optional(),
    specialties: z.array(z.string()).optional(),
  })

  const { name, username, crm, password, role, specialties } =
    registerBodySchema.parse(request.body)

  try {
    const userId = await registerUseCase({
      name,
      username,
      crm,
      password,
      role,
      specialties,
    })

    return reply.status(201).send(userId)
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
