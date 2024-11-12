import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'

import { ZodError } from 'zod'

import { usersRoutes } from '@/http/controllers/users/routes'
import { patientsRoutes } from '@/http/controllers/patients/routes'
import { schedulesRoutes } from '@/http/controllers/schedules/routes'
import { env } from '@/env'

export const app = fastify({
  logger: env.NODE_ENV !== 'production',
})

app.register(fastifyCors, {
  origin: ['http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  credentials: true,
  maxAge: 86400,
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: { expiresIn: '7d' },
})

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
