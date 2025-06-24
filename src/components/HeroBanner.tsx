"use client";

import { useEffect, useRef } from "react";
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
	const isVisible = useIntersectionObserver(carouselRef as React.RefObject<HTMLElement>, { threshold: 0.6 });

	const { setIsBannerVisible } = useObserverStore();

	useEffect(() => {
		if (isVisible) setIsBannerVisible(true);
		else setIsBannerVisible(false);
	}, [setIsBannerVisible, isVisible]);

	return (
		<CarouselContainer
			className="w-full lg:max-w-[88%]  h-[25em] flex justify-center items-center"
			opts={{ loop: true }}
			autoplay={true}
			ref={carouselRef}>
			<CarouselContent>
				{slides &&
					slides?.map((slide:any) => (
						<CarouselItem className=" w-full h-full flex justify-center items-center overflow-hidden" key={slide.id}>
							<div className="p-1 flex items-center justify-center">
								<div className="flex w-full ml-5 mr-5 lg:ml-10 lg:mr-10 h-auto aspect-video md:aspect-auto bg-white items-center justify-center rounded-2xl">
									<Image
										src={slide?.image || ""}
										alt={`Slide no ${slide?.id}`}
										width={1000}
										height={1000}
										priority
										loading="eager"
										className="object-fill rounded-2xl w-full h-full"
									/>
								</div>
							</div>
						</CarouselItem>
					))}
			</CarouselContent>
			<CarouselPrevious className="hidden lg:inline-flex bg-[#fabf2c] !rounded-[36px] !w-14 !h-20 text-gray-700 hover:bg-[#fabf2a] disabled:opacity-20 opacity-70" />
			<CarouselNext className="hidden lg:inline-flex bg-[#fabf2c] !rounded-[36px] !w-14 !h-20 text-gray-700 hover:bg-[#fabf2a] disabled:opacity-20 opacity-70" />
		</CarouselContainer>
	);
}

export default HeroBanner;
