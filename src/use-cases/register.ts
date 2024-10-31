import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists'

interface RegisterUseCaseRequest {
  name: string
  username: string
  crm?: string
  password: string
  role?: 'USER' | 'ADMIN' // Padrão é 'USER'
  specialties?: string[] // Se for ADMIN (Médico), pode ter especialidades
}

export async function registerUseCase({
  name,
  username,
  crm,
  password,
  role = 'USER',
  specialties,
}: RegisterUseCaseRequest) {
  const password_hash = await hash(password, 6)

  const userWithSameUsername = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userWithSameUsername) {
    throw new UserAlreadyExistsError()
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
      crm,
      password: password_hash,
      role,
      specialties: {
        create: specialties?.map((specialty) => ({
          name: specialty,
        })),
      },
    },
  })

  return user.id
}
