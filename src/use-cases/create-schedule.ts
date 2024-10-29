import { prisma } from '@/lib/prisma'

interface CreateUseCaseRequest {
  patient: {
    id?: string
    name: string
    age: number | null
    document: string
  }
  dateHour: Date
}

export async function createScheduleUseCase({
  patient,
  dateHour,
}: CreateUseCaseRequest) {
  await prisma.schedule.create({
    data: {
      dateHour,
      patient: {
        connectOrCreate: {
          where: { id: patient.id || '' },
          create: {
            name: patient.name,
            age: patient.age,
            document: patient.document,
          },
        },
      },
    },
  })
}
