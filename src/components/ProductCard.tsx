"use client";

import {
  Card,
  CardContent,

  CardHeader,
} from "@/components/ui/card";

import {
  cn,
  formatPrice,
  textShortener,
} from "@/lib/utils";

import Image from "next/image";

import React, { useState } from "react";
import LikeButton from "./LikeButton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ChevronRightIcon,  XIcon } from "lucide-react";  
import { Favorite } from "@/models/Favorites";
import ProductDescription from "@/app/product/components/ProductDescription";
import { VisuallyHidden } from "./ui/visually-hidden";
import { useCartContext } from "@/context/context";
import { designVar } from "@/designVar/desighVar";


function ProductCard({
  product,
  className,
  favorites,
  status,

}: {
  product: any;
  className?: string;
  favorites: Favorite[] | null | undefined
  status?: string;
}) {
  // const { addItemToCart } = useCart();
  const [isFav, setIsFav] = useState(() => {
    return !!favorites?.some((favorite) => favorite.itemId === product.id);
  });


  const favId = favorites?.find((favorite) => favorite.itemId === product.id)?.id;

 
  const [open, setOpen] = useState(false);
  const {user} = useCartContext();

  

  return (
    <Card
    className={`flex justify-center items-center ${designVar.cardDesign.width} ${designVar.cardDesign.height} ${designVar.cardDesign.minHeight} ${designVar.cardDesign.duration} ${designVar.cardDesign.backgroundColor} ${designVar.cardDesign.borderRadius} ${designVar.cardDesign.paddingX} ${designVar.cardDesign.paddingY}  ${designVar.cardDesign.border} ${designVar.cardDesign.borderColor} ${designVar.cardDesign.hover.backgroundColor} ${designVar.cardDesign.hover.borderRadius} ${designVar.cardDesign.hover.borderColor} ${designVar.cardDesign.hover.shadow} ${designVar.cardDesign.hover.overflow} ${designVar.fontFamily}`}
  >
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div  onClick={() => {
        if (status === "ACTIVE") setOpen(true);
          }}  className={cn(
            "flex cursor-pointer group w-full",
            status == "INACTIVE" && "opacity-50 cursor-not-allowed pointer-events-none"
          )}>
          {/* Image Section */}
          <CardHeader className="relative w-[50%] p-[0.5em] overflow-hidden ">
            <div className=" h-full w-full overflow-hidden flex justify-center items-center border-[1px] rounded-lg border-orange-500">
              <Image
                src={product.image}
                width={300}
                height={300}
                priority
                alt="product-image"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {product.discountPercent > 0 && (
                <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {product.discountPercent}% OFF
                </div>
              )}
             
            </div>
          </CardHeader>
  
          {/* Content Section */}
          <CardContent className="flex flex-col justify-between group p-4 w-2/3">
            <div>
              <h4 className={`${designVar.carHeading.fontSize} ${designVar.carHeading.fontWeight} ${designVar.carHeading.colorOrange} ${designVar.fontFamily} mb-1`}>{textShortener(product.name, 16)}</h4>
              {product.description && (
                <p className={`${designVar.fontStyle.colorGray} ${designVar.fontStyle.fontSize}  line-clamp-2 mb-2 ${designVar.fontFamily}`}>
                  {textShortener(product.description, 100)}
                </p>
              )}
            </div>
  
            <div className="mt-3 relative flex flex-col items-start gap-2 justify-between">
              {
                user && (
                  <div onClick={(e)=>e.stopPropagation()} className="absolute bottom-[3em] right-0">
                  <LikeButton
                    itemId={product.id}
                    isFav={isFav}
                    id={favId}
                    favorites={favorites || []}
                    setIsFav={setIsFav}
                    className="bg-white/80 backdrop-blur-sm"
                  />
                </div>
                )
              }
            
              {product.discountPercent > 0 ? (
                <div>
                  <p className="text-lg font-bold text-orange-600">
                    {formatPrice(
                      product.variants[0]?.price *
                        (1 - product.discountPercent / 100)
                    )}
                  </p>
                  <p className="text-sm text-gray-500 line-through">
                    {formatPrice(product.variants[0]?.price)}
                  </p>
                </div>
              ) : (
                <p className={`${designVar.productPrice.backgroundColor} ${designVar.productPrice.borderRadius} ${designVar.productPrice.paddingX} ${designVar.productPrice.paddingY} ${designVar.productPrice.fontSize} ${designVar.productPrice.fontWeight} ${designVar.productPrice.color} ${designVar.fontFamily} ${designVar.productPrice.textSize} ${designVar.fontFamily}`}>
                  {formatPrice(product.variants[0]?.price)}
                </p>
              )}
              <div className="flex gap-2">
                <div className={` ${designVar.fontStyle.colorWhite} flex items-center gap-2 ${designVar.Button.backgroundColor} ${designVar.Button.paddingX} ${designVar.Button.paddingY} ${designVar.Button.borderRadius} ${designVar.Button.fontSize} ${designVar.Button.fontWeight} ${designVar.Button.color} ${designVar.Button.cursor} ${designVar.Button.transition} ${designVar.Button.hover.backgroundColor} ${designVar.Button.hover.borderColor} ${designVar.Button.hover.color} ${designVar.Button.hover.translateX} ${designVar.fontFamily}`}>
                  See Details
                  <ChevronRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
                {/* <Button> Add to Cart </Button> */}
              </div>
            </div>
          </CardContent>
        </div>
      </DialogTrigger>
  
      <DialogContent
        className="w-full max-w-5xl h-full max-h-[90vh] overflow-hidden 
                   flex flex-col sm:flex-row gap-0 rounded-3xl border-0 p-0 shadow-2xl"
      >
        <DialogHeader>
          <DialogTitle asChild>
            <VisuallyHidden>Product Details</VisuallyHidden>
          </DialogTitle>
        </DialogHeader>
        <ProductDescription product={product} setOpen={setOpen} />
        <DialogClose className="absolute bg-black/80 p-1.5 rounded-full text-white right-4 top-4 z-10">
          <XIcon className="w-5 h-5" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  </Card>
  
  );
}

export default ProductCard;
