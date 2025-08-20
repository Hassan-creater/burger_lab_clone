"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/app/providers";
import { CartProvider } from "@/context/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useOffline } from "./(site)/components/OnlineStatusWrapper";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showHeaderFooter = pathname !== "/login" && pathname !== "/register";
  const [queryClient] = React.useState(() => new QueryClient());
  const isOffline = useOffline();


  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(reg => {
          // console.log("Service Worker registered:", reg);
        })
        .catch(err => console.error("Service Worker registration failed:", err));
    }
  }, []);
  
  return (
    <CartProvider>
      <QueryClientProvider client={queryClient}>
        <Providers>
          <div className="flex flex-col min-h-screen ">
            {!isOffline && <Header />}
            <main className="flex-1">
              {children}
            </main>
            {showHeaderFooter && !isOffline && <Footer />}
          </div>
          <Toaster position="bottom-left" />
        </Providers>
      </QueryClientProvider>
    </CartProvider>
  );
}