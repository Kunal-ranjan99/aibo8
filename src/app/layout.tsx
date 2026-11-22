import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NavigationProgress } from "@/components/NavigationProgress";
import { getSession } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: "Aibo8 — AI, Robotics & IoT Learning Platform",
  description:
    "Master Artificial Intelligence, Autonomous Robotics (ROS2), and IoT Hardware (ESP32, Arduino, Jetson) through hands-on labs, quizzes, and verified certificates.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSession();

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}>
      <body className="min-h-screen flex flex-col bg-[#050814] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <Navbar user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
