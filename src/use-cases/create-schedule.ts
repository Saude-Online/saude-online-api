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
  const existingPatient = await prisma.patient.findUnique({
    where: {
      document: patient.document,
    },
  });

  if (!existingPatient) {
    throw new Error(`Paciente com documento ${patient.document} não encontrado.`);
  }

  await prisma.schedule.create({
    data: {
      dateHour,
      patientId: existingPatient.id,
    },
  });
}
