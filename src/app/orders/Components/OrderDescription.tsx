import { designVar } from '@/designVar/desighVar'
import { apiClient } from '@/lib/api';
import { Separator } from '@radix-ui/react-select'
import { useQuery } from '@tanstack/react-query';
import { Calendar, MapPin, Package, Phone, Star, User } from 'lucide-react';
import React from 'react'



type OrderDetailsModalProps = {
    orders: any;
    //TODO TEMPORARY
    index: number;
    dialogOpen?: boolean;
  };



   function OrderDescription({ orders , index, dialogOpen }: OrderDetailsModalProps) {
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


      const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      }




      const getOrder  = async ()=>{
        try {
          const res = await apiClient.get(`/order/${orders?.id}`);
          if (res.status === 200 || res.status === 201) {
            return res.data.data?.order;
          }
          // Treat non-200/201 as invalid
          throw new Error(`Unexpected status: ${res.status}`);
        } catch (error) {
          
          return null;
        }
       }
        
      
        const {data: order , isLoading} = useQuery({
          queryKey : ["sepOrder"],
          queryFn : getOrder,
          enabled : !!orders?.id && !!dialogOpen
        })

      
       
  if(isLoading){
    return(
        <div key={index} className="space-y-6 animate-pulse">
  {/* Status & Subtotal */}
  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-24" />
      <div className="h-8 bg-gray-200 rounded w-32 mx-auto" />
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-24" />
      <div className="h-8 bg-gray-200 rounded w-32" />
    </div>
  </div>

  <Separator />

  {/* Customer Information */}
  <div className="space-y-4">
    <div className="h-5 bg-gray-200 rounded w-48" />
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <div className="h-4 bg-gray-200 rounded w-20 mb-1" />
        <div className="h-5 bg-gray-200 rounded w-32" />
      </div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-20 mb-1" />
        <div className="h-5 bg-gray-200 rounded w-32" />
      </div>
    </div>
  </div>

  {/* Delivery Info */}
  <Separator />
  <div className="space-y-4">
    <div className="h-5 bg-gray-200 rounded w-48" />
    <div className="space-y-2 text-sm">
      {[1, 2, 3].map((_, i) => (
        <div key={i}>
          <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
          <div className="h-5 bg-gray-200 rounded w-48" />
        </div>
      ))}
    </div>
  </div>

  {/* Order Items */}
  <Separator />
  <div className="space-y-4">
    <div className="h-5 bg-gray-200 rounded w-48" />
    <div className="space-y-3">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4 bg-gray-100 space-y-2">
          <div className="flex justify-between">
            <div className="space-y-2 w-full">
              <div className="h-4 bg-gray-200 rounded w-40" />
              <div className="h-3 bg-gray-200 rounded w-20" />
              <div className="h-3 bg-gray-200 rounded w-32" />
              <div className="h-3 bg-gray-200 rounded w-32" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Order Timeline */}
  <Separator />
  <div className="space-y-4">
    <div className="h-5 bg-gray-200 rounded w-48" />
    <div className="space-y-2">
      {[1, 2].map((_, i) => (
        <div key={i} className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
      ))}
    </div>
  </div>

  {/* Customer Review */}
  <Separator />
  <div className="space-y-4">
    <div className="h-5 bg-gray-200 rounded w-48" />
    <div className="flex gap-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-4 w-4 bg-gray-200 rounded-full" />
      ))}
      <div className="h-4 bg-gray-200 rounded w-8" />
    </div>
  </div>

  {/* Pricing Breakdown */}
  <Separator />
  <div className="space-y-4">
    <div className="h-5 bg-gray-200 rounded w-48" />
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
      <Separator />
      <div className="flex justify-between">
        <div className="h-6 bg-gray-200 rounded w-24" />
        <div className="h-6 bg-gray-200 rounded w-24" />
      </div>
    </div>
  </div>
</div>

    )
  }    

  return (
    <div key={index} className="space-y-6">
        {/* Order Status & Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className={`text-sm font-medium text-gray-600 ${designVar.fontFamily}`}>Status</label>
            <div className="text-center max-w-[15em] space-y-2">
              <p className={`${getStatusColor(order?.status)} p-[0.5em] rounded-md ${designVar.fontFamily}`}>{order?.status ? (order?.status).toUpperCase() : "Pending"}</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className={`text-sm font-medium text-gray-600 ${designVar.fontFamily}`}>Subtotal</label>
            <p className={`text-2xl font-bold text-orange-600 ${designVar.fontFamily}`}>Rs: {order?.total}</p> {/* Fixed */}
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
                {order?.customer?.firstName} {order?.customer?.lastName} {/* Fixed */}
              </p>
            </div>
            <div>
              <label className={`font-medium text-gray-600 ${designVar.fontFamily}`}>Phone</label>
              <p className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {order?.customer?.phone} {/* Fixed */}
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
                      <MapPin  className="w-5 h-5 text-orange-500" />
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
                  Order Items ({order?.itemsCount})
                </h3>
                <div className="space-y-3">
                  {order?.items.map((item: any, itemIndex: number) => (
                    <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className={`text-sm text-gray-600 ${designVar.fontFamily}`}>Item #{itemIndex + 1}</p>
                          <h4 className={`font-medium ${designVar.fontFamily}`}>{item.variant.itemName}</h4>
                          <p className={`font-normal ${designVar.fontFamily}`}>{item.variant.name}</p>
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
                    <span>{formatDate(order?.createdAt)}</span>
                  </div>
                  {order?.completedOn && (
                    <div className="flex justify-between">
                      <span className={`text-gray-600 ${designVar.fontFamily}`}>Completed:</span>
                      <span>{formatDate(order?.completedOn)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Rating & Review */}
              {order?.rating && (
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
                              i < order?.rating! ? "fill-orange-400 text-orange-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium">{order?.rating}/5</span>
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
                    <span className={`${designVar.fontFamily} text-gray-600`}>Rs: {(order?.total )}</span>
                  </div>
                  {order?.order?.discount && (
                    <div className="flex justify-between text-green-600">
                      <span className={`${designVar.fontFamily} text-gray-600`}>Discount:</span>
                      <span className={`${designVar.fontFamily} text-gray-600`}>Rs: {order?.discount}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span className={`${designVar.fontFamily} text-gray-600`}>Total:</span>
                    <span className={`text-orange-600 ${designVar.fontFamily}`}>Rs: {order?.total}</span>
                  </div>
                </div>
              </div>
      </div>
  )
}

export default OrderDescription
