import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { createExamSchedule } from './create'
import { searchExamSchedule } from './search'
import { exams } from './exams'
// import { updateExamSchedule } from './update'
import { deleteExamSchedule } from './delete'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function examsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/exam-schedules', createExamSchedule)
  app.get('/exam-schedules', searchExamSchedule)
  app.get('/exams', exams)
  // app.put('/exams/:id', updateExamSchedule)
  app.delete(
    '/exam-schedules/:id',
    { onRequest: [verifyUserRole('ADMIN')] },
    deleteExamSchedule,
  )
}
