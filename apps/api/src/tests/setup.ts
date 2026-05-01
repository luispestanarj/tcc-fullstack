import { beforeAll, afterAll, beforeEach } from 'vitest';
import { prisma } from '../config/database';

beforeAll(async () => {
  process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://tcc_user:tcc_password@localhost:5432/tcc_db';
  process.env.JWT_SECRET = 'test-secret-key-minimo-10';
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.NODE_ENV = 'test';
});

beforeEach(async () => {
  await prisma.item.deleteMany();
  await prisma.list.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.item.deleteMany();
  await prisma.list.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});
