import PaymentOption from "@/app/checkout/components/PaymentOption";
import InputIndicator from "@/app/product/components/InputIndicator";
import { cn, formatIntlDate, formatPrice } from "@/lib/utils";
import { OrderItem } from "@/models/Order";
import React from "react";

type OrderSummaryProps = {
  className?: string;
  type: "MODAL" | "CHECKOUT";
  order: OrderItem;
  index?: number;
};

const OrderSummary = React.forwardRef<HTMLElement, OrderSummaryProps>(
  ({ className, type, order, index }, ref) => {
    if (type === "MODAL") {
      return (
        <article
          className={cn(
            "p-4 w-full flex flex-col gap-2 bg-white rounded-lg border border-slate-300  cursor-pointer items-start",
            className
          )}
          ref={ref}
        >
          <div className="flex w-full items-center justify-between">
            <p className="text-start font-normal text-sm">
              Order # {(index ?? 0) + 1}
            </p>
            <p className="text-start font-normal text-sm">
              {order.order_created_on
                ? formatIntlDate(new Date(order.order_created_on).toString())
                : "NIL"}
            </p>
          </div>
          <InputIndicator
            className={cn(
              "bg-red-500 w-max p-1 rounded-lg",
              order.status === "pending" && "bg-yellow-500",
              order.status === "delivered" && "bg-green-500"
            )}
          >
            {order.status.toUpperCase()}
          </InputIndicator>
          <p className="text-start font-normal text-sm">
            ETA: <span className="text-gray-400 text-gray">ASAP</span>
          </p>
          <p className="text-start font-normal text-sm">
            Payment Type:{" "}
            <span className="text-gray-400 text-gray">Cash on Delivery</span>
          </p>
          <p className="text-start font-normal text-sm">
            Total Amount:{" "}
            <span className="text-gray-400 text-gray">
              {formatPrice(order.order_total)}
            </span>
          </p>
        </article>
      );
    }

    return (
      <article className="md:w-[50%] w-full flex flex-col shadow-md">
        <section className="flex flex-col gap-2 p-4 px-6 bg-neutral-200/60 rounded-t-lg">
          <h4 className="text-gray-700 text-xl font-semibold">Order Details</h4>
          <p className="text-sm font-normal text-gray-500">
            Delivery Address: DINE-IN
          </p>
          <p className="text-sm font-normal text-gray-700">
            Order Date:{" "}
            {order.order_created_on
              ? formatIntlDate(new Date(order.order_created_on).toString())
              : "NIL"}{" "}
          </p>
        </section>
        <section className="bg-white rounded-b-lg space-y-2 p-2 px-6 w-full">
          <div className="w-full flex flex-col gap-1 max-h-48 overflow-y-scroll no-scrollbar  py-4 my-0">
            <h5>Items</h5>
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                className="w-full flex flex-col gap-1 bg-transparent rounded-lg p-3"
                key={index}
              >
                <div className="flex w-full items-center justify-between text-gray-500 font-medium">
                  <p className="text-sm">1 x Easypaisa Offer</p>
                  <p className="text-sm self-end">{formatPrice(495)}</p>
                </div>
                <p className="text-sm bg-neutral-200/60 p-3 text-gray-700 font-normal rounded-lg">
                  Just Rs.295 for Kruncher + Reg. Fries. Order this deal from
                  the Easypaisa Mini App and get Rs.200 cashback into your
                  Easypaisa account.
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-t-neutral-200 py-2 mt-0 space-y-1">
            <div className="flex w-full items-center justify-between gap-1">
              <p className="text-sm text-gray-500 font-normal">SubTotal</p>
              <p className="text-sm text-gray-500 font-normal">
                {formatPrice(495)}
              </p>
            </div>
            <div className="flex w-full items-center justify-between gap-1">
              <p className="text-sm text-gray-500 font-normal">Tax</p>
              <p className="text-sm text-gray-500 font-normal">
                {formatPrice(0)}
              </p>
            </div>
            <div className="flex w-full items-center justify-between gap-1">
              <p className="text-sm text-gray-500 font-normal">
                Delivery Charges
              </p>
              <p className="text-sm text-gray-500 font-normal">
                {formatPrice(0)}
              </p>
            </div>
            <div className="flex w-full items-center justify-between gap-1">
              <p className="text-sm lg:text-lg font-medium text-black">
                Total Amount{" "}
                <span className="text-xs text-gray-500">(incl tax)</span>
              </p>
              <p className="text-sm lg:text-lg font-medium text-black">
                {formatPrice(order.order_total)}
              </p>
            </div>
          </div>
          <div className="border-t border-t-neutral-200 py-2 mt-0">
            <p className="text-start font-medium text-black text-lg ">
              Payment Type:{" "}
            </p>
            <PaymentOption
              type="COD"
              variant="secondary"
              className="border-0 hover:bg-transparent active:scale-100"
            />
          </div>
        </section>
      </article>
    );
  }
);

OrderSummary.displayName = "OrderSummary";

export default OrderSummary;
