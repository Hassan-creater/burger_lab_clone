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
  itemId: number;
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
      setStateQuantity && setStateQuantity(itemToUpdate.quantity ?? 1);
    }
  }, [items, itemId, setStateQuantity]);

  const handleQuantityChange = (options: "DECREASE" | "INCREASE") => {
    if (options === "INCREASE") {
      if (!stateQuantity) {
        updateQuantity(itemId, quantity + 1);
      } else {
        setStateQuantity && setStateQuantity((stateQuant) => stateQuant + 1);
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
        setStateQuantity && setStateQuantity((stateQuant) => stateQuant - 1);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    stateQuantity &&
      setStateQuantity!(() => {
        if (Number.isNaN(parseInt(e.target.value))) return 1;

        if (parseInt(e.target.value) > 999) return 999;

        return parseInt(e.target.value);
      });
  };

  return (
    <div className={cn("flex flex-1 gap-2 items-center h-full", className)}>
      <Button
        variant="ghost"
        onClick={() => handleQuantityChange("DECREASE")}
        title="remove"
        disabled={stateQuantity && stateQuantity === 1 ? true : false}
        className={cn(
          "p-2 w-7 h-7 bg-[#fabf2c] transition-colors rounded-full text-xl text-black hover:ring-2 hover:ring-[#fabf2c]",
          buttonClassName
        )}
      >
        -
      </Button>
      <Input
        type="number"
        id="quantity"
        value={!stateQuantity ? quantity : stateQuantity}
        min={1}
        max={999}
        onChange={handleInputChange}
        className="w-12 h-auto text-center p-1 focus-visible:ring-0 focus-visible:ring-[#fabf2c]  focus-visible:ring-offset-0"
      />
      <Button
        variant="ghost"
        onClick={() => handleQuantityChange("INCREASE")}
        title="add"
        disabled={stateQuantity && stateQuantity >= 999 ? true : false}
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
