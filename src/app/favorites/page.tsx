import { Button } from "@/components/ui/button";
import Link from "next/link";
import FavoriteItemContainer from "./components/FavoriteItemContainer";
import { Suspense } from "react";
import { Metadata } from "next";
import ServiceError from "@/components/ServiceError";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";
import { dummyFavorites } from "@/lib/dummyData";

type FavoritesProps = {};

export const metadata: Metadata = {
  title: "Favorites - Burger Lab",
};

export const dynamic = "force-dynamic";

export default async function Favorites({}: FavoritesProps) {
  // Using dummy data instead
  const data = {
    status: 200,
    favorites: dummyFavorites,
  };

  return (
    <main className="w-[90%] lg:max-w-[70%] mx-auto my-5 min-h-screen flex flex-col">
      <h1 className="text-lg font-bold mt-10 mb-7 text-gray-700">
        My Favorite Items
      </h1>
      {data.favorites && data.favorites.length > 0 ? (
        <section className="flex flex-wrap gap-4">
          {data.favorites.map((favorite) => (
            <Suspense key={favorite.id} fallback={<ProductCardSkeleton />}>
              <FavoriteItemContainer
                itemId={favorite.itemid}
                favorites={data.favorites}
              />
            </Suspense>
          ))}
        </section>
      ) : data.status === 500 ? (
        <ServiceError />
      ) : (
        <div className="w-full min-h-full flex flex-col gap-3 items-center justify-center">
          <p className="text-lg font-bold">No Favorite Items</p>
          <Link href="/">
            <Button className="w-[40%] min-w-[250px] mx-auto px-5 py-2 bg-primaryOrange text-black hover:bg-primaryOrange/80 text-lg">
              View All Items
            </Button>
          </Link>
        </div>
      )}
    </main>
  );
}
