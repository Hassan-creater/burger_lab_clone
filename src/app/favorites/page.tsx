import { Button } from "@/components/ui/button";
import Link from "next/link";
// import FavoriteItemContainer from "./components/FavoriteItemContainer";
import { Suspense } from "react";
import { Metadata } from "next";
import ServiceError from "@/components/ServiceError";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";
import { dummyFavorites } from "@/lib/dummyData";
import { getServerCookie } from "../(site)/page";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { toast } from "sonner";
import FavoriteItemContainer from "./components/FavoriteItemContainer";
import NoFavorites from "@/components/ServiceError";

type FavoritesProps = {};

export const metadata: Metadata = {
  title: "Favorites - Burger Lab",
};

export const dynamic = "force-dynamic";


const getFavorites = async ({id, token} : {id : string, token : string}) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_BASE_URL}/favorite/user/${id}`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch categories (${res.status})`);
    }

    // assuming response shape { data: { categories: Category[] } }
    const body = await res.json();
    return body.data?.favorites as any[];
  } catch (err) {
    console.error("Categories fetch error:", err);
    // Fallback to dummy data
     toast.error("Failed to fetch favorites");
  }
}   

export default async function Favorites({}: FavoritesProps) {
   


  const cookieStore = await cookies();
  const userData = cookieStore.get("userData")?.value;
  const userDataJson = JSON.parse(userData || "{}");
  const userId = userDataJson.id;

  // Using dummy data instead

  const token = await getServerCookie("accessToken");

  const favorites = await getFavorites({id: userId, token: token || ""});

  

  

  if(!token){
    redirect("/");
  }

  return (
    <main className="w-[90%] lg:max-w-[80%] mx-auto my-5 min-h-screen flex flex-col">
      <h1 className="text-lg font-bold mt-10 mb-7 text-gray-700">
        My Favorite Items
      </h1>

      {favorites && favorites?.length > 0 ? (
        <section className="flex flex-wrap gap-4 w-full h-full ">
        
        {favorites?.map((favorite) => (
        <Suspense key={favorite.id} fallback={<ProductCardSkeleton />}>
          <FavoriteItemContainer
                 itemId={favorite?.itemId}
                 favorites={favorites}
               /> 
             </Suspense>
           ))}
         </section>
        
      ) : favorites?.length == 0 && (
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
