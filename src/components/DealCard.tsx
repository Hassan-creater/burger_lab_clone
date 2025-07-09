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
import { designVar } from "@/designVar/desighVar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "./ui/visually-hidden";
import ProductDescription from "@/app/product/components/ProductDescription";
import { XIcon } from "lucide-react";
import DealDescription from "@/app/product/components/DealDescription";
import LikeButton from "./LikeButton";

// Deal type for props
export type Deal = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  discountedPrice: number;
  tags?: string;
   
};

function DealCard({ deal, className , favorite , status }: { deal:  any; className?: string , favorite : any , status? : string }) {

  const [open , setOpen ] = useState(false);
  const [isFav, setIsFav] = useState(() => {
    return !!favorite?.some((favorite : any) => favorite.dealId === deal?.id);
  });

  const favId = favorite?.find((favorite : any) => favorite.dealId === deal?.id)?.id;

  
  const hasDiscount =
    deal?.discountedPrice !== null &&
    deal?.discountedPrice !== undefined &&
    deal?.discountedPrice < deal?.price;

  return (
    <Dialog  open={open}  onOpenChange={setOpen} >
      <div   onClick={() => {
        if (status === "ACTIVE") setOpen(true);
          }}  className={cn(
            "flex cursor-pointer group ",
            status == "INACTIVE" && "opacity-50 cursor-not-allowed pointer-events-none"
          )}   >

      <DialogTrigger asChild>
        <Card
          className={cn(
            "flex justify-center items-center",
            designVar.cardDesign.width,
            designVar.cardDesign.height,
            designVar.cardDesign.minHeight,
            designVar.cardDesign.duration,
            designVar.cardDesign.backgroundColor,
            designVar.cardDesign.borderRadius,
            designVar.cardDesign.paddingX,
            designVar.cardDesign.paddingY,
            designVar.cardDesign.border,
            designVar.cardDesign.borderColor,
            designVar.cardDesign.hover.backgroundColor,
            designVar.cardDesign.hover.borderRadius,
            designVar.cardDesign.hover.borderColor,
            designVar.cardDesign.hover.shadow,
            designVar.cardDesign.hover.overflow,
            designVar.cardDesign.shadow,
            designVar.fontFamily,
            "overflow-hidden",
            className
          )}
        >
          {/* Image Section */}
          <CardHeader className="relative w-[50%] py-[0.5em] overflow-hidden flex justify-center items-center ">
            <div
              className={`${designVar.cardImage.width} ${designVar.cardImage.height} ${designVar.cardImage.borderRadius} ${designVar.cardImage.border} ${designVar.cardImage.borderColor} ${designVar.cardImage.overflow} ${designVar.cardImage.flex} `}
            >
              <Image
                src={deal?.image}
                width={300}
                height={300}
                priority
                alt={deal?.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.1]"
              />
              {hasDiscount && (
                <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {Math.round(100 - (deal?.discountedPrice / deal?.price) * 100)}% OFF
                </div>
              )}
            </div>
          </CardHeader>

          {/* Content Section */}
          <CardContent className="flex flex-col text-left justify-between h-[164px] group py-[0.6em] pb-[0.8em] w-2/3">
            <div className="w-full">
              <h4
                className={`${designVar.carHeading.fontSize} ${designVar.carHeading.fontWeight} ${designVar.fontFamily} ${designVar.carHeading.colorOrange} leading-[1.2em]`}
              >
                {textShortener(deal?.name, 45)}
              </h4>
              {deal?.description && (
                <p
                  className={`${designVar.fontStyle.colorGray} ${designVar.fontStyle.fontSize}  line-clamp-2 ${designVar.fontFamily} ${designVar.fontStyle.color}`}
                >
                  {textShortener(deal?.description, 100)}
                </p>
              )}
            </div>

            <div className="w-full relative flex flex-col items-start gap-2 justify-between">
            <div onClick={(e)=>e.stopPropagation()} className="absolute bottom-[2.8em] -right-[0.5em]">
                  <LikeButton
                    dealId={deal?.id}
                    isFav={isFav}
                    id={favId}
                    favorites={favorite || []}
                    setIsFav={setIsFav}
                    className="bg-white/80 backdrop-blur-sm"
                  />
                </div>
              {/* Price Section */}
              <div className="flex items-center gap-2">
                {hasDiscount ? (
                  <>
                    <span className={`${designVar.productPrice.backgroundColor} ${designVar.productPrice.borderRadius} ${designVar.productPrice.paddingX} ${designVar.productPrice.paddingY} ${designVar.productPrice.fontSize} ${designVar.productPrice.fontWeight} ${designVar.productPrice.color} ${designVar.fontFamily} ${designVar.productPrice.textSize} ${designVar.fontFamily} ${designVar.productPrice.width} ${designVar.productPrice.height} whitespace-nowrap  flex justify-center items-center `}>
                      {formatPrice(deal.discountedPrice)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(deal?.price)}
                    </span>
                  </>
                ) : (
                  <span
                    className={`${designVar.productPrice.backgroundColor} ${designVar.productPrice.borderRadius} ${designVar.productPrice.paddingX} ${designVar.productPrice.paddingY} ${designVar.productPrice.fontSize} ${designVar.productPrice.fontWeight} ${designVar.productPrice.color} ${designVar.fontFamily} ${designVar.productPrice.textSize} ${designVar.fontFamily} ${designVar.productPrice.width} ${designVar.productPrice.height} whitespace-nowrap  flex justify-center items-center `}
                  >
                    {formatPrice(deal?.price)}
                  </span>
                )}
              </div>
              
              {/* Details Button */}
              <div
                className={` ${designVar.fontStyle.colorWhite} flex items-center gap-2 ${designVar.Button.backgroundColor} ${designVar.Button.paddingX} ${designVar.Button.paddingY} ${designVar.Button.borderRadius} ${designVar.Button.fontSize} ${designVar.Button.fontWeight} ${designVar.Button.color} ${designVar.Button.cursor} ${designVar.Button.transition} ${designVar.Button.hover.backgroundColor} ${designVar.Button.hover.borderColor} ${designVar.Button.hover.color} ${designVar.Button.hover.translateX} ${designVar.fontFamily} ${designVar.Button.width} ${designVar.Button.height} whitespace-nowrap  flex justify-center items-center `}
              >
                See Details
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      </div>
      <DialogContent
        className="w-[90%] sm:w-[37em]  descriptionModal overflow-x-hidden h-full max-h-[90vh] overflow-hidden 
                   flex flex-col sm:flex-row gap-0 rounded-3xl border-0 p-0 shadow-2xl"
      >
        <DialogHeader>
          <DialogTitle asChild>
            <VisuallyHidden>Product Details</VisuallyHidden>
          </DialogTitle>
        </DialogHeader>
        <DealDescription deal={deal} setOpen={setOpen}/>
        <DialogClose className="absolute bg-black/80 p-1.5 rounded-full text-white right-4 top-4 z-10">
          <XIcon className="w-5 h-5" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default DealCard;
