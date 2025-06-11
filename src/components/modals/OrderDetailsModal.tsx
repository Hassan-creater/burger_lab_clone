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
import { parseOrderItems } from "@/lib/orderUtils";

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
        />        <div className="flex flex-col gap-2 w-full h-[150px] overflow-y-scroll no-scrollbar py-3">
          {parseOrderItems(order.items).map((item: any, index: number) => (
            <div
              className="w-full flex flex-col gap-1 bg-gray-100 rounded-lg p-3"
              key={index}
            >
              <div className="flex justify-between items-center">
                <p className="text-sm">{item.qty} x {item.name}</p>
                <p className="text-sm self-end">{formatPrice(parseFloat(item.price) * parseInt(item.qty))}</p>
              </div>
              {item.description && (
                <p className="text-sm text-gray-400 text-semibold">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="w-full flex flex-col gap-1">
          <div className="flex w-full items-center justify-between gap-1">
            <p className="text-sm">SubTotal</p>
            <p className="text-sm">{formatPrice(parseFloat(order.total) - parseFloat(order.deliveryCharge) - parseFloat(order.tax) + parseFloat(order.discount))}</p>
          </div>          <div className="flex w-full items-center justify-between gap-1">
            <p className="text-sm">Tax</p>
            <p className="text-sm">{formatPrice(parseFloat(order.tax))}</p>
          </div>
          <div className="flex w-full items-center justify-between gap-1">
            <p className="text-sm">Delivery Charges</p>
            <p className="text-sm">{formatPrice(parseFloat(order.deliveryCharge))}</p>
          </div>
          {parseFloat(order.discount) > 0 && (
            <div className="flex w-full items-center justify-between gap-1">
              <p className="text-sm text-red-500">Discount</p>
              <p className="text-sm text-red-500">-{formatPrice(parseFloat(order.discount))}</p>
            </div>
          )}
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
