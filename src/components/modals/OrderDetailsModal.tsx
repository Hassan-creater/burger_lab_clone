"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { XIcon } from "lucide-react";
import OrderSummary from "@/app/orders/Components/OrderSummary";
import { OrderItem } from "@/models/Order";
import { formatPrice } from "@/lib/utils";

type OrderDetailsModalProps = {
  order: OrderItem;
  //TODO TEMPORARY
  index: number;
};

function OrderDetailsModal({ order, index }: OrderDetailsModalProps) {
  return (
    <Dialog>
      <DialogTrigger className="rounded-lg outline-primaryOrange">
        <OrderSummary type="MODAL" order={order} index={index} />
      </DialogTrigger>
      <DialogContent className="w-[95%] lg:w-[50%] max-w-full min-h-[250px] h-max flex flex-col  p-5 gap-2 rounded-lg border-0 descriptionModal">
        <h3 className="text-2xl font-bold mb-3">Order Details</h3>
        <OrderSummary
          className="p-0 border-0"
          type="MODAL"
          order={order}
          index={index}
        />
        <div className="flex flex-col gap-2 w-full h-[150px] overflow-y-scroll no-scrollbar py-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              className="w-full flex flex-col gap-1 bg-gray-100 rounded-lg p-3"
              key={index}
            >
              <p className="text-sm">1 x</p>
              <p className="text-sm">Easypaisa Offer</p>
              <p className="text-sm text-gray-400 text-semibold">
                Just Rs.295 for Kruncher + Reg. Fries. Order this deal from the
                Easypaisa Mini App and get Rs.200 cashback into your Easypaisa
                account.
              </p>
              <p className="text-sm self-end">{formatPrice(495)}</p>
            </div>
          ))}
        </div>
        <div className="w-full flex flex-col gap-1">
          <div className="flex w-full items-center justify-between gap-1">
            <p className="text-sm">SubTotal</p>
            <p className="text-sm">{formatPrice(495)}</p>
          </div>
          <div className="flex w-full items-center justify-between gap-1">
            <p className="text-sm">Tax</p>
            <p className="text-sm">{formatPrice(0)}</p>
          </div>
          <div className="flex w-full items-center justify-between gap-1">
            <p className="text-sm">Delivery Charges</p>
            <p className="text-sm">{formatPrice(0)}</p>
          </div>
          <div className="flex w-full items-center justify-between gap-1">
            <p className="text-lg font-bold">Total Amount</p>
            <p className="text-lg font-bold">
              {formatPrice(order.order_total)}
            </p>
          </div>
        </div>
        <DialogClose className="bg-black/80 p-1 rounded-xl text-white right-2 top-2 sm:right-2 sm:top-2">
          <XIcon className="w-6 h-6" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default OrderDetailsModal;
