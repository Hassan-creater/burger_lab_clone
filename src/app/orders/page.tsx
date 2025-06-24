// import { Metadata } from "next";
// import { getServerCookie } from "../(site)/page";
// import { redirect } from "next/navigation";
// import dynamic from "next/dynamic";

// const OrderDetails = dynamic(() => import("./Components/OrderDetails"), { ssr: false });

// type OrdersProps = {};

// export const metadata: Metadata = {
//   title: "Orders - Burger Lab",
// };

// export const dynamic = "force-dynamic";

// export default async function Orders({}: OrdersProps) {
//   const token = await getServerCookie("accessToken");
//   if(!token){
//     redirect("/");
//   }
//   return (
//     <main className="w-[90%] lg:max-w-[70%] mx-auto my-5 min-h-screen flex flex-col gap-5">
//       <h1 className="text-lg font-bold mt-10 text-gray-700">My Orders</h1>
//       <OrderDetails />
//     </main>
//   );
// }


import { Metadata } from "next";
import { getServerCookie } from "../(site)/page";
import { redirect } from "next/navigation";
import dynamicImport from "next/dynamic"; // <-- renamed

const OrderDetails = dynamicImport(() => import("./Components/OrderDetails"), { ssr: false });

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
      <h1 className="text-lg font-bold mt-10 text-gray-700">My Orders</h1>
      <OrderDetails />
    </main>
  );
}
