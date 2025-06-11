import ProductCard from "@/components/ProductCard";
import { getItemById } from "@/functions";
import { Favorite } from "@/models/Favorites";

type FavoriteItemContainerProps = {
  itemId: number;
  favorites: Favorite[];
};

export default async function FavoriteItemContainer({
  itemId,
  favorites,
}: FavoriteItemContainerProps) {
  const response = await getItemById(itemId);
  return (
    <div className="w-auto h-auto flex flex-wrap items-center justify-center">
      {response.item && (
        <ProductCard product={response.item} favorites={favorites} />
      )}
    </div>
  );
}
