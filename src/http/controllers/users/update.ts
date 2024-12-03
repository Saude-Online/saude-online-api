import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { updateUserUseCase } from '@/use-cases/update-user'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { updatePatientUseCase } from '@/use-cases/update-patient'
import { prisma } from '@/lib/prisma'

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  const updateUserParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const updateUserBodySchema = z.object({
    name: z.string().optional(),
    age: z.number().nullable(),
    weight: z.string().optional(),
    height: z.string().optional(),
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
  })

  const { id } = updateUserParamsSchema.parse(request.params)
  const { name, age, weight, height, oldPassword, newPassword } =
    updateUserBodySchema.parse(request.body)

  if (oldPassword && !newPassword) {
    return reply.status(400).send({
      message: 'New password must be provided when old password is given',
    })
  }

  try {
    await updateUserUseCase({
      id,
      oldPassword,
      newPassword,
      name,
    })

    const patient = await prisma.patient.findUnique({
      where: { userId: id },
    })

    if (patient && (weight || height)) {
      await updatePatientUseCase({
        id: patient.id,
        data: {
          age,
          weight,
          height,
        },
      })
    }

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
