import CategoryLinkMenu from "./components/CategoryLinkMenu";
import CategorySection from "./components/CategorySection";
import HeroBanner from "@/components/HeroBanner";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getAllCategories, getAllFavorites, getAllSlides } from "@/functions";
import ServiceError from "@/components/ServiceError";
import SearchBox from "./components/SearchBox";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  //TODO Temporary
  const userId = 80;
  const queryClient = new QueryClient();

  const categoriesPromise = getAllCategories();
  const favoritesPromise = getAllFavorites(userId);

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
