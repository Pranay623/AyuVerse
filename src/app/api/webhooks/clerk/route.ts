// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const payload = await req.json();
  const hdrs = await headers();
  const svix_id = hdrs.get("svix-id") as string;
  const svix_timestamp = hdrs.get("svix-timestamp") as string;
  const svix_signature = hdrs.get("svix-signature") as string;

  // Verify webhook (important for security)
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET as string);
  let evt: any;
  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    return new Response("Invalid signature", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, username, first_name } = evt.data;

    await prisma.user.create({
      data: {
        clerkId: id,
        email: email_addresses[0].email_address,
        userName: username ?? first_name ?? "user_" + id.slice(0, 5),
      },
    });
  }

  return new Response("ok", { status: 200 });
}
