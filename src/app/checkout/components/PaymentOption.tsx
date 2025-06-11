import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

type PaymentOptionProps = {
  type: "COD";
  className?: string;
  disabled?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
};

export default function PaymentOption({
  type,
  className,
  variant = "outline",
  disabled = false,
}: PaymentOptionProps) {
  if (type === "COD")
    return (
      <Button
        variant={variant}
        disabled={disabled}
        className={cn(
          "flex gap-3 px-5 py-4 items-center h-auto w-full sm:w-max bg-white rounded-lg border-2 border-primaryOrange",
          className
        )}
      >
        <Image
          src="/icons/cash.png"
          alt="COD IMAGE"
          width={100}
          height={100}
          className="size-5"
        />
        <p className="text-sm font-light">Cash on Delivery</p>
      </Button>
    );

  return null;
}
