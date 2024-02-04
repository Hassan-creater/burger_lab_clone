import React from "react";
import ProductCard from "./ProductCard";
import { menuItems } from "@/lib/constants";

interface CategorySectionProps {
	name: string;
	href: string;
}

function CategorySection({ name, href }: CategorySectionProps) {
	return (
		<section
			id={href.slice(1)}
			className="flex flex-col gap-4 h-full w-[95%] lg:max-w-[85%]">
			<hr className="self-center bg-categorySeparatorGradient w-full h-px mt-5 mb-3 block" />
			<h3 className="text-2xl font-bold">{name}</h3>
			<div className="flex flex-wrap items-center justify-start gap-5">
				{menuItems.map((menuItem, index) => (
					<ProductCard key={index} product={menuItem} />
				))}
			</div>
		</section>
	);
}

export default CategorySection;
