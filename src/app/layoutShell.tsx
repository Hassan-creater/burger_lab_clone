"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/app/providers";
import { CartProvider } from "@/context/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useOffline } from "./(site)/components/OnlineStatusWrapper";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showHeaderFooter = pathname !== "/login" && pathname !== "/register";
  const [queryClient] = React.useState(() => new QueryClient());
  const isOffline = useOffline();

  return (
    <CartProvider>
    <QueryClientProvider client={queryClient}>
    <Providers>
    {!isOffline && <Header />}
      {children}
      {showHeaderFooter && !isOffline && <Footer />}
      <Toaster position="bottom-left" />
    </Providers>
    </QueryClientProvider>
    </CartProvider>
  );
}