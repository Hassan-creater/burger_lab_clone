import { cn } from "@/lib/utils";
import React from "react";

function InputIndicator({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "bg-red-500 text-white px-3 text-sm py-1 rounded-full",
        className
      )}
    >
      {children}
    </p>
  );
}

export default InputIndicator;
