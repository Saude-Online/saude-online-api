import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { createPatient } from './create'
import { searchPatient } from './search'
import { updatePatient } from './update'
import { deletePatient } from './delete'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function patientsRoutes(app: FastifyInstance) {
  app.post('/patients', createPatient) // Permitir criar paciente quando o usuário se cadastrar

  // Rotas autenticadas
  app.register(async (protectedRoutes) => {
    protectedRoutes.addHook('onRequest', verifyJWT)

    protectedRoutes.get('/patients', searchPatient)
    protectedRoutes.put('/patients/:id', updatePatient)
    protectedRoutes.delete(
      '/patients/:id',
      { onRequest: [verifyUserRole('ADMIN')] },
      deletePatient,
    )
  })
}
