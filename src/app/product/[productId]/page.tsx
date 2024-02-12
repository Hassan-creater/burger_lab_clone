import { menuItems } from "@/lib/constants";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import ProductDescription from "../components/ProductDescription";
import { Metadata } from "next";
import { MenuProduct } from "@/types";
import RelatedProducts from "../components/RelatedProducts";
import notFound from "@/app/not-found";

export async function generateMetadata({
  params: { productId },
}: {
  params: { productId?: string };
}): Promise<Metadata> {
  const product = menuItems.filter((item) => item.itemId === productId)[0];

  return {
    title: `${product ? product.itemName : "Product Not Found"} - Burger Lab`,
  };
}

interface ProductPageProps {
  params: { productId?: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = menuItems.filter(
    (item) => item.itemId === params.productId
  )[0];

  if (!product) {
    return notFound();
  }

  const otherProducts: MenuProduct[] = menuItems.filter(
    (item) =>
      item.itemId !== params.productId && item.category === product.category
  );

  return (
    <main className="mt-5 mb-10 flex flex-col items-center w-full h-auto gap-5">
      <section className="w-[90%] mx-auto p-4 pt-2 bg-white rounded-lg shadow-md">
        <div className="flex item-center gap-1 w-full h-auto">
          <Link
            className="text-xs font-normal text-gray-500 hover:underline"
            href="/"
          >
            Home
          </Link>
          <ChevronRight className="text-gray-500" size={15} />
          <p className="text-xs font-normal text-[#fabf2c]">
            {product.itemName}
          </p>
        </div>
        <ProductDescription product={product} />
      </section>
      <div className="w-[90%] mx-auto relative min-h-12">
        <hr className="bg-categorySeparatorGradient absolute inset-0 w-[30%] min-[400px]:w-[34%] md:w-[37%] my-auto h-px block" />
        <h3 className="text-sm sm:text-lg lg:text-xl font-bold absolute inset-0 w-1/2 mx-auto flex items-center justify-center">{`More in ${product.category}`}</h3>
        <hr className="bg-categorySeparatorGradient absolute inset-0 w-[30%] min-[400px]:w-[34%] md:w-[37%] my-auto ml-auto h-px block" />
      </div>
      <section className="w-[90%] mx-auto p-4 pt-2 bg-white rounded-lg shadow-md">
        <RelatedProducts products={otherProducts} />
      </section>
    </main>
  );
}
