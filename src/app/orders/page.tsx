import { Metadata } from "next";
import OrderDetails from "./Components/OrderDetails";
import { getServerCookie } from "../(site)/page";
import { redirect } from "next/navigation";
import { designVar } from "@/designVar/desighVar";

type OrdersProps = {};

export const metadata: Metadata = {
  title: "Orders - Burger Lab",
};

export const dynamic = "force-dynamic";

export default async function Orders({}: OrdersProps) {
  const token = await getServerCookie("accessToken");
  if(!token){
    redirect("/");
  }
  return (
    <main className="w-[90%] lg:max-w-[70%] mx-auto my-5 min-h-screen flex flex-col gap-5">
      <h1 className={`text-lg font-bold mt-10 text-gray-700 ${designVar.fontFamily} `}>My Orders</h1>
      <OrderDetails />
    </main>
  );
}
