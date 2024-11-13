import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import type { FastifyJWTOptions } from '@fastify/jwt'

import { ZodError } from 'zod'

import { usersRoutes } from '@/http/controllers/users/routes'
import { patientsRoutes } from '@/http/controllers/patients/routes'
import { schedulesRoutes } from '@/http/controllers/schedules/routes'
import { env } from '@/env'

interface CustomFastifyJWTOptions extends FastifyJWTOptions {
  cookie: {
    cookieName: string
    signed: boolean
    secure: boolean
    sameSite: 'strict' | 'lax' | 'none'
  }
}

export const app = fastify({
  logger: env.NODE_ENV !== 'production',
})

const devOrigins = process.env.DEV_ORIGINS?.split(',') || []
const prodOrigins = process.env.PROD_ORIGINS?.split(',') || []

app.register(fastifyCors, {
  origin: env.NODE_ENV === 'production'
    ? prodOrigins
    : devOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
  credentials: true,
  maxAge: 86400,
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
    secure: env.NODE_ENV === 'production',
    sameSite: 'none',
  },
  sign: { expiresIn: '7d' },
} as CustomFastifyJWTOptions)

app.register(fastifyCookie)

app.register(usersRoutes)
app.register(patientsRoutes)
app.register(schedulesRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
