import PaymentOption from "@/app/checkout/components/PaymentOption";
import InputIndicator from "@/app/product/components/InputIndicator";
import { cn, formatIntlDate, formatPrice } from "@/lib/utils";
import { parseOrderItems } from "@/lib/orderUtils";
import { OrderItem } from "@/models/Order";
import React from "react";

type OrderSummaryProps = {
  className?: string;
  type: "MODAL" | "CHECKOUT";
  order: any;
  index?: number;
};

const OrderSummary = React.forwardRef<HTMLElement, OrderSummaryProps>(
  ({ className, type, order, index }, ref) => {
   


    if (type === "MODAL") {
      return (
        <article
        className={cn(
          "p-4 w-full flex flex-col gap-4 rounded-lg border border-slate-300 cursor-pointer",
          className
        )}
        ref={ref}
      >
        {/* Order Header */}
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-gray-700">
            Order #{(index ?? 0) + 1}
          </p>
          <p className="text-sm text-gray-500">
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : 'N/A'}
          </p>
        </div>
      
        {/* Status Badge */}
        <InputIndicator
          className={cn(
            'px-2 py-1 rounded-md text-xs font-semibold',
            order.status === 'pending' && 'bg-yellow-200 text-yellow-800',
            order.status === 'delivered' && 'bg-green-200 text-green-800',
            order.status === 'canceled' && 'bg-red-200 text-red-800'
          )}
        >
          {order?.status?.toUpperCase()}
        </InputIndicator>
      
        {/* Details Row */}
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-600">
            Type: <span className="text-gray-800 font-medium">{order.type?.toUpperCase() || 'N/A'}</span>
          </p>
          {order.type === 'delivery' && order.deliveryAddress && (
            <p className="text-sm text-gray-600">
              Address: <span className="text-gray-800">{order.deliveryAddress}</span>
            </p>
          )}
          <p className="text-sm text-gray-600">
            Payment: <span className="text-gray-800">{order.paymentType || 'COD'}</span>
          </p>
        </div>
      
        {/* Total Amount */}
        <div className="mt-2 flex justify-between items-center border-t pt-2">
          <p className="text-sm font-medium text-gray-700">Total Amount</p>
          <p className="text-sm font-semibold text-gray-900">
            {formatPrice(order.order_total)}
          </p>
        </div>
      </article>
      );
    }

    return (
      <article className="md:w-[50%] w-full flex flex-col shadow-md rounded-lg overflow-hidden">
      {/* Header */}
      <section className="flex flex-col gap-1 p-4 bg-gray-100">
        <h4 className="text-gray-800 text-2xl font-semibold">Order Details</h4>
        <div className="flex flex-wrap gap-4 mt-2">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Type:</span>{' '}
            {order.type?.toUpperCase() || 'N/A'}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Date:</span>{' '}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : 'N/A'}
          </div>
        </div>
      </section>
    
      {/* Items List */}
      <section className="bg-white p-4 space-y-4 max-h-60 overflow-y-auto">
        <h5 className="text-lg font-medium text-gray-700">Items</h5>
        {parseOrderItems(order.items).map((item: any, idx: number) => (
          <div key={idx} className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-sm text-gray-800 font-medium">
                {item.qty} x {item.name}
              </p>
              {item.description && (
                <p className="mt-1 text-xs text-gray-500">{item.description}</p>
              )}
            </div>
            <p className="text-sm text-gray-800 font-medium">
              {formatPrice(parseFloat(item.price) * parseInt(item.qty))}
            </p>
          </div>
        ))}
      </section>
    
      {/* Totals */}
      <section className="bg-gray-50 p-4 space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>
            {formatPrice(
              parseFloat(order.total) -
                parseFloat(order.deliveryCharge || '0') -
                parseFloat(order.tax || '0') +
                parseFloat(order.discount || '0')
            )}
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tax</span>
          <span>{formatPrice(parseFloat(order.tax || '0'))}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Delivery</span>
          <span>{formatPrice(parseFloat(order.deliveryCharge || '0'))}</span>
        </div>
        {parseFloat(order.discount || '0') > 0 && (
          <div className="flex justify-between text-sm text-red-500">
            <span>Discount</span>
            <span>-{formatPrice(parseFloat(order.discount))}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold text-gray-800 border-t pt-2">
          <span>Total (incl. tax)</span>
          <span>{formatPrice(order.order_total)}</span>
        </div>
      </section>
    
      {/* Payment Method */}
      <section className="bg-white p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Payment Method</p>
        <PaymentOption
          type={order.paymentType || 'COD'}
          variant="secondary"
          className="border-0 hover:bg-transparent"
        />
      </section>
    </article>
    );
  }
);

OrderSummary.displayName = "OrderSummary";

export default OrderSummary;
