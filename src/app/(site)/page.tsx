import CategoryLinkMenu from "./components/CategoryLinkMenu";
import CategorySection from "./components/CategorySection";
import HeroBanner from "@/components/HeroBanner";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import ServiceError from "@/components/ServiceError";

import { dummyCategories } from "@/lib/dummyData";
import { Category } from "@/models/Category";


import { cookies } from "next/headers";
import SearchBox from "./components/SearchBox";





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
    return [];
  }
}


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
      }
    );

    if (!res.ok) {
      return []
    }

    // assuming response shape { data: { categories: Category[] } }
    const body = await res.json();
    return body.data?.favorites as any[];
  } catch (err) {
    console.error("Favorites fetch error:", err);
    // Fallback to dummy data
    
  }
}  




export default async function Home(
  props: {
    searchParams: Promise<{ query?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const queryClient = new QueryClient();
  


  // if(!token){
  //   redirect("/");
  // }

  
  const data = await getCategories();
  


  const allItems = data?.flatMap((category: any) =>
    category?.items?.map((item: any) => ({
      ...item,
      categoryId: category.id,
    }))
  );

  // Using dummy data instead
  const token = await getServerCookie("accessToken");
  const cookieStore = await cookies();
  const userData = cookieStore.get("userData")?.value;
  const userDataJson = JSON.parse(userData || "{}");
  const userId = userDataJson.id;


  const categories = data;
  const favorites = await getFavorites({id: userId, token: token || ""});

  

  // Filter items based on search query
  const currentQuery = searchParams.query || "";
  let filteredCategories = categories;
  let hasSearchResults = true;

  if (currentQuery.trim()) {
    const query = currentQuery.toLowerCase().trim();
    
    // Filter items based on tags and name
    const filteredItems = allItems.filter((item: any) => {
      const nameMatch = item.name?.toLowerCase().includes(query);
      const tagsMatch = item.tags?.toLowerCase().includes(query);
      const individualTagsMatch = item.tags?.split(',').some((tag: string) => 
        tag.trim().toLowerCase().includes(query)
      );
      
      return nameMatch || tagsMatch || individualTagsMatch;
    });

    // Group filtered items by category
    filteredCategories = categories.map(category => ({
      ...category,
      items: category.items.filter((item: any) => 
        filteredItems.some((filteredItem: any) => filteredItem.id === item.id)
      )
    })).filter(category => category.items.length > 0);

    hasSearchResults = filteredCategories.length > 0;
  }

  if (!categories) {
    return <ServiceError />;
  }

  return (
    <main className="w-full mt-[30px]  min-h-[calc(100dvh - 80px)] flex flex-col justify-center items-center">

      {
        categories.length == 0 ? (
           <>  <main className="w-full min-h-[calc(100dvh-80px)] flex flex-col justify-center items-center text-center px-4">
           <h1 className="text-2xl font-semibold text-red-600">You are Offline</h1>
           <p className="text-gray-600 mt-2 max-w-md">
             Please check your internet connection. This page requires an active connection to load product data.
           </p>
         </main> </>
        ) : (
          <HydrationBoundary state={dehydrate(queryClient)}>
          <HeroBanner />
  
          <CategoryLinkMenu categories={categories} />
  
          <SearchBox/>
  
          {currentQuery.trim() && !hasSearchResults ? (
            // Show "no results" message when there's a search query but no results
            <div className="text-center py-12 w-full">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No items found for {currentQuery}
              </h3>
              <p className="text-gray-500">
                Try searching with different keywords or check the spelling
              </p>
            </div>
          ) : (
            // Show filtered categories or all categories
            filteredCategories?.map((category : any, index : number) => (
              <CategorySection
                key={index}
                name={category.title}
                href={`#${category.title}`}
                id={category.id}
                query={currentQuery || undefined}
                favorites={favorites || []}
                allItems={allItems}
              />
            ))
          )}
        </HydrationBoundary>
        )
      }
     
    </main>
  );
}
