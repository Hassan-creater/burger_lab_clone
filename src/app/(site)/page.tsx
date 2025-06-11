import CategoryLinkMenu from "./components/CategoryLinkMenu";
import CategorySection from "./components/CategorySection";
import HeroBanner from "@/components/HeroBanner";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import {
  getAllCategories,
  getAllFavorites,
  getAllSlides,
  getUser,
} from "@/functions";
import ServiceError from "@/components/ServiceError";
import SearchBox from "./components/SearchBox";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Home(
  props: {
    searchParams: Promise<{ query?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const queryClient = new QueryClient();
  const cookieStore = await cookies();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/get-user`,
    {
      credentials: "include",
      headers: {
        cookie: cookieStore.toString(),
      },
    }
  );
  const resData = await res.json();

  const categoriesPromise = getAllCategories();
  const favoritesPromise = getAllFavorites(resData?.user?.userId);

  const [{ categories }, { favorites }] = await Promise.all([
    categoriesPromise,
    favoritesPromise,
  ]);

  if (!categories) {
    return <ServiceError />;
  }

  return (
    <main className="w-full mt-[30px] min-h-[calc(100dvh - 80px)] flex flex-col justify-center items-center">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HeroBanner />

        <CategoryLinkMenu categories={categories} />

        <SearchBox />

        {categories.map((category, index) => (
          <CategorySection
            key={index}
            name={category.title}
            href={`#${category.title}`}
            id={category.id}
            query={searchParams.query === "" ? undefined : searchParams.query}
            favorites={favorites}
          />
        ))}
      </HydrationBoundary>
    </main>
  );
}
