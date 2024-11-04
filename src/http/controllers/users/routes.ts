import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { register } from './register'
import { specialties } from './specialties'
import { authenticate } from './authenticate'
import { signOut } from './sign-out'
import { refresh } from './refresh'

import { list } from './list'
import { profile } from './profile'
import { updateUser } from './update'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.get('/specialties', specialties)
  app.post('/sessions', authenticate)
  app.post('/sign-out', signOut)
  app.patch('/token/refresh', refresh)

  // Rotas autenticadas
  app.register(async (protectedRoutes) => {
    protectedRoutes.addHook('onRequest', verifyJWT)

    protectedRoutes.get('/', list)
    protectedRoutes.get('/me', profile)
    protectedRoutes.put('/users/:id', updateUser)
  })
}
