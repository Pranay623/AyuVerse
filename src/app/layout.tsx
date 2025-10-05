// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import {
  ClerkProvider,
  SignedIn,
  UserButton, // Keeping UserButton in layout for simplicity, or move it to Navbar
} from '@clerk/nextjs'

// IMPORTANT: Assuming this is the correct path to your custom Navbar
import Navbar from "../app/navbar/page"; 

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Next App",
  description: "Next.js App Router Example",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            {/* The custom Navbar component */}
            <Navbar /> 
          
            {/* If you want the UserButton separate from the custom Navbar, you can keep this: */}
            {/* <header className="flex justify-end items-center p-4 gap-4 h-16">
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </header> */}
            
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}