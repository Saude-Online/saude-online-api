import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { createPatient } from './create'
import { searchPatient } from './search'
import { updatePatient } from './update'
import { deletePatient } from './delete'

export async function patientsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/patients', createPatient)
  app.get('/patients', searchPatient)
  app.put('/patients/:id', updatePatient)
  app.delete('/patients/:id', deletePatient)
}
