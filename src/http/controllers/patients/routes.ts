import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { createPatient } from './create'
import { searchPatient } from './search'
import { updatePatient } from './update'
import { deletePatient } from './delete'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function patientsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/patients', createPatient)
  app.get('/patients', searchPatient)
  app.put('/patients/:id', updatePatient)
  app.delete(
    '/patients/:id',
    { onRequest: [verifyUserRole('ADMIN')] },
    deletePatient,
  )
}
