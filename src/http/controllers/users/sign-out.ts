import type { FastifyReply, FastifyRequest } from 'fastify'

export async function signOut(_: FastifyRequest, reply: FastifyReply) {
  return reply
    .clearCookie('refreshToken', {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      httpOnly: true,
    })
    .status(200)
    .send()
}
