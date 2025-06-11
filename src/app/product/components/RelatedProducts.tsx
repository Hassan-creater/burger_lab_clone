import ProductCard from "@/components/ProductCard";
import { Favorite } from "@/models/Favorites";
import { dummyItems } from "@/lib/dummyData";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

type RelatedProductsProps = {
  categoryId: number;
  productId: number;
  favorites: Favorite[];
};

export default async function RelatedProducts({
  categoryId,
  productId,
  favorites,
}: RelatedProductsProps) {
  /* Original data fetching code
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/item/getByCategory/${categoryId}`
  );
  const products: Item[] = await response.json();
  */

  // Using dummy data instead
  const filteredProducts = dummyItems.filter(
    (product) => product.category_id === categoryId && product.id !== productId
  );

  return (
    <Carousel className="w-full" autoplay={false}>
      <CarouselContent>
        {filteredProducts && filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-full max-w-52 min-[350px]:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 min-h-full"
            >
              <ProductCard
                product={product}
                favorites={favorites}
                className="min-[500px]:w-full w-full h-full"
              />
            </CarouselItem>
          ))
        ) : (
          <div>No related products found</div>
        )}
      </CarouselContent>
    </Carousel>
  );
}
