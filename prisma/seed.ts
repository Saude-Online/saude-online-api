import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Pré-populando a tabela specialties com valores em centavos
  const specialties = [
    { name: 'Dentista', value: 10000 },  // R$ 100,00
    { name: 'Dermatologista', value: 15000 }, // R$ 150,00
    { name: 'Pediatra', value: 12000 },  // R$ 120,00
    { name: 'Cardiologista', value: 20000 }, // R$ 200,00
    { name: 'Ortopedista', value: 13000 }, // R$ 130,00
    { name: 'Ginecologista', value: 14000 }, // R$ 140,00
    { name: 'Oftalmologista', value: 11000 }, // R$ 110,00
    { name: 'Psiquiatra', value: 18000 }, // R$ 180,00
  ]

  // Pré-populando a tabela exams com valores em centavos
  const exams = [
    { name: 'Exame de Sangue', value: 5000 }, // R$ 50,00
    { name: 'Raio-X', value: 12000 }, // R$ 120,00
    { name: 'Ressonância Magnética', value: 35000 }, // R$ 350,00
    { name: 'Ultrassonografia', value: 8000 }, // R$ 80,00
    { name: 'Tomografia Computadorizada', value: 25000 }, // R$ 250,00
    { name: 'Eletrocardiograma (ECG)', value: 6000 }, // R$ 60,00
    { name: 'Exame de Urina', value: 3000 }, // R$ 30,00
    { name: 'Teste de Esforço', value: 20000 }, // R$ 200,00
    { name: 'Mamografia', value: 18000 }, // R$ 180,00
    { name: 'Papanicolau', value: 7000 }, // R$ 70,00
  ]

  // Senha a ser usada para os médicos
  const password = 'Abc123' // A senha que você quer usar para todos os médicos
  const hashedPassword = await bcrypt.hash(password, 10) // Criptografando a senha

  // Médicos a serem criados
  const doctors = [
    { name: 'Dr. Ana Souza', username: 'ana', crm: 'CRM1234', role: 'USER', password: hashedPassword },
    { name: 'Dr. Beatriz Costa', username: 'beatriz', crm: 'CRM3344', role: 'USER', password: hashedPassword },
    // Adicione outros médicos conforme necessário
  ]

  // Encontrando os IDs das especialidades criadas
  const specialtyIds = await prisma.specialty.findMany({
    select: { id: true },
  })

  // Inserindo os médicos
  for (const doctor of doctors) {
    const createdDoctor = await prisma.user.create({
      data: {
        name: doctor.name,
        username: doctor.username,
        crm: doctor.crm,
        role: 'ADMIN', // Médicos são administradores
        password: doctor.password, // Senha criptografada
        specialties: {
          connect: specialtyIds.slice(0, 3).map(specialty => ({ id: specialty.id })), // Conectando as especialidades
        },
      },
    })
    console.log(`Médico ${createdDoctor.name} criado com sucesso!`)
  }

  console.log('Especialidades, exames e médicos criados com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
