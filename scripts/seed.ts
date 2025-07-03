import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function main() {
  console.log('Seeding admin user...');
  await prisma.$connect();

  const hashedPassword = await hashPassword('admin123');

  await prisma.user.upsert({
    where: { userId: 'admin' },
    update: { password: hashedPassword },
    create: { userId: 'admin', password: hashedPassword }
  });

  console.log('Admin user seeded.');
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
