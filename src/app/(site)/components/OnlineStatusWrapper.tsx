"use client";
import { useEffect, useState, createContext, useContext } from "react";

export const OfflineContext = createContext(false);
export const useOffline = () => useContext(OfflineContext);

export default function OnlineStatusWrapper({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <OfflineContext.Provider value={true}>
        <main className="w-full min-h-[calc(100dvh-80px)] flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-2xl font-semibold text-red-600">You are Offline</h1>
          <p className="text-gray-600 mt-2 max-w-md">
            Please check your internet connection. This page requires an active connection to load product data.
          </p>
        </main>
      </OfflineContext.Provider>
    );
  }

  return <OfflineContext.Provider value={false}>{children}</OfflineContext.Provider>;
} 