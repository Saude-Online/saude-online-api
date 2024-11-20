import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Especialidades
  const specialties = [
    { name: 'Dentista', value: 10000 },
    { name: 'Dermatologista', value: 15000 },
    { name: 'Pediatra', value: 12000 },
    { name: 'Cardiologista', value: 20000 },
    { name: 'Ortopedista', value: 13000 },
    { name: 'Ginecologista', value: 14000 },
    { name: 'Oftalmologista', value: 11000 },
    { name: 'Psiquiatra', value: 18000 },
  ]

  // Exames
  const exams = [
    { name: 'Exame de Sangue', value: 5000 },
    { name: 'Raio-X', value: 12000 },
    { name: 'Ressonância Magnética', value: 35000 },
    { name: 'Ultrassonografia', value: 8000 },
    { name: 'Tomografia Computadorizada', value: 25000 },
    { name: 'Eletrocardiograma (ECG)', value: 6000 },
    { name: 'Exame de Urina', value: 3000 },
    { name: 'Teste de Esforço', value: 20000 },
    { name: 'Mamografia', value: 18000 },
    { name: 'Papanicolau', value: 7000 },
  ]

  // Criando especialidades
  await Promise.all(
    specialties.map(specialty =>
      prisma.specialty.create({
        data: specialty,
      })
    )
  )
  console.log('Especialidades criadas com sucesso!')

  // Criando exames
  await Promise.all(
    exams.map(exam =>
      prisma.exam.create({
        data: exam,
      })
    )
  )
  console.log('Exames criados com sucesso!')

  // Criando médicos
  const password = 'Abc123'
  const hashedPassword = await bcrypt.hash(password, 10)

  const doctors = [
    { name: 'Dr. Ana Souza', username: 'ana', crm: 'CRM1234', role: 'USER', password: hashedPassword },
    { name: 'Dr. Beatriz Costa', username: 'beatriz', crm: 'CRM3344', role: 'USER', password: hashedPassword },
  ]

  const specialtyIds = await prisma.specialty.findMany({
    select: { id: true },
  })

  for (const doctor of doctors) {
    const createdDoctor = await prisma.user.create({
      data: {
        name: doctor.name,
        username: doctor.username,
        crm: doctor.crm,
        role: 'ADMIN',
        password: doctor.password,
        specialties: {
          connect: specialtyIds.slice(0, 3).map(specialty => ({ id: specialty.id })),
        },
      },
    })
    console.log(`Médico ${createdDoctor.name} criado com sucesso!`)
  }

  console.log('Seed executado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
