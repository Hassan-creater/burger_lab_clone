import ProductCard from "@/components/ProductCard";
import { Favorite } from "@/models/Favorites";
import { dummyItems } from "@/lib/dummyData";

type FavoriteItemContainerProps = {
  itemId: number;
  favorites: Favorite[];
};

export default async function FavoriteItemContainer({
  itemId,
  favorites,
}: FavoriteItemContainerProps) {
  // Using dummy data instead
  const response = {
    status: 200,
    item: dummyItems.find((item) => item.id === itemId),
  };

  return (
    <div className="w-auto h-auto flex flex-wrap items-center justify-center">
      {response.item && (
        <ProductCard product={response.item} favorites={favorites} />
      )}
    </div>
  );
}
