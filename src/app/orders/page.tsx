"use client";
import { Metadata } from "next";
import OrderDetails from "./Components/OrderDetails";

type OrdersProps = {};

export const metadata: Metadata = {
  title: "Orders - Burger Lab",
};

export default function Orders({}: OrdersProps) {
  // You cannot use await getServerCookie or redirect here, as these are server-only.
  // If you need authentication, handle it in a layout or middleware.
  return (
    <main className="w-[90%] lg:max-w-[70%] mx-auto my-5 min-h-screen flex flex-col gap-5">
      <h1 className="text-lg font-bold mt-10 text-gray-700">My Orders</h1>
      <OrderDetails />
    </main>
  );
}
