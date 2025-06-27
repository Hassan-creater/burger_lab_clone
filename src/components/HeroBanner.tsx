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

	const getAllSlides = async () => {
		const res = await apiClientCustomer.get("/slide/view/customer");
		return res.data.data?.slides;
	}

	getAllSlides();

	const {data: slides} = useQuery({
		queryKey: ["slides"],
		queryFn: getAllSlides,
	
	})	
	
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
	  }, 4000); // Change image every 4s
  
	  return () => clearInterval(interval); // Cleanup on unmount
	}, [slides?.length]);

	return (
		<CarouselContainer
		className="relative w-full lg:max-w-[95%] h-[10em] lg:h-[28em] flex justify-center items-center overflow-hidden"
		opts={{ loop: true }}
		autoplay={true}
		ref={carouselRef}
	  >
		<CarouselContent data-carousel-content>
		  {slides?.map((slide: any) => (
			<CarouselItem
			  key={slide.id}
			  className="w-full h-full flex items-center justify-center flex-shrink-0"
			>
			  <div className="w-full h-full flex items-center justify-center">
				<Image
				  src={slide?.image || ""}
				  alt={`Slide no ${slide?.id}`}
				  width={1920}
				  height={1080}
				  priority
				  loading="eager"
				  className="w-full h-full object-cover rounded-2xl"
				/>
			  </div>
			</CarouselItem>
		  ))}
		</CarouselContent>
  
		{/* Navigation Buttons */}
		<CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-[#fabf2c] rounded-full w-10 h-10 text-gray-700 hover:bg-[#fabf2a] opacity-80" />
		<CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-[#fabf2c] rounded-full w-10 h-10 text-gray-700 hover:bg-[#fabf2a] opacity-80" />
	  </CarouselContainer>


	);
}

export default HeroBanner;
