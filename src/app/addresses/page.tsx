import { Metadata } from "next";
import AddressDetails from "@/components/address/AddressDetails";
import { getServerCookie } from "../(site)/page";
import { redirect } from "next/navigation";
import { useCartContext } from "@/context/context";
import { designVar } from "@/designVar/desighVar";

type AddressesProps = {};

export const metadata: Metadata = {
  title: "Addresses - Burger Lab",
};

export const dynamic = "force-dynamic";

export default async function Addresses({}: AddressesProps) {
 
  const token = await getServerCookie("accessToken");

 
  
  if(!token){
    redirect("/");
  }

  return (
    <main className={`w-[90%]  relative lg:max-w-[90%] mx-auto mb-8 mt-10  flex flex-col ${designVar.fontFamily}`}>
      <AddressDetails />
    </main>
  );
}
