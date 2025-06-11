import { cn } from "@/lib/utils";
import React from "react";

const LoadingSpinner = ({
  containerClassName,
  className,
}: {
  containerClassName?: string;
  className?: string;
}) => {
  return (
    <div className={cn("flex justify-center items-center", containerClassName)}>
      <div
        className={cn(
          "animate-spin rounded-full border-4 border-transparent border-solid border-opacity-75 h-12 w-12 border-t-primaryOrange",
          className
        )}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
