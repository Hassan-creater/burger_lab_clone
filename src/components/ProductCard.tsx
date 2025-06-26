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
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";



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


  
  // const favorite = async ()=>{
  //   const res = await apiClient.get(`/favorite/user/${user?.id}`)
  //   return res.data;
  // }

  // const {data } = useQuery({
  //   queryKey : ["favorite"],
  //   queryFn : favorite,
  //   enabled : !!user?.id,
  // })




  // const cartItem = removePropFromObject<CartItem>(cartItemKeys, product);
  
  

  return (
    <Card
    className={cn(
      'w-full max-w-[29em] min-h-[12em] rounded-2xl transition-all border-2 border-gray-200 hover:border-orange-400 flex flex-row overflow-hidden shadow-lg hover:shadow-xl',
      className
    )}
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
          <CardHeader className="relative w-[50%] p-[0.5em] overflow-hidden">
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
          <CardContent className="flex flex-col justify-between p-4 w-2/3">
            <div>
              <h4 className="font-bold text-orange-500 text-[1.4em] mb-1">{textShortener(product.name, 16)}</h4>
              {product.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {textShortener(product.description, 100)}
                </p>
              )}
              {/* {product.rating && (
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 ${
                        i < product.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">
                    ({product.reviewCount})
                  </span>
                </div>
              )} */}
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
                <p className="text-lg bg-black py-[0.1em] px-[0.5em] rounded-lg  font-bold text-white">
                  {formatPrice(product.variants[0]?.price)}
                </p>
              )}
              <div className="flex gap-2">
                <div className="text-white bg-orange-400 py-[0.8em] px-[1em] rounded-lg  font-medium text-sm flex items-center group cursor-pointer">
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
