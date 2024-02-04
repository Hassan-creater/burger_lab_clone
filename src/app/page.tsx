import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import CategoryLinkMenu from "./components/CategoryLinkMenu";
import CategorySection from "./components/CategorySection";
import { categories } from "@/lib/constants";

const bannerImages = [
	{
		src: "/banner-1.webp",
		alt: "banner-1",
	},
	{
		src: "/banner-2.webp",
		alt: "banner-2",
	},
	{
		src: "/banner-3.webp",
		alt: "banner-3",
	},
];

export default function Home() {
	return (
		<section className="w-full mt-[30px] h-full scroll-smooth flex flex-col justify-center items-center">
			<Carousel className="w-full lg:max-w-[88%]" opts={{ loop: true }}>
				<CarouselContent>
					{bannerImages.map((image) => (
						<CarouselItem key={image.alt}>
							<div className="p-1 flex items-center justify-center">
								<div className="flex w-full ml-5 mr-5 lg:ml-10 lg:mr-10 h-auto aspect-video md:aspect-auto bg-white items-center justify-center rounded-2xl">
									<Image
										src={image.src}
										alt={image.alt}
										width={100}
										height={100}
										className="object-fill rounded-2xl w-full h-full"
									/>
								</div>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious className="hidden lg:inline-flex bg-[#fabf2c] !rounded-[36px] !w-14 !h-20 text-gray-700 hover:bg-[#fabf2a] disabled:opacity-20 opacity-70" />
				<CarouselNext className="hidden lg:inline-flex bg-[#fabf2c] !rounded-[36px] !w-14 !h-20 text-gray-700 hover:bg-[#fabf2a] disabled:opacity-20 opacity-70" />
			</Carousel>

			<CategoryLinkMenu />

			{categories.map((category, index) => (
				<CategorySection
					key={index}
					name={category.name}
					href={category.href}
				/>
			))}
		</section>
	);
}
