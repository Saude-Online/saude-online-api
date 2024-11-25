import { prisma } from '@/lib/prisma'

interface deletePatientUseCaseRequest {
  id: string
}

export async function deletePatientUseCase({
  id,
}: deletePatientUseCaseRequest): Promise<void> {
  await prisma.schedule.deleteMany({ where: { patientId: id } })
  await prisma.examSchedule.deleteMany({ where: { patientId: id } })
  await prisma.anamnesis.deleteMany({ where: { patientId: id } })

  await prisma.patient.delete({
    where: {
      id,
    },
  })
}
