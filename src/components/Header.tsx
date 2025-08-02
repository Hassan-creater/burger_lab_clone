"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import Cart from "./cart/Cart";
import ProfileDropdown from "./ProfileDropdown";
import { usePathname } from "next/navigation";
import AuthModal from "./modals/AuthModal";
import { useCartContext } from "@/context/context";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import Cookies from "js-cookie";
const NoSSRLocationModal = dynamic(() => import("./modals/LocationModal"), {
  ssr: false,
});

const Header = () => {

  const {token , user , deliveryClose , dineInClose , pickupClose  , setUser  } = useCartContext();

  const pathname = usePathname();


  const getUserRoles = async () => {
    try {
      const res = await apiClient.get("/role");
      return res.data.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        Cookies.remove("accessToken", { path: "/" });
        Cookies.remove("refreshToken", { path: "/" });
        Cookies.remove("userData" , {path : "/"});
        localStorage.removeItem("defaultAddress")
        setUser({});
        window.location.href = "/";
      } 
      return null;
    }
  };
  
  
  
  // ------------------------
  // extract user form cookies 
  // -------------------------
  

  
  const { data } = useQuery({
    queryKey: ["userRoles"],
    queryFn: getUserRoles,
    enabled : !!user?.firstName,
    staleTime: 60 * 1000,         // Optional: data is considered fresh for 1 minute
    refetchInterval: 60 * 1000,   //  Refetch every 1 minute
  });
  
  

  return (
    <header className={`w-full sticky top-0 z-50 ${deliveryClose || dineInClose || pickupClose ? "h-24" : "h-20"} bg-white shadow-sm shadow-neutral-300`}>
    
    <>
         {
     deliveryClose && (
      
       <p className="text-[12px] text-center  bg-red-500 text-white">{deliveryClose}</p>
     )
    }
    {
     dineInClose && (
       <p className="text-[12px] text-center  bg-red-500 text-white">{dineInClose}</p>
     )
    }
    {
     pickupClose && (
       <p className="text-[12px] text-center  bg-red-500 text-white">{pickupClose}</p>
     )
    }
        </>

   
    
         <nav className="flex items-center justify-between  w-full lg:w-[85%] m-auto px-4">
        {/* Left: Location Modal */}
      
        <div className="flex-1 flex justify-start">
       <NoSSRLocationModal />
        </div>

   
     {/* Center: Logo */}
     <div className="flex-1 flex justify-center  h-[5em]">
       <Link href="/" className="w-[50%] sm:w-[60%] h-full  flex items-center justify-center">
         <img
           src="/blueLogo.png"
           alt="website-logo-showing-its-name"
           width={80}
           height={80}
           fetchPriority="high"
           className="object-cover scale-[2]"
           title="Burger Lab"
         />
       </Link>
     </div>
   
     {/* Right: Cart / Auth */}
    
     <div className="flex-1 flex justify-end items-center gap-2 sm:gap-3">
       {pathname !== "/checkout" && pathname !== "/order-complete" && (
         <Cart type="CART" className="block min-[400px]:block" />
       )}
       {token && user?.firstName ? (
          <ProfileDropdown user={`${user?.firstName} ${user?.lastName}`} />
        
       ) : (
          
          <AuthModal />
       )}
     </div>
   </nav>
       </header>
   
  );
};

export default Header;
