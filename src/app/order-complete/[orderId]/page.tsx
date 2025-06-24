import { getOrder } from "@/functions";
import React from "react";
import { Button } from "@/components/ui/button";
import OrderSummary from "@/app/orders/Components/OrderSummary";
import Link from "next/link";
import LoadingFlash from "@/components/LoadingFlash";
import {OrderItem} from "@/models/Order";
import { getServerCookie } from "@/app/(site)/page";
import { redirect } from "next/navigation";

async function OrderComplete(props: { params: Promise<{ orderId: string }> }) {

  const token = await getServerCookie("accessToken");
  if(!token){
    redirect("/");
  }
  const params = await props.params;
  if (!params.orderId) {
    return (
      <main className="w-[90%] lg:max-w-[85%] mx-auto my-5 min-h-screen flex flex-col gap-5 items-center justify-center">
        <p className="text-lg font-bold">Order Not Found</p>
        <Link href="/">
          <Button className="w-[40%] min-w-[250px] mx-auto px-5 py-2 bg-primaryOrange text-black hover:bg-primaryOrange/80 text-lg">
            View All Items
          </Button>
        </Link>
      </main>
    );
  }

  const orderDetails = await getOrder();
  // parseInt(params.orderId)

  console.log(orderDetails);

  if (
    !orderDetails.order ||
    orderDetails.status === 500 ||
    orderDetails.order?.status !== "pending"
  ) {
    return (
      <main className="w-[90%] lg:max-w-[85%] mx-auto my-5 min-h-screen flex flex-col gap-5 items-center justify-center">
        <p className="text-lg font-bold">Order Not Found</p>
        <Link href="/">
          <Button className="w-[40%] min-w-[250px] mx-auto px-5 py-2 bg-primaryOrange text-black hover:bg-primaryOrange/80 text-lg">
            View All Items
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="w-full md:w-[95%] mx-auto my-10 p-5 h-max flex md:flex-row flex-col gap-8 items-center justify-center">
      <div className="w-full md:w-[50%] bg-white rounded-lg flex flex-col gap-2 items-center justify-center p-5 shadow-md">
        <p className="text-lg text-gray-500 font-normal">Your status is</p>
        <h3 className="text-3xl text-gray-700 font-bold">PENDING</h3>
        {/* <BoxAnimation /> */}
        <LoadingFlash />
        <p className="text-gray-700 text-sm font-normal text-center">
          Your order has been received. You will get a confirmation shortly once
          your order is accepted. Thank you!
        </p>
        <h4 className="text-lg text-gray-700 font-medium">
          Order Number:{" "}
          <span className="text-black font-semibold">{params.orderId}</span>
        </h4>
      </div>
       {/*<OrderSummary type="CHECKOUT" /> */}
    </main>
  );
}

export default OrderComplete;
