"use client";

import QuantityCounter from "@/components/cart/QuantityCounter";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import useCart from "@/hooks/useCart";
import { cn, formatPrice, textShortner } from "@/lib/utils";
import { CartState, MenuProduct } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import LikeButton from "./LikeButton";
import DescriptionModal from "./modals/DescriptionModal";
import { Button } from "./ui/button";
import useProductDescription from "@/hooks/useProductDescription";

function ProductCard({
  product,
  className,
}: {
  product: MenuProduct;
  className?: string;
}) {
  const { addItemToCart } = useCart();
  const { item } = useProductDescription(product);

  return (
    <Card
      className={cn(
        "w-40 min-[500px]:w-52 min-h-[400px]  rounded-2xl transition-colors border-2 hover:border-[#fabf2c]",
        className
      )}
    >
      <Link href={`/product/${product.itemId}`}>
        <CardHeader title={product.itemName} className="relative p-2">
          <div className="flex items-center w-full justify-center">
            <Image
              src={product.itemImage}
              width={100}
              height={100}
              alt="product-image"
              className="rounded-2xl object-contain w-full h-auto"
            />
          </div>
          <LikeButton />
        </CardHeader>
        <CardContent
          title={product.itemDescription ?? ""}
          className="flex flex-col items-center justify-center py-3 min-h-[88px]"
        >
          <h4 className="font-bold text-md text-center">{product.itemName}</h4>
          {product.itemDescription ? (
            <p className="text-sm font-normal text-gray-500 text-center">
              {textShortner(product.itemDescription, 40)}
            </p>
          ) : null}
        </CardContent>
      </Link>
      <hr className="bg-categorySeparatorGradient w-[95%] mx-auto h-px my-1 block" />
      <CardFooter
        title="Add to cart"
        className="flex flex-col items-center justify-center gap-1 pt-5 pb-3"
      >
        <p className="text-md- text-center font-bold">
          {formatPrice(product.price)}
        </p>
        {/*
        If the item is not in cart, check whether it has add-ons or not, If it has add-ons, then display a DescriptionModal, else display a button to add to cart. And Finally display counter for quantity if the item is in cart
        */}
        {!item.isItemInCart ? (
          product.addOns ? (
            <DescriptionModal product={product} />
          ) : (
            <Button
              variant="outline"
              onClick={() => addItemToCart({ ...product, quantity: 1 })}
              className={
                "p-4 font-bold text-black bg-[#fabf2c] rounded-3xl !hover:border-[#fabf2c]"
              }
            >
              Add to Cart
            </Button>
          )
        ) : (
          <QuantityCounter
            itemId={product.itemId}
            quantity={item.itemInCart!.quantity ?? 0}
            className="bg-accent rounded-2xl p-2 max-h-10"
          />
        )}
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
