import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { createSchedule } from './create'
import { searchSchedule } from './search'
// import { updateSchedule } from './update'
import { deleteSchedule } from './delete'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function schedulesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/schedules', createSchedule)
  app.get('/schedules', searchSchedule)
  // app.put('/schedules/:id', updateSchedule)
  app.delete(
    '/schedules/:id',
    { onRequest: [verifyUserRole('ADMIN')] },
    deleteSchedule,
  )
}
