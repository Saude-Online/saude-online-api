import { PrismaClient } from '@prisma/client'
import { UserAlreadyExistsError } from './errors/user-already-exists'
import { CrmAlreadyExistsError } from './errors/crm-already-exists'

const prisma = new PrismaClient()

interface RegisterUseCaseInput {
  name: string
  username: string
  crm?: string
  password: string
  role?: 'USER' | 'ADMIN'
  specialties?: string[]
}

export async function registerUseCase({
  name,
  username,
  crm,
  password,
  role = 'USER',
  specialties = [],
}: RegisterUseCaseInput) {
  const existingUser = await prisma.user.findUnique({ where: { username } })
  if (existingUser) throw new UserAlreadyExistsError()

  if (crm) {
    const existingCrm = await prisma.user.findUnique({ where: { crm } })
    if (existingCrm) throw new CrmAlreadyExistsError()
  }

  const existingSpecialties = await prisma.specialty.findMany({
    where: { id: { in: specialties } },
  })

  const user = await prisma.user.create({
    data: {
      name,
      username,
      crm,
      password,
      role,
      specialties: {
        connect: existingSpecialties.map((specialty) => ({ id: specialty.id })),
      },
    },
  })

  return { userId: user.id }
}
