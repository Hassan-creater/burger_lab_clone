import { Metadata } from "next";

import { getServerCookie } from "../../(site)/page";
import { redirect } from "next/navigation";
import { designVar } from "@/designVar/desighVar";
import GoogleMapComponent from "../components/GoogleMap";



export const metadata: Metadata = {
  title: "Order Tracking - Zest Up",
};

export const dynamic = "force-dynamic";

export default async function OrderTracking({
  params,
}: {
  params: { orderId: string };
}) {

  
   const orderId = params?.orderId
   
   
  const token = await getServerCookie("accessToken");
  if(!token){
    redirect("/");
  }
  return (
    <main className="w-[90%] lg:max-w-[70%] mx-auto my-5 min-h-screen flex flex-col gap-5">
      <h1 className={`text-lg font-bold mt-10 text-gray-700 ${designVar.fontFamily} `}>Your order</h1>
      <GoogleMapComponent orderId={orderId} />
    </main>
  );
}
