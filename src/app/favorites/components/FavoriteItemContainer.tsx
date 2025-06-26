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
    
    <div className="w-[30em]  h-auto  flex flex-wrap ">
      {data && (
        <ProductCard product={data.item} favorites={favorites} status={data.favoriteStatus} />
      )}
    </div>
  );
}
