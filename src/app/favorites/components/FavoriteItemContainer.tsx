import ProductCard from "@/components/ProductCard";
import { Favorite } from "@/models/Favorites";
import { dummyItems } from "@/lib/dummyData";

type FavoriteItemContainerProps = {
  itemId: string;
  favorites: Favorite[];
};

export default async function FavoriteItemContainer({
  itemId,
  favorites,
}: FavoriteItemContainerProps) {
  // Using dummy data instead



const data = favorites.find((favorite : any) => favorite?.itemId === itemId)


// Get the actual item data from dummyItems


  return (
    
    <div className="w-full h-auto p-2">
      {data && (
        <div className="w-full">
          <ProductCard product={data.item} favorites={favorites} status={data.favoriteStatus} />
        </div>
      )}
    </div>
  );
}
