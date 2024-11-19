import type { FastifyReply, FastifyRequest } from 'fastify'

export async function signOut(_: FastifyRequest, reply: FastifyReply) {
  return reply
    .clearCookie('refreshToken', {
      path: '/',
      secure: true,
      sameSite: 'none',
      httpOnly: true,
    })
    .status(200)
    .send()
}
