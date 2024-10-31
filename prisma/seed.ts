import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Pré-populando a tabela specialties
  const specialties = [
    { name: 'Dentista' },
    { name: 'Dermatologista' },
    { name: 'Pediatra' },
    { name: 'Cardiologista' },
    { name: 'Ortopedista' },
    { name: 'Ginecologista' },
    { name: 'Oftalmologista' },
    { name: 'Psiquiatra' },
  ]

  // Usando createMany para adicionar várias especialidades de uma vez
  await prisma.specialty.createMany({
    data: specialties,
  })

  console.log('Especialidades pré-populadas com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
