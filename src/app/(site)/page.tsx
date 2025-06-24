import CategoryLinkMenu from "./components/CategoryLinkMenu";
import CategorySection from "./components/CategorySection";
import HeroBanner from "@/components/HeroBanner";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import ServiceError from "@/components/ServiceError";
import SearchBox from "./components/SearchBox";
import { dummyCategories, dummyFavorites } from "@/lib/dummyData";
import { Category } from "@/models/Category";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";




export const getServerCookie = async (name: string): Promise<string | undefined> => {
  const cookieStore = await cookies(); // ✅ Await the Promise
  return cookieStore.get(name)?.value;
};

export const dynamic = "force-dynamic";


export async function getCategories(): Promise<Category[]> {
  
    // const token = await getServerCookie("accessToken")

  try {
    const res = await fetch(
      `${process.env.NEXT_BASE_URL}/category/view/customer`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
          
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch categories (${res.status})`);
    }

    // assuming response shape { data: { categories: Category[] } }
    const body = await res.json();
    return body.data.categories as Category[];
  } catch (err) {
    console.error("Categories fetch error:", err);
    // Fallback to dummy data
    return dummyCategories;
  }
}







export default async function Home(
  props: {
    searchParams: Promise<{ query?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const queryClient = new QueryClient();
  
  const token = await getServerCookie("accessToken")

  // if(!token){
  //   redirect("/");
  // }

  
  const data = await getCategories();
  


  const allItems = data.flatMap((category: any) =>
    category.items.map((item: any) => ({
      ...item,
      categoryId: category.id,
    }))
  );

  // Using dummy data instead
  const categories = data;
  const favorites = dummyFavorites;

  if (!categories) {
    return <ServiceError />;
  }

  return (
    <main className="w-full mt-[30px]  min-h-[calc(100dvh - 80px)] flex flex-col justify-center items-center">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HeroBanner />

        <CategoryLinkMenu categories={categories} />

        <SearchBox/>

        {categories.map((category : any, index : number) => (
          <CategorySection
            key={index}
            name={category.title}
            href={`#${category.title}`}
            id={category.id}
            query={searchParams.query === "" ? undefined : searchParams.query}
            favorites={favorites}
            allItems={allItems}
          />
        ))}
      </HydrationBoundary>
    </main>
  );
}
