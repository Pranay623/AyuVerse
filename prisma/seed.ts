// prisma/seed.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Insert sample user
  const user = await prisma.user.create({
    data: {
      clerkId: "clerk_user_1", // Add a valid clerkId here
      userName: "ayuverse_user1",
      email: "user1@prisma.io",
      points: 100, // optional, will default to 50 if not provided
      roles: "patient", // or "expert"
      status: "Pending", // or "Approved", "Denied"
      // createdAt and updatedAt are set automatically
    },
  })

  console.log("User created:", user)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
