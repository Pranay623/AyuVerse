// app/signin/page.tsx
"use client";

import { useUser, SignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [dbUser, setDbUser] = useState<any>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetch("/api/me")
        .then((res) => res.json())
        .then((data) => setDbUser(data));
    }
  }, [isLoaded, user]);

  if (!isLoaded) return <p>Loading...</p>;
  if (!user) return <SignIn />;

  return (
    <div className="p-6 ">
      <h1>Welcome, {dbUser?.userName || user.username || "Guest"}!</h1>
      <p>Email: {dbUser?.email}</p>
      <p>Points: {dbUser?.points}</p>
      <p>Status: {dbUser?.status}</p>
      <p>Role: {dbUser?.roles}</p>
    </div>
  );
}
