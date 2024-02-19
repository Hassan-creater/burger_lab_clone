import type { AddOnOption, CartItem } from "@/types";
import React from "react";
import QuantityCounter from "./QuantityCounter";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { BASE_URL_IMAGES } from "@/lib/constants";

interface CartItemProps {
  cartItem: CartItem;
  removeItem: (itemId: number) => void;
}

function CartItem({ cartItem, removeItem }: CartItemProps) {
  const renderAddOns = (addOnOption: AddOnOption, index: number) => {
    if (!addOnOption.isChecked) return;

    return (
      <div className="flex flex-col" key={index}>
        <p className="text-sm font-medium">{addOnOption.label}</p>
        <p className="text-sm font-normal text-gray-500">
          {formatPrice(addOnOption.price ?? 0)}
        </p>
      </div>
    );
  };

  return (
    <>
      <hr className="self-center bg-categorySeparatorGradient w-full h-px my-3 block" />
      <article key={cartItem.id} className="flex w-full gap-2">
        <div className="flex items-start justify-center w-1/4">
          <Image
            // src={`${BASE_URL_IMAGES}/${cartItem.image}`}
            src={"/cards-img2.jpeg"}
            alt={cartItem.name}
            width={100}
            height={100}
            className="object-contain rounded-lg"
          />
        </div>
        <div className="w-3/4 flex flex-col gap-2">
          <div className="flex flex-col">
            <h5 className="text-lg font-bold self-start">{cartItem.name}</h5>
            {cartItem.description ? (
              <p className="text-gray-500 w-[70%] text-sm font-normal self-start">
                {cartItem.description}
              </p>
            ) : null}
            {cartItem.addOnOptions ? (
              <div className="flex flex-col mt-2 gap-1">
                <p className="text-lg font-bold">AddOns</p>
                {cartItem.addOnOptions.map((addOnOption, index) =>
                  renderAddOns(addOnOption, index)
                )}
              </div>
            ) : null}
            <p className="text-lg font-normal self-end">
              {formatPrice(cartItem.totalPerPriceWithAddOns)}
            </p>
          </div>
          <div className="flex justify-between items-center w-full h-full">
            {cartItem.quantity ? (
              <QuantityCounter
                quantity={cartItem.quantity}
                itemId={cartItem.id}
              />
            ) : null}
            <Button
              variant="outline"
              onClick={() => removeItem(cartItem.id)}
              className="flex items-center justify-center p-2 rounded-full"
            >
              <Trash2Icon className="w-5 h-auto" />
            </Button>
          </div>
        </div>
      </article>
    </>
  );
}

export default CartItem;
