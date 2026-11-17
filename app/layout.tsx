import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AppToaster from "@/components/ui/Toaster";
import PendingToast from "@/components/ui/PendingToast";
import { NavbarLockProvider } from "@/context/navbar-lock-context";
import { auth } from "@/auth";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  fallback: ["system-ui", "sans-serif"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  fallback: ["monospace"],
});

export const metadata: Metadata = {
  title: "StackMeet",
  description: "The Hub for Every Dev Event You Mustn't Miss",
};

async function NavbarWithAuth() {
  const session = await auth();

  return (
    <Navbar
      user={
        session?.user
          ? {
            name: session.user.name || null,
            email: session.user.email || null,
          }
          : null
      }
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetBrainsMono.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <NavbarLockProvider>
          <Suspense fallback={null}>
            <NavbarWithAuth />
          </Suspense>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <AppToaster />
          <PendingToast />
        </NavbarLockProvider>
      </body>
    </html>
  );
}
