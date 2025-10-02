// app/api/webhooks/clerk/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Webhook } from "svix";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const payload = await req.json();

  // Clerk sends events like user.created, user.updated, user.deleted
  const evtType = payload.type;
  const data = payload.data;

  if (evtType === "user.created" || evtType === "user.updated") {
    const { id, username, email_addresses } = data;
    const email = email_addresses?.[0]?.email_address;

    await prisma.user.upsert({
      where: { id },
      update: { userName: username ?? "", email },
      create: {
        id,
        userName: username ?? "",
        email,
      },
    });
  }

  if (evtType === "user.deleted") {
    await prisma.user.delete({ where: { id: data.id } });
  }

  return NextResponse.json({ status: "ok" });
}
