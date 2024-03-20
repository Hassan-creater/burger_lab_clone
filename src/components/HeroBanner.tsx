"use client";

import { useEffect, useRef } from "react";
import {
  Carousel as CarouselContainer,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
// import { bannerImages } from "@/lib/constants";
import Image from "next/image";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useObserverStore } from "@/store";
import { BASE_URL_IMAGES } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { getAllSlides } from "@/functions";

function HeroBanner() {
  const { data, status } = useQuery({
    queryKey: ["slides"],
    queryFn: getAllSlides,
    refetchOnWindowFocus: false,
  });
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const isVisible = useIntersectionObserver(carouselRef, { threshold: 0.6 });

  const { setIsBannerVisible } = useObserverStore();

  useEffect(() => {
    if (isVisible) setIsBannerVisible(true);
    else setIsBannerVisible(false);
  }, [setIsBannerVisible, isVisible]);
  return (
    <CarouselContainer
      className="w-full lg:max-w-[88%]"
      opts={{ loop: true }}
      autoplay={true}
      ref={carouselRef}
    >
      <CarouselContent>
        {data?.slides &&
          data.slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="p-1 flex items-center justify-center">
                <div className="flex w-full ml-5 mr-5 lg:ml-10 lg:mr-10 h-auto aspect-video md:aspect-auto bg-white items-center justify-center rounded-2xl">
                  <Image
                    src={`${BASE_URL_IMAGES}/${slide.image}`}
                    alt={`Slide no ${slide.id}`}
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
