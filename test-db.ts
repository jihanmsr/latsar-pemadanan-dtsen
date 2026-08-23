import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    const data = await prisma.registration_requests.findMany()
    console.log("Success! Found:", data.length)
  } catch(e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}
main()
