import CategoryLinkMenu from "../components/CategoryLinkMenu";
import CategorySection from "../components/CategorySection";
import { categories } from "@/lib/constants";
import HeroBanner from "@/components/HeroBanner";

export default function Home() {

	return (
		<main className="w-full mt-[30px] h-[calc(100dvh - 80px)] scroll-smooth flex flex-col justify-center items-center">
			<HeroBanner />

			<CategoryLinkMenu />

			{categories.map((category, index) => (
				<CategorySection
					key={index}
					name={category.name}
					href={category.href}
				/>
			))}
		</main>
	);
}
