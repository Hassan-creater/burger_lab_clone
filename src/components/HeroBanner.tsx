"use client";

import { useEffect, useRef, useState } from "react";
import {
	Carousel as CarouselContainer,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "./ui/carousel";
import Image from "next/image";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useObserverStore } from "@/store/slices/observerSlice";
import { dummySlides } from "@/lib/dummyData";
import { apiClientCustomer } from "@/lib/api";
import { chownSync } from "fs";
import { useQuery } from "@tanstack/react-query";
import { useCartContext } from "@/context/context";
import { toast } from "sonner";
import { updateAddress } from "@/functions";

function HeroBanner() {
	/* Original data fetching code
	const { data, status } = useQuery({
		queryKey: ["slides"],
		queryFn: getAllSlides,
		refetchOnWindowFocus: false,
	});
	*/

	// Using dummy data instead
	const data = {
		status: 200,
		slides: dummySlides
	};


	const {AddressData , UpdateAddressData , setOpen} = useCartContext()
    
 

	const CheckBranch = async () => {

	
		try {
		  const res = await apiClientCustomer.get(
			`branch/${AddressData.branchId}/view/customer`
		  );
	  
		  let addressData = JSON.parse(localStorage.getItem("addressData") || "{}");
		  let hasUpdated = false;

	

		 
	  
		  if (
			AddressData?.orderType === "delivery" &&
			!res.data.data.isDeliveryAvailable
		  ) {
			localStorage.removeItem("addressData");
			UpdateAddressData({});
			setOpen(true);
			return;
		  }
	  
		  if (
			AddressData?.orderType === "pickup" &&
			!res.data.data.isTakeAwayAvailable
		  ) {
			localStorage.removeItem("addressData");
			UpdateAddressData({});
			setOpen(true);
			return;
		  }
	  
		  if (
			AddressData?.orderType === "dine_in" &&
			!res.data.data.isDineInAvailable
		  ) {
			localStorage.removeItem("addressData");
			UpdateAddressData({});
			setOpen(true);
			return;
		  }
	  
		  if (
			AddressData?.branchId === res.data.data.id &&
			res.data.data.whatsappNumber !== AddressData.whatsappNumber
		  ) {
			addressData = {
			  ...addressData,
			  whatsappNumber: res.data.data.whatsappNumber,
			};
			hasUpdated = true;
		  }
	  
		  if (
			hasUpdated &&
			res.data.data.contactPhone !== AddressData.contactPhone
		  ) {
			addressData = {
			  ...addressData,
			  contactPhone: res.data.data.contactPhone,
			};
		  }
	  
		  if (res.data.data.tax !== AddressData.tax) {
			addressData = {
			  ...addressData,
			  tax: res.data.data.tax,
			};
		  }
	  
		  if (res.data.data.supportEmail !== AddressData.supportEmail) {
			addressData = {
			  ...addressData,
			  supportEmail: res.data.data.supportEmail,
			};
		  }
	  
		  if (res.data.data.address !== AddressData.address) {
			addressData = {
			  ...addressData,
			  address: res.data.data.address,
			};
		  }
	  
		  const socialMedia = AddressData.socialMedias || [];
		  const resSocialMedia = res.data.data.socialMedias || [];
		  
		  if (JSON.stringify(socialMedia) !== JSON.stringify(resSocialMedia)) {
			addressData = {
			  ...addressData,
			  socialMedias: resSocialMedia,
			};
			hasUpdated = true;
		  }
		  
	  
		  if (JSON.stringify(addressData) !== JSON.stringify(AddressData)) {
			localStorage.removeItem("addressData");
			UpdateAddressData(addressData);
		  }
		} catch (error: any) {
		  if (error.response?.status === 404) {
			localStorage.removeItem("addressData");
			UpdateAddressData({});
		  }
		}
	  };
	  
	  
	  


	



	const getAllSlides = async () => {
		const res = await apiClientCustomer.get("/slide/view/customer");
		return res.data.data?.slides;
	}


	const { data: slides } = useQuery({
		queryKey: ["slides"],
		queryFn: getAllSlides,
		
	  });
	  
	  
	
	const carouselRef = useRef<HTMLDivElement>(null);
	const [currentIndex, setCurrentIndex] = useState(0);
  
	// Optional: visibility-based rendering
	const isVisible = useIntersectionObserver(carouselRef as React.RefObject<HTMLElement>, { threshold: 0.6 });
	const { setIsBannerVisible } = useObserverStore();
  
	useEffect(() => {
	  setIsBannerVisible(!!isVisible);
	}, [isVisible, setIsBannerVisible]);
  
	// Auto-scroll effect
	useEffect(() => {
	  const interval = setInterval(() => {
		setCurrentIndex((prev) => (prev + 1) % slides?.length);
	  }, 2000); // Change image every 3s
  
	  return () => clearInterval(interval); 
	}, [slides?.length]);


	useEffect(()=>{
      if(AddressData?.branchId){
		CheckBranch();
	  }
	},[AddressData])

	return (
		<CarouselContainer
		className="relative w-[95%] sm:w-full h-[15em] lg:w-full  md:h-[23em] lg:h-[28em] xl_screens:h-[45em] 2xl_screens:h-[55em] flex justify-center    items-center overflow-hidden rounded-lg"
		opts={{ loop: true }}
		autoplay={true}
		ref={carouselRef}
	  >
		<CarouselContent data-carousel-content>
		  {slides?.map((slide: any) => (
			<CarouselItem
			  key={slide.id}
			  className="w-screen aspect-[3000/2000] sm:aspect-[3000/1000] h-full flex items-center justify-center "
			>
			  <div className="w-full h-full flex items-center justify-center aspect-[2400/1000]">
				<img
				 src={(slide?.image || "").trimStart()}
				  alt={`Slide no ${slide?.id}`}
				  width={3000}
				  height={1000}
				 
				  loading="eager"
				  className="w-full h-full object-cover"
				  onError={e => {
					const target = e.currentTarget as HTMLImageElement;
					if (target.src !== "/logo-symbol-2.png") {
					  target.src = "/logo-symbol-2.png";
					}
				  }}
				/>
			  </div>
			</CarouselItem>
		  ))}
		</CarouselContent>
  
		{/* Navigation Buttons */}
		<CarouselPrevious className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 z-10 bg-[#fabf2c] h-10 w-6 md:w-10 md:h-16 text-gray-700 hover:bg-[#fabf2a] opacity-80  " />

       <CarouselNext className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 z-10 bg-[#fabf2c] h-10 w-6 md:w-10 md:h-16 text-gray-700 hover:bg-[#fabf2a] opacity-80" />
	  </CarouselContainer>


	);
}

export default HeroBanner;
