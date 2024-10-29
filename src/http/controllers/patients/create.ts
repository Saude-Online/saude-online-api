import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { createPatientUseCase } from '@/use-cases/create-patient'
import { PatientAlreadyExistsError } from '@/use-cases/errors/patient-already-exists'

export async function createPatient(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createBodySchema = z.object({
    name: z.string(),
    age: z.number().nullable(),
    document: z.string(),
    userId: z.string(),
  })

  const { name, age, document, userId } = createBodySchema.parse(request.body)

  try {
    await createPatientUseCase({ name, age, document, userId })
  } catch (error) {
    if (error instanceof PatientAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(201).send()
}
