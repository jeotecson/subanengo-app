import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ExitModal } from "@/components/modals/exit-modal";
import { HeartsModal } from "@/components/modals/hearts-modal";
import { PracticeModal } from "@/components/modals/practice-modal";
import OfflineSyncClient from "@/components/OfflineSyncClient"; 

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SubanenGo",
  description: "Learn Subanen with gamified lessons",
  manifest: "/manifest.json",
  themeColor: "#facc15",
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-512x512.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={font.className}>
          <Toaster theme="light" richColors closeButton />
          <ExitModal />
          <HeartsModal />
          <PracticeModal />
          <OfflineSyncClient /> 
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
