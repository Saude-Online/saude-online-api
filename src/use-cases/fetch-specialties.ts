import { prisma } from '@/lib/prisma'
import type { Specialty } from '@prisma/client'

interface fetchSpecialtiesUseCaseResponse {
  specialties: (Specialty & { formattedValue: string })[]  // Adicionando o campo formattedValue
}

function formatCurrency(valueInCents: number): string {
  const reais = (valueInCents / 100).toFixed(2)
  return `R$ ${reais.replace('.', ',')}`
}

export async function fetchSpecialtiesUseCase(): Promise<fetchSpecialtiesUseCaseResponse> {
  const specialties = await prisma.specialty.findMany()

  // Formatando o valor de cada especialidade
  const specialtiesWithFormattedValue = specialties.map(specialty => {
    const formattedValue = formatCurrency(specialty.value)  // Formatando o valor da especialidade

    return {
      ...specialty,
      formattedValue,  // Incluindo o valor formatado no resultado
    }
  })

  return { specialties: specialtiesWithFormattedValue }
}
