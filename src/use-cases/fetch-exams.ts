import { prisma } from '@/lib/prisma'
import type { Exam } from '@prisma/client'

interface fetchExamsUseCaseResponse {
  exams: (Exam & { formattedValue: string })[]  // Adicionando o campo formattedValue
}

export async function fetchExamsUseCase(): Promise<fetchExamsUseCaseResponse> {
  // Buscando os exames
  const exams = await prisma.exam.findMany()

  // Formatando o valor de cada exame
  const examsWithFormattedValue = exams.map(exam => {
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(exam.value / 100)  // Dividindo o valor por 100 para converter centavos para reais

    return {
      ...exam,
      formattedValue,  // Incluindo o valor formatado no resultado
    }
  })

  return { exams: examsWithFormattedValue }
}
