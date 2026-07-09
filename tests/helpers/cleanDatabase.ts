import { prisma } from '../../src/database/prisma.js';
import { ensureTestDatabase } from './ensureTestDatabase.js';

export const cleanDatabase = async () => {
  ensureTestDatabase();
  await prisma.$transaction([
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
  ]);
};
