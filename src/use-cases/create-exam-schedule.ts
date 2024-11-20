import { prisma } from '@/lib/prisma'

interface CreateUseCaseRequest {
  examId: string
  patientId: string
  dateHour: Date
}

export async function createExamScheduleUseCase({
  examId,
  patientId,
  dateHour,
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

  // Verificando se o exame existe
  const exam = await prisma.exam.findUnique({
    where: {
      id: examId,
    },
  })

  if (!exam) {
    throw new Error('Exame não encontrado.')
  }

  // Verificando se já existe um agendamento para o paciente neste horário
  const existingSchedule = await prisma.examSchedule.findFirst({
    where: {
      patientId: patientId,
      dateHour: dateHour,
    },
  })

  if (existingSchedule) {
    throw new Error('Já existe um agendamento para este paciente neste horário.')
  }

  // Definindo o valor do exame
  const totalValue = exam.value

  // Criando o agendamento do exame
  await prisma.examSchedule.create({
    data: {
      examId,
      patientId: existingPatient.id,
      dateHour,
      value: totalValue,
    },
  })
}
