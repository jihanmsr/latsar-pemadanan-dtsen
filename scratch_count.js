const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const c1 = await prisma.dtsenMaster.count();
  console.log('DtsenMaster count:', c1);
  const c2 = await prisma.master_dtsen.count();
  console.log('master_dtsen count:', c2);
}

main().catch(console.error).finally(() => prisma.$disconnect());
