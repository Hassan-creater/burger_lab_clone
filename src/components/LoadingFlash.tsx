"use client";

import { cn } from "@/lib/utils";
import React from "react";

type LoadingFlashProps = {
  containerClassName?: string;
  itemClassName?: string;
  noOfBoxes?: number;
};

const LoadingFlash = ({
  containerClassName,
  itemClassName,
  noOfBoxes = 4,
}: LoadingFlashProps) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevActiveIndex) => (prevActiveIndex + 1) % noOfBoxes);
    }, 1000);

    return () => clearInterval(interval);
  }, [noOfBoxes, activeIndex]);

  return (
    <div className="flex justify-between w-72 relative">
      {Array.from({ length: noOfBoxes }).map((_, index) => (
        <div
          className={cn(
            "w-16 h-2 rounded-lg bg-primaryBg relative overflow-hidden",
            containerClassName,
            index === activeIndex && "w-20 transition-all"
          )}
          key={index}
        >
          <div
            className={cn(
              `w-full h-full absolute`,
              itemClassName,
              activeIndex === index
                ? "animate-flash bg-orange-700"
                : "bg-transparent"
            )}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingFlash;
