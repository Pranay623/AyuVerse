// app/api/register/route.ts
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  const { userId } = await auth(); // Clerk userId from session

  if (!userId) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  // Fetch Clerk user details
  const clerkUser = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
  }).then((res) => res.json());

  // Sync with Prisma + Mongo
  const user = await prisma.user.upsert({
    where: { email: clerkUser.email_addresses[0].email_address },
    update: {
      email: clerkUser.email_addresses[0].email_address,
      userName: clerkUser.username ?? clerkUser.first_name ?? "user_" + userId.slice(0, 5),
      clerkId: userId,
    },
    create: {
      email: clerkUser.email_addresses[0].email_address,
      userName: clerkUser.username ?? clerkUser.first_name ?? "user_" + userId.slice(0, 5),
      clerkId: userId,
    },
  });

  return new Response(JSON.stringify(user), { status: 200 });
}
