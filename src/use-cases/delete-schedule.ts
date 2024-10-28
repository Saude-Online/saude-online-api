import { prisma } from '@/lib/prisma'

interface deleteScheduleUseCaseRequest {
  id: string
}

export async function deleteScheduleUseCase({
  id,
}: deleteScheduleUseCaseRequest): Promise<void> {
  await prisma.schedule.delete({
    where: {
      id,
    },
  })
}
