import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      clerkId: "clerk_user1", // add a unique clerkId value
      userName: "ayuverse_user1",
      email: "user1@prisma.io",
      points: 100, // optional, will default to 50 if not provided
      roles: "patient", // or "expert"
      status: "Pending", // or "Approved", "Denied"
      // createdAt and updatedAt are set automatically
    },
  });
  console.log("Created user:", user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());