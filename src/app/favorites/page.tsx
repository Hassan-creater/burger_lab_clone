import { Button } from "@/components/ui/button";
import { getAllFavorites, getItemById } from "@/functions";
import Link from "next/link";
import FavoriteItemContainer from "./components/FavoriteItemContainer";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Metadata } from "next";
import ServiceError from "@/components/ServiceError";

type FavoritesProps = {};

export const metadata: Metadata = {
  title: "Favorites - Burger Lab",
};

export const dynamic = "force-dynamic";

export default async function Favorites({}: FavoritesProps) {
  //TODO Temporary
  const userId = 80;
  const data = await getAllFavorites(userId);
  return (
    <main className="w-[90%] lg:max-w-[70%] mx-auto my-5 min-h-screen flex flex-col">
      <h1 className="text-lg font-bold mt-10 mb-7 text-gray-700">
        My Favorite Items
      </h1>
      {data.favorites && data.favorites.length > 0 ? (
        <section className="flex flex-wrap gap-4">
          {data.favorites.map((favorite) => (
            <Suspense
              key={favorite.id}
              fallback={
                <LoadingSpinner className="w-40 min-[500px]:w-52 min-h-[430px] max-h-[430px]" />
              }
            >
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
