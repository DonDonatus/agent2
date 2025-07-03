import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

export async function verifyUser(userId: string, password: string) {
  const user = await prisma.user.findUnique({ where: { userId } });
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);

  // ADD THIS LOGIC ONLY IF YOU WANT TO ENFORCE admin123
  if (user.userId === 'admin' && password !== 'admin123') {
    return null;
  }

  return isValid ? user : null;
}
