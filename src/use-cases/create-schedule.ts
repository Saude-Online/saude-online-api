import { prisma } from '@/lib/prisma'

interface CreateUseCaseRequest {
  specialistId: string
  patientId: string
  dateHour: Date
}

export async function createScheduleUseCase({
  specialistId,
  patientId,
  dateHour,
}: CreateUseCaseRequest) {
  const existingPatient = await prisma.patient.findUnique({
    where: {
      id: patientId,
    },
  })

  if (!existingPatient) {
    throw new Error('Paciente não encontrado.')
  }

  await prisma.schedule.create({
    data: {
      specialistId,
      patientId: existingPatient.id,
      dateHour,
    },
  })
}
