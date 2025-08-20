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
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported in this environment');

      return;
    }
  
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        // console.log('Service Worker registered with scope:', registration.scope);
        
        // Wait until the service worker is ready
        if (registration.active) {
          // console.log('Service Worker is active');
          return registration;
        }
        
        // If not active, wait for it to become active
        return new Promise<ServiceWorkerRegistration>((resolve) => {
          const timer = setInterval(() => {
            if (registration.active) {
              clearInterval(timer);
              // console.log('Service Worker is now active');
              resolve(registration);
            }
          }, 100);
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        throw error;
      }
    };
  
    // Register service worker and handle messaging initialization
    registerServiceWorker()
      .then((registration) => {
        if (registration) {
          // Initialize FCM token after service worker is ready
          if ('Notification' in window) {
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                // console.log('Notification permission granted');
                // You can call getFcmToken here if needed
              }
            });
          }
        }
      })
      .catch((error) => {
        console.error('Failed to initialize service worker:', error);
      });
  
    // Optional: Handle controllerchange event
    const handleControllerChange = () => {
      // console.log('Service Worker controller changed');
    };
  
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
  
    // Cleanup
    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
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