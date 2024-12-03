import type { FastifyRequest, FastifyReply } from 'fastify'
import { getUserProfileUseCase } from '@/use-cases/get-user-profile'
import { getPatientProfileUseCase } from '@/use-cases/get-patient-profile'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify()

  // Verificar se o userId está sendo passado como query param ou como parâmetro de URL
  const query = request.query as { userId?: string }
  const params = request.params as { userId?: string }

  const userId = query.userId
    ? String(query.userId)
    : params.userId
      ? String(params.userId)
      : request.user.sub

  let user = null
  if (query.userId) {
    const result = await getPatientProfileUseCase({
      userId,
    })
    user = result.patient
  } else {
    // Se não for passado como query, e for passado como params, chamar o getUserProfileUseCase
    const result = await getUserProfileUseCase({
      userId,
    })
    user = result.user
  }

  return reply.status(200).send({
    user,
  })
}
