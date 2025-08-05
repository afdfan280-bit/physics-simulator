import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PhysicsNavigation } from "@/components/PhysicsNavigation";
import { AccessibilityControls } from "@/components/AccessibilityControls";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Interactive 3D Physics Simulator",
  description: "Explore fundamental physics concepts through immersive, interactive 3D simulations with scientifically accurate models.",
  keywords: ["Physics", "3D", "Simulator", "Education", "Newton's Laws", "Waves", "Electricity", "Magnetism", "Energy", "Buoyancy"],
  authors: [{ name: "Physics Simulator Team" }],
  openGraph: {
    title: "Interactive 3D Physics Simulator",
    description: "Explore fundamental physics concepts through immersive, interactive 3D simulations",
    url: "https://physics-simulator.example.com",
    siteName: "Physics Simulator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive 3D Physics Simulator",
    description: "Explore fundamental physics concepts through immersive, interactive 3D simulations",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <PhysicsNavigation />
        {children}
        <Toaster />
        <AccessibilityControls />
      </body>
    </html>
  );
}
