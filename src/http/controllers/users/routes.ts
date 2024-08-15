import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { register } from './register'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { updateUser } from './update'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // Rotas autenticadas
  app.register(async (protectedRoutes) => {
    protectedRoutes.addHook('onRequest', verifyJWT)

    protectedRoutes.get('/me', profile)
    protectedRoutes.put('/users/:id', updateUser)
  })
}