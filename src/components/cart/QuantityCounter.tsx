"use client";

import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import useCart from "@/hooks/useCart";
import { cn } from "@/lib/utils";

// type StateQuantity = {
//   stateQuantity?: number;
//   setStateQuantity?: React.Dispatch<React.SetStateAction<number>>;
// };

interface QuantityCounterProps {
  quantity: number;
  itemId: string; // Fixed type
  className?: string;
  buttonClassName?: string;
  stateQuantity?: number;
  setStateQuantity?: React.Dispatch<React.SetStateAction<number>>;
}

function QuantityCounter({
  quantity,
  itemId,
  className,
  buttonClassName,
  stateQuantity,
  setStateQuantity,
}: QuantityCounterProps) {
  const { updateQuantity, removeItemFromCart, items } = useCart();

  useEffect(() => {
    const itemToUpdate = items.find((item) => item.id === itemId);

    if (itemToUpdate) {
      setStateQuantity?.(itemToUpdate.quantity ?? 1);
    }
  }, [items, itemId, setStateQuantity]);

  const handleQuantityChange = (options: "DECREASE" | "INCREASE") => {
    if (options === "INCREASE") {
      if (!stateQuantity) {
        updateQuantity(itemId, quantity + 1);
      } else {
        setStateQuantity?.((prev) => prev + 1);
      }
    }

    if (options === "DECREASE") {
      if (!stateQuantity) {
        if (quantity === 1) {
          removeItemFromCart(itemId);
        } else {
          updateQuantity(itemId, quantity - 1);
        }
      } else {
        setStateQuantity?.((prev) => {
          const newQuantity = prev - 1;
          if (newQuantity < 1) {
            removeItemFromCart(itemId);
            return 1;
          }
          return newQuantity;
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!setStateQuantity) return;
    
    const newValue = parseInt(e.target.value);
    
    if (isNaN(newValue)) {
      setStateQuantity(1);
      return;
    }
    
    const clampedValue = Math.min(Math.max(newValue, 1), 999);
    
    setStateQuantity(clampedValue);
    
    // Sync with cart if not using local state
    if (!stateQuantity) {
      updateQuantity(itemId, clampedValue);
    }
  };

  // Determine the display quantity
  const displayQuantity = stateQuantity !== undefined ? stateQuantity : quantity;

  return (
    <div className={cn("flex flex-1 gap-2 items-center h-full", className)}>
      <Button
        variant="ghost"
        onClick={() => handleQuantityChange("DECREASE")}
        title="remove"
        disabled={displayQuantity === 1}
        className={cn(
          "p-2 w-7 h-7 bg-[#fabf2c] transition-colors rounded-full text-xl text-black hover:ring-2 hover:ring-[#fabf2c]",
          buttonClassName
        )}
      >
        -
      </Button>
      
      <Input
        type="number"
        value={displayQuantity}
        min={1}
        max={999}
        onChange={handleInputChange}
        onBlur={() => {
          if (setStateQuantity && stateQuantity !== undefined) {
            updateQuantity(itemId, stateQuantity);
          }
        }}
        className="w-12 h-auto text-center p-1 focus-visible:ring-0 focus-visible:ring-[#fabf2c] focus-visible:ring-offset-0"
      />
      
      <Button
        variant="ghost"
        onClick={() => handleQuantityChange("INCREASE")}
        title="add"
        disabled={displayQuantity >= 999}
        className={cn(
          "p-2 w-7 h-7 bg-[#fabf2c] transition-colors rounded-full text-xl text-black hover:ring-2 hover:ring-[#fabf2c]",
          buttonClassName
        )}
      >
        +
      </Button>
    </div>
  );
}

export default QuantityCounter;