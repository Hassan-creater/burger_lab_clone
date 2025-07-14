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

import { formatPrice } from "@/lib/utils";
import { parseOrderItems } from "@/lib/orderUtils";
import { Card, CardContent } from "../ui/card";
import { Separator } from "@radix-ui/react-select";
import { designVar } from "@/designVar/desighVar";
import { Button } from "../ui/button";

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
  <Dialog key={order?.order?.id}> {/* Changed to order.order.id */}
    <DialogTrigger asChild>
      <Card  className="w-full cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-orange-500 hover:border-l-orange-600">
        <CardContent className="p-6 shadow-lg rounded-lg  ">
          <div className="flex  items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold text-gray-900 ${designVar.fontFamily}`}>Order #{order?.order?.displayId}</h3> {/* Fixed */}
                <p className={`text-sm text-gray-600 ${designVar.fontFamily}`}>{formatDate(order?.order?.createdAt)}</p> {/* Fixed */}
              </div>
            </div>
            <div className="text-right space-y-2">
              <p className={`${getStatusColor(order?.order?.status)} p-[0.5em] rounded-md ${designVar.fontFamily}`}>{order?.order?.status ? (order?.order?.status).toUpperCase() : "Pending"}</p>
              <p className={`text-lg font-bold text-orange-600 ${designVar.fontFamily}`}>Rs: {order?.order?.total}</p> 
            </div>
          </div>
            <div className={`mt-4 flex items-center justify-between text-sm text-gray-600 ${designVar.fontFamily}`}>
            <span className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              {order?.order?.itemsCount} items {/* Fixed */}
            </span>
            <span className={`flex items-center gap-1 ${designVar.fontFamily}`}>
              <User className="w-4 h-4" />
              {order?.order?.user?.firstName} {order?.order?.user?.lastName} {/* Fixed */}
            </span>
          </div>
        </CardContent>
      </Card>
    </DialogTrigger>

    <DialogContent className="w-[40em] productdetail  descriptionModal lg:w-[70%] mx-auto max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className={`flex items-center gap-2 text-xl ${designVar.fontFamily}`}>
          <Package className="w-6 h-6 text-orange-500" />
          Order Details #{order?.order?.displayId} {/* Fixed */}
        </DialogTitle>  
      </DialogHeader>

      <div className="space-y-6">
        {/* Order Status & Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className={`text-sm font-medium text-gray-600 ${designVar.fontFamily}`}>Status</label>
            <div className="text-center max-w-[15em] space-y-2">
              <p className={`${getStatusColor(order?.order?.status)} p-[0.5em] rounded-md ${designVar.fontFamily}`}>{order?.order?.status ? (order?.order?.status).toUpperCase() : "Pending"}</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className={`text-sm font-medium text-gray-600 ${designVar.fontFamily}`}>Subtotal</label>
            <p className={`text-2xl font-bold text-orange-600 ${designVar.fontFamily}`}>Rs: {order?.order?.total}</p> {/* Fixed */}
          </div>
        </div>

        <Separator />

        {/* Customer Information */}
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold flex items-center gap-2 ${designVar.fontFamily}`}>
            <User className="w-5 h-5 text-orange-500" />
            Customer Information
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className={`font-medium text-gray-600 ${designVar.fontFamily}`}>Name</label>
              <p>
                {order?.order?.user?.firstName} {order?.order?.user?.lastName} {/* Fixed */}
              </p>
            </div>
            <div>
              <label className={`font-medium text-gray-600 ${designVar.fontFamily}`}>Phone</label>
              <p className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {order?.order?.user?.phone} {/* Fixed */}
              </p>
            </div>
          </div>
        </div>

          {/* Delivery Information */}
          {order?.deliveryAddress && (
                <>
                  <Separator />
                  <div className="space-y-4">
                      <h3 className={`text-lg font-semibold flex items-center gap-2 ${designVar.fontFamily}`}>
                      <MapPin className="w-5 h-5 text-orange-500" />
                      Delivery Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <label className={`font-medium text-gray-600 ${designVar.fontFamily}`}>Delivery Name</label>
                        <p>{order?.deliveryName}</p>
                      </div>
                      <div>
                        <label className={`font-medium text-gray-600 ${designVar.fontFamily}`}>Delivery Phone</label>
                        <p>{order?.deliveryPhone}</p>
                      </div>
                      <div>
                        <label className={`font-medium text-gray-600 ${designVar.fontFamily}`}>Address</label>
                        <p>{order?.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Order Items */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${designVar.fontFamily}`}>
                  <Package className="w-5 h-5 text-orange-500" />
                  Order Items ({order?.order?.itemsCount})
                </h3>
                <div className="space-y-3">
                  {order?.order?.items.map((item: any, itemIndex: number) => (
                    <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className={`font-medium ${designVar.fontFamily}`}>{item.variant.name}</h4>
                          <p className={`text-sm text-gray-600 ${designVar.fontFamily}`}>Item #{itemIndex + 1}</p>
                          {item?.variant?.addons?.length > 0 && (
                            <div className="mt-2">
                              <p className={`text-xs font-medium text-gray-600 ${designVar.fontFamily}`}>Add-ons:</p>
                              <p className={`text-xs text-gray-500 ${designVar.fontFamily}`}>
                                {item?.variant?.addons?.map((addon: any) => `${addon.name} x${addon.quantity || 1}`).join(", ")}
                                
                              </p>
                            </div>
                          )}

                           {item?.variant?.dealAddons?.length > 0 && (
                            <div className="mt-2">
                              <p className={`text-xs font-medium text-gray-600 ${designVar.fontFamily}`}>Add-ons:</p>
                              <p className={`text-xs text-gray-500 ${designVar.fontFamily}`}>
                                {item?.variant?.dealAddons?.map((addon: any) => `${addon.name} x${addon.quantity || 1}`).join(", ")}
                                
                              </p>
                            </div>
                          )}

                          {item?.variant?.extras?.length > 0 && (
                            <div className="mt-2">
                              <p className={`text-xs font-medium text-gray-600 ${designVar.fontFamily}`}>Extras:</p>
                              <p className={`text-xs text-gray-500 ${designVar.fontFamily}`}>
                                {item.variant.extras.map((extra: any) => `${extra.name} x${extra.quantity || 1}`).join(", ")}
                              </p>
                            </div>
                          )}

                          {item?.variant?.dealExtras?.length > 0 && (
                            <div className="mt-2">
                              <p className={`text-xs font-medium text-gray-600 ${designVar.fontFamily}`}>Extras:</p>
                              <p className={`text-xs text-gray-500 ${designVar.fontFamily}`}>
                                {item?.variant?.dealExtras.map((extra: any) => `${extra.name} x${extra.quantity || 1}`).join(", ")}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold text-orange-600 ${designVar.fontFamily}`}>Rs: {item.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Order Timeline */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${designVar.fontFamily}`}>
                  <Calendar className="w-5 h-5 text-orange-500" />
                  Order Timeline
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={`text-gray-600 ${designVar.fontFamily}`}>Order Created:</span>
                    <span>{formatDate(order?.order?.createdAt)}</span>
                  </div>
                  {order?.order?.completedOn && (
                    <div className="flex justify-between">
                      <span className={`text-gray-600 ${designVar.fontFamily}`}>Completed:</span>
                      <span>{formatDate(order?.order?.completedOn)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Rating & Review */}
              {order?.order?.rating && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className={`text-lg font-semibold flex items-center gap-2 ${designVar.fontFamily}`}>
                      <Star className="w-5 h-5 text-orange-500" />
                      Customer Review
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < order?.order?.rating! ? "fill-orange-400 text-orange-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium">{order?.order?.rating}/5</span>
                      </div>
                      {/* {order?.order?.rateComment && (
                     <p className="text-sm text-gray-600 italic">
                      &quot;{order?.order?.rateComment}&quot;
                      </p>
                         )} */}
                    </div>
                  </div>
                </>
              )}

              {/* Pricing Breakdown */}
              <Separator />
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${designVar.fontFamily}`}>
             
                  Pricing Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={`${designVar.fontFamily} text-gray-600`}>Subtotal:</span>
                    <span className={`${designVar.fontFamily} text-gray-600`}>Rs: {(order?.order?.total )}</span>
                  </div>
                  {order?.order?.discount && (
                    <div className="flex justify-between text-green-600">
                      <span className={`${designVar.fontFamily} text-gray-600`}>Discount:</span>
                      <span className={`${designVar.fontFamily} text-gray-600`}>Rs: {order?.order?.discount}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span className={`${designVar.fontFamily} text-gray-600`}>Total:</span>
                    <span className={`text-orange-600 ${designVar.fontFamily}`}>Rs: {order?.order?.total - order?.order?.discount}</span>
                  </div>
                </div>
              </div>
      </div>

      <DialogClose className="absolute right-[1em] top-[1em]">
        <CrossIcon className="w-4 h-4 rotate-45" />
      </DialogClose>
    </DialogContent>
  </Dialog>
</div>
  );
}

export default OrderDetailsModal;
