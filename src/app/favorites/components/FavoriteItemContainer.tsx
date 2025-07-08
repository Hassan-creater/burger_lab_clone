import ProductCard from "@/components/ProductCard";
import { Favorite } from "@/models/Favorites";
import DealCard from "@/components/DealCard";

// Type now expects a single favorite and the full favorites array for like logic
export default function FavoriteItemContainer({
  favorite,
  favorites,
}: {
  favorite: Favorite;
  favorites: Favorite[];
}) {
  return (
    <div className="w-full h-auto p-2">
      {favorite.itemId && favorite.item && (
        <div className="w-full">
          <ProductCard
            product={favorite.item}
            favorites={favorites}
            status={favorite.favoriteStatus}
          />
        </div>
      )}
      {favorite.dealId && favorite.deal && (
        <div className="w-full">
          <DealCard
            deal={favorite.deal}
            favorite={favorites}
            status={favorite.favoriteStatus}
          />
        </div>
      )}
    </div>
  );
}
