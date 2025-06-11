import { Metadata } from "next";
import AddressDetails from "@/components/address/AddressDetails";

type AddressesProps = {};

export const metadata: Metadata = {
  title: "Addresses - Burger Lab",
};

export const dynamic = "force-dynamic";

export default async function Addresses({}: AddressesProps) {
  return (
    <main className="w-[90%] lg:max-w-[75%] mx-auto mb-8 mt-10 min-h-screen flex flex-col">
      <AddressDetails />
    </main>
  );
}
