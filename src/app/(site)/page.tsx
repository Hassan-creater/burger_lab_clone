import CategoryLinkMenu from "../components/CategoryLinkMenu";
import CategorySection from "../components/CategorySection";
import HeroBanner from "@/components/HeroBanner";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getAllCategories, getAllSlides } from "@/functions";
import ServiceError from "@/components/ServiceError";

export default async function Home() {
  const queryClient = new QueryClient();

  const categoriesPromise = getAllCategories();

  const slidesPromise = getAllSlides();

  const [{ categories }, { slides }] = await Promise.all([
    categoriesPromise,
    slidesPromise,
  ]);

  if (!categories || !slides) {
    return <ServiceError />;
  }

  return (
    <main className="w-full mt-[30px] h-[calc(100dvh - 80px)] scroll-smooth flex flex-col justify-center items-center">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HeroBanner slides={slides} />

        <CategoryLinkMenu categories={categories} />

        {categories.map((category, index) => (
          <CategorySection
            key={index}
            name={category.title}
            href={`#${category.title}`}
            id={category.id}
          />
        ))}
      </HydrationBoundary>
    </main>
  );
}
