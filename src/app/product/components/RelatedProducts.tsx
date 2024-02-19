import ProductCard from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Item } from "@/models/Item";
import React from "react";

interface RelatedProductsProps {
  categoryId: number;
  productId: number;
}

async function RelatedProducts({
  categoryId,
  productId,
}: RelatedProductsProps) {
  const response = await fetch(
    `http://localhost:3001/item/getByCategory/${categoryId}`
  );
  const products: Item[] = await response.json();

  const filteredProducts = products.filter(
    (product) => product.id !== productId
  );
  return (
    <Carousel className="w-full" autoplay={false}>
      <CarouselContent>
        {filteredProducts && filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 min-h-full"
            >
              <ProductCard
                product={product}
                className="min-[500px]:w-full w-full h-full"
              />
            </CarouselItem>
          ))
        ) : (
          <CarouselItem className="basis-full min-h-[250px] h-full flex items-center justify-center w-full">
            <p className="text-2xl font-bold text-gray-700">
              No Related Products
            </p>
          </CarouselItem>
        )}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:inline-flex bg-[#fabf2c] !rounded-[36px] !w-14 !h-20 text-gray-700 hover:bg-[#fabf2a] disabled:hidden opacity-70" />
      <CarouselNext className="hidden lg:inline-flex bg-[#fabf2c] !rounded-[36px] !w-14 !h-20 text-gray-700 hover:bg-[#fabf2a] disabled:hidden opacity-70" />
    </Carousel>
  );
}

export default RelatedProducts;
