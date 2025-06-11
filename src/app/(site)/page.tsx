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

export const dynamic = "force-dynamic";

export default async function Home(
  props: {
    searchParams: Promise<{ query?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const queryClient = new QueryClient();

  // Using dummy data instead
  const categories = dummyCategories;
  const favorites = dummyFavorites;

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
