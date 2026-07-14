import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as mariadb from 'mariadb';

function createPrismaClient() {
  const adapter = new PrismaMariaDb({
    host: "103.5.51.154",
    port: 3306,
    user: "u12228jhr_dtsen",
    password: "inidatapenting123",
    database: "u12228jhr_dtsen",
    connectionLimit: 5,
    connectTimeout: 30000,
  });
  
  return new PrismaClient({ adapter });
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
