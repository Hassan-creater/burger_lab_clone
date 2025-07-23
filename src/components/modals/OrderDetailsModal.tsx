"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Badge, Calendar, CrossIcon, DollarSign, MapPin, Package, Phone, Star, User, XIcon } from "lucide-react";
import OrderSummary from "@/app/orders/Components/OrderSummary";

import { formatDisplayId, formatPrice } from "@/lib/utils";
import { parseOrderItems } from "@/lib/orderUtils";
import { Card, CardContent } from "../ui/card";
import { Separator } from "@radix-ui/react-select";
import { designVar } from "@/designVar/desighVar";
import { Button } from "../ui/button";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import OrderDescription from "@/app/orders/Components/OrderDescription";

type OrderDetailsModalProps = {
  order: any;
  //TODO TEMPORARY
  index: number;
};

interface OrderItem {
  id: string
  price: number
  createdAt: string
  updatedAt: string
  variant: {
    addons: any[]
    extras: any[]
    name: string
    price: number
  }
}

interface Order {
  id: string
  displayId: number
  status: string
  total: number
  type: string
  createdAt: string
  completedOn: string | null
  deliveryAddress: string | null
  deliveryName: string | null
  deliveryPhone: string | null
  discount: number | null
  coupon: string | null
  items: OrderItem[]
  itemsCount: number
  rating: number | null
  rateComment: string | null
  user: {
    firstName: string
    lastName: string
    phone: string
    userId: string
  }
  rider: string | null
  riderId: string | null
}




function OrderDetailsModal({ order, index }: OrderDetailsModalProps) {
  const [open, setOpen] = React.useState(false);


 const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}


const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "completed":
      return "bg-green-100 text-green-800 border-green-200"
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200"
    case "processing":
      return "bg-blue-100 text-blue-800 border-blue-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}




  
  return (

<div className={`space-y-4 ${designVar.fontFamily} `}>
  <Dialog key={order?.id} open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Card  className="w-full cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-orange-500 hover:border-l-orange-600">
        <CardContent className="p-6 shadow-lg rounded-lg  ">
          <div className="flex  items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold text-gray-900 ${designVar.fontFamily}`}> Order ID: {
                order.displayIdMetadata && !isNaN(Number(order.displayId))
                  ? formatDisplayId(order.displayIdMetadata, Number(order.displayId))
                  : order.displayId
              }</h3> {/* Fixed */}
                <p className={`text-sm text-gray-600 ${designVar.fontFamily}`}>{formatDate(order?.createdAt)}</p> {/* Fixed */}
              </div>
            </div>
            <div className="text-right space-y-2">
              <p className={`${getStatusColor(order?.status)} p-[0.5em] rounded-md ${designVar.fontFamily}`}>{order?.status ? (order?.status).toUpperCase() : "Pending"}</p>
              <p className={`text-lg font-bold text-orange-600 ${designVar.fontFamily}`}>Rs: {order?.total}</p> 
            </div>
          </div>
            <div className={`mt-4 flex items-center justify-between text-sm text-gray-600 ${designVar.fontFamily}`}>
            <span className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              {order?.itemsCount} items {/* Fixed */}
            </span>
            <span className={`flex items-center gap-1 ${designVar.fontFamily}`}>
              <User className="w-4 h-4" />
              {order?.user?.firstName} {order?.user?.lastName} {/* Fixed */}
            </span>
          </div>
        </CardContent>
      </Card>
    </DialogTrigger>

    <DialogContent className="  w-[95%] productdetail  descriptionModal lg:w-[70%] mx-auto max-h-[80vh] overflow-y-auto rounded-lg">
      <DialogHeader>
        <DialogTitle className={`flex items-center gap-2 text-xl ${designVar.fontFamily}`}>
          <Package className="w-6 h-6 text-orange-500" />
          Order Detail: {
                order.displayIdMetadata && !isNaN(Number(order.displayId))
                  ? formatDisplayId(order.displayIdMetadata, Number(order.displayId))
                  : order.displayId
              }
        </DialogTitle>  
      </DialogHeader>

      <OrderDescription orders={order} index={index} dialogOpen={open} />

      <DialogClose className="absolute right-[1em] top-[1em]">
        <CrossIcon className="w-4 h-4 rotate-45" />
      </DialogClose>
    </DialogContent>
  </Dialog>
</div>
  );
}

export default OrderDetailsModal;
