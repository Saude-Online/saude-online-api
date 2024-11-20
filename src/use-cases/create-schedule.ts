import { prisma } from '@/lib/prisma'

interface CreateUseCaseRequest {
  specialistId: string
  patientId: string
  dateHour: Date
  specialtyId: string
}

export async function createScheduleUseCase({
  specialistId,
  patientId,
  dateHour,
  specialtyId,
}: CreateUseCaseRequest) {
  // Verificando se o paciente existe
  const existingPatient = await prisma.patient.findUnique({
    where: {
      id: patientId,
    },
  })

  if (!existingPatient) {
    throw new Error('Paciente não encontrado.')
  }

  // Validando se specialtyId foi fornecido corretamente
  if (!specialtyId) {
    throw new Error('Especialidade ID não fornecido.')
  }

  // Verificando se a especialidade existe
  const specialty = await prisma.specialty.findUnique({
    where: {
      id: specialtyId,
    },
  })

  if (!specialty) {
    throw new Error('Especialidade não encontrada.')
  }

  const totalValue = specialty.value

  // Criando o agendamento com o valor calculado
  await prisma.schedule.create({
    data: {
      specialistId,
      patientId: existingPatient.id,
      dateHour,
      value: totalValue,
    },
  })
}
