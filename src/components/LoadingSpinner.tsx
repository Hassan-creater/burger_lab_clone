import { cn } from "@/lib/utils";
import React from "react";

const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex justify-center items-center", className)}>
      <div className="animate-spin rounded-full border-4 border-transparent border-solid border-opacity-75 h-12 w-12 border-t-[#fabf2c]"></div>
    </div>
  );
};

export default LoadingSpinner;
