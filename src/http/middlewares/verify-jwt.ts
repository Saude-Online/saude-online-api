import type { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    // if (!request.headers.authorization) {
    //   throw new Error()
    // }

    await request.jwtVerify()
  } catch (error) {
    console.error(error)

    reply.status(401).send({
      message: 'Unauthorized',
    })
  }
}
