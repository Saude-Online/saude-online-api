import { prisma } from '@/lib/prisma'

interface deleteExamScheduleUseCaseRequest {
  id: string
}

export async function deleteExamScheduleUseCase({
  id,
}: deleteExamScheduleUseCaseRequest): Promise<void> {
  await prisma.examSchedule.delete({
    where: {
      id,
    },
  })
}
