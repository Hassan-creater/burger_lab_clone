import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import Providers from "./providers";
import Script from "next/script";
import React from "react";
import LayoutShell from "./layoutShell";
import { designVar } from "@/designVar/desighVar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Burger Lab Menu | Online Ordering",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  
  return (
    <html lang="en">
      <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css" integrity="sha512-DxV+EoADOkOygM4IR9yXP8Sb2qwgidEmeqAEmDKIOfPRQZOWbXCzLC6vjbZyy0vPisbH2SyW27+ddLVCN+OMzQ==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      
      <Script src={process.env.FONT_AWESOME_SCRIPT} crossOrigin="anonymous" />

      <body
        className={cn(
          "min-h-screen flex flex-col  max-w-[2500px] w-full mx-auto   bg-primaryBg no-scrollbar ",
          inter.className,
          `${designVar.fontFamily}`
        )}
        suppressHydrationWarning={true}
      >

           <LayoutShell>
            {children}
           </LayoutShell>
        </body>
    </html>
  );
}
