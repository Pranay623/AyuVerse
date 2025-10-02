// src/app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/landing"); // Must be top-level, server-side
}
