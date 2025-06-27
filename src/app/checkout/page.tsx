"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import PaymentOption from "./components/PaymentOption";
import Cart from "@/components/cart/Cart";

import { getClientCookie } from "@/lib/getCookie";
import { useCartContext } from "@/context/context";
import { apiClient } from "@/lib/api";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectItem } from "@radix-ui/react-select";
import { designVar } from "@/designVar/desighVar";

export type OrderDetails = {
  comment: string;
  addressid: string;
  orderType : string;
  items: any[];
  total: number;
  status : string,
  deliveryCharge: string;
  discount: string;
  tax: string;
  couponId?: string | number;
};

function Checkout() {
  const token = getClientCookie('accessToken');
  // const { user } = useUserStore();

  // const { items } = useCart();
  // const router = useRouter();

  // const [orderDetails, setOrderDetails] = useState<OrderDetails>(() => ({
  //   comment: "",
  //   addressid: "",
  //   items: items,
  //   orderType : "dine_in",
  //   total: 0,
  //   deliveryCharge: "0",
  //   tax: "0",
  //   discount: "0",
  //   status : "pending"
  // }));

  // const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  /* Original order placement mutation code
  const addOrder = useMutation({
    mutationFn: () => placeOrder(...),
    onSuccess: (data) => {
      // ... success handling
    },
  });
  */

  // Using dummy order placement
  // const addOrder = {
  //   mutate: () => {
  //     setIsPlacingOrder(true);
  //     // Simulate API delay
  //     setTimeout(() => {
  //       const dummyOrderResult = {
  //         status: 200,
  //         order: {
  //           orderId: Math.floor(Math.random() * 1000) + 1,
  //           userId: user?.userId,
  //           total: orderDetails.total,
  //           status: "pending",
  //           created_at: new Date().toISOString(),
  //         },
  //       };

  //       // Clear cart and redirect
  //       router.push("/order-complete/" + dummyOrderResult.order.orderId);
  //       setIsPlacingOrder(false);

  //       toast.success("Order placed successfully!", {
  //         closeButton: true,
  //         dismissible: true,
  //         style: {
  //           color: "white",
  //           backgroundColor: "green",
  //         },
  //       });
  //     }, 1000);
  //   },
  //   isPending: isPlacingOrder
  // };


 const userData = Cookies.get("userData");
 const [deliveryAddressValue , setDeliveryAddressValue] = useState("");
 const parsedUserData = userData ? JSON.parse(userData) : null;
 const userid = parsedUserData?.id;
  const {setComment , AddressData , setDeliveryName , setDeliveryPhone , setDeliveryAddress ,deliveryAddress} = useCartContext();




   const getAddresses = async () => {
    const res = await apiClient.get(`/address/user/${userid}`);
    return res.data.data;
   }

   const {data , isLoading} = useQuery({
    queryKey : ["addresses" , userid],
    queryFn : getAddresses,
    enabled : !!userid
   })
  

  useEffect(()=>{
  

    const canCheckout = sessionStorage.getItem("canCheckout");
    if(!canCheckout){
      redirect("/");
    }
  },[])
 

  return (
    <main className="w-[100%] bg-white p-[0.5em] lg:max-w-[85%] mx-auto my-5 min-h-screen">
      <h1 className={`text-lg font-bold mb-5 ${designVar.fontFamily}`}>Checkout</h1>

      
      <div className="w-full h-auto flex flex-col lg:flex-row gap-5">
        <section className="w-full lg:w-[55%] flex flex-col gap-5 h-max">

  


            {
              AddressData?.orderType == "delivery" && (
                <>
                 <div className="bg-primaryBg  px-3 py-[1em] rounded-lg">
                <label htmlFor="address" className={`text-md ${designVar.fontFamily}`}>Delivery Address <span className="text-red-500">*</span></label>
                <Select  value={deliveryAddressValue} onValueChange={(value) => {setDeliveryAddressValue(value); setDeliveryAddress(value)}}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Address">
                      {deliveryAddressValue}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {
                      data?.map((item: any) => (
                        <SelectItem className="text-black" key={item.id} value={item.line1 + " , " + item.line2}>{item.line1} , {item.line2}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>


              <div className="bg-primaryBg  px-3 py-[1em] rounded-lg">
                <label htmlFor="address" className={`text-md ${designVar.fontFamily}`}>Delivery Name <span className="text-red-500">*</span></label>
                <input type="text" className="w-full py-[0.5em] border border-gray-300 rounded-md p-2" placeholder="Enter delivery name" onChange={(e) => setDeliveryName(e.target.value)}/>
              </div>


              <div className="bg-primaryBg  px-3 py-[1em] rounded-lg">
                <label htmlFor="address" className={`text-md ${designVar.fontFamily}`}>Delivery Phone <span className="text-red-500">*</span></label>
                <input type="number" className="w-full py-[0.5em] border border-gray-300 rounded-md p-2" placeholder="Enter your phone number" onChange={(e) => setDeliveryPhone(e.target.value)}/>
              </div>


              

              
                </>
               

              
              )
            }
          <div className="bg-primaryBg h-max px-3 py-8 rounded-lg">
            <div className="flex flex-col gap-2">
              <Label className={`text-[1rem] font-normal leading-relaxed ${designVar.fontFamily}`}>
                Special Instructions ( Optional )
              </Label>
              <Textarea
                className="focus-visible:ring-primaryOrange placeholder:text-gray-500 text-black"
                onChange={(e) =>
                 setComment(e.target.value)
                }
                placeholder="Add any comment, e.g about allergies, or delivery instructions here."
              />
            </div>
          </div>
          <div className="bg-primaryBg h-max px-3 py-8 rounded-lg space-y-4">
            <h3 className={`text-[1rem] font-normal leading-relaxed ${designVar.fontFamily}`}>
              Select Payment Method
            </h3>
            <PaymentOption type="COD" />
          </div>
        </section>
        <section className="w-full lg:w-[45%] relative bg-primaryBg rounded-lg px-5 py-8 h-max">
        <h3 className={`text-lg font-semibold leading-relaxed ${designVar.fontFamily}`}>Your cart</h3>
          <Cart
            type="CHECKOUT"
          />
        </section>
      </div>
    </main>
  );
}

export default Checkout;
