import { PrismaClient } from '@prisma/client'

// Type-safe singleton instance
type PrismaClientSingleton = ReturnType<typeof prismaClient>

const prismaClient = () => new PrismaClient()

declare global {
  var prisma: PrismaClientSingleton | undefined
}

const prisma = global.prisma ?? prismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma