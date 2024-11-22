import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { createAnamnesis } from './create'
import { searchAnamnesis } from './search'

export async function anamnesisRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/anamnesis', createAnamnesis)
  app.get('/anamnesis', searchAnamnesis)
}
