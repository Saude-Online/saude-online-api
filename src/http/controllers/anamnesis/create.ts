import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { createAnamnesisUseCase } from '@/use-cases/create-anamnesis'

export async function createAnamnesis(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const createBodySchema = z.object({
    patientId: z.string(),
    age: z.number(),
    weight: z.string(),
    height: z.string(),
    symptoms: z.string(),
    medicalHistory: z.string().optional(),
    allergies: z.string().optional(),
  })

  try {
    const {
      patientId,
      age,
      weight,
      height,
      symptoms,
      medicalHistory,
      allergies,
    } = createBodySchema.parse(request.body)

    await createAnamnesisUseCase({
      patientId,
      age,
      weight,
      height,
      symptoms,
      medicalHistory,
      allergies,
    })

    // Resposta de sucesso
    return reply.status(201).send()
  } catch (error) {
    // Tratamento de erro de validação
    if (error instanceof z.ZodError) {
      return reply
        .status(400)
        .send({ message: 'Invalid request data', errors: error.errors })
    }

    // Tratamento de outros erros
    return reply
      .status(500)
      .send({ message: error.message || 'Internal server error.' })
  }
}
