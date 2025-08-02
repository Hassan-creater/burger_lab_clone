import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import ProductDescription from "../components/ProductDescription";
import { Metadata } from "next";
import RelatedProducts from "../components/RelatedProducts";
import { notFound } from "next/navigation";
import { Item } from "@/models/Item";
import LoadingSpinner from "@/components/LoadingSpinner";
import ServiceError from "@/components/ServiceError";
import { getAllFavorites, getUser } from "@/functions";
import { getServerCookie } from "@/app/(site)/page";
import { redirect } from "next/navigation";
import { designVar } from "@/designVar/desighVar";


export async function generateMetadata(
  props: {
    params: Promise<{ productId?: number }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const token = await getServerCookie("accessToken");
  if(!token){
    redirect("/");
  }

  const {
    productId
  } = params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/item/get/${productId}`
    );
    response;
    const product: Item = await response.json();

    return {
      title: `${product ? product.name : "Product Not Found"} - Burger Lab`,
    };
  } catch (error) {
    return {
      title: "Burger Lab | Online Ordering",
    };
  }
}

interface ProductPageProps {
  params: Promise<{ productId?: number }>;
}

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params;

  const {
    productId
  } = params;

  //TODO Temporary

  const { user } = await getUser();

  if (!productId) {
    return notFound();
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/item/get/${productId}`,
      {
        cache: "no-store",
      }
    );
    const product: Item | null = await response.json();

    if (!product) {
      return notFound();
    }

    const { favorites } = await getAllFavorites(user?.userId!);

    return (
      <main className="mt-5 mb-10 flex flex-col items-center w-full h-auto gap-5">
        <section className="w-[90%] mx-auto p-4 pt-2 bg-white rounded-lg shadow-md">
          <div className="flex item-center gap-1 w-full h-auto">
            <Link
              className={`text-xs font-normal text-gray-500 hover:underline ${designVar.fontFamily}`}
              href="/"
            >
              Home
            </Link>
            <ChevronRight className="text-gray-500" size={15} />
            <p className={`text-xs font-normal text-[#fabf2c] ${designVar.fontFamily}`}>{product.name}</p>
          </div>
          <ProductDescription product={product} />
        </section>
        <div className="w-[90%] mx-auto relative min-h-12">
          <hr className="bg-categorySeparatorGradient absolute inset-0 w-[30%] min-[400px]:w-[34%] md:w-[37%] my-auto h-px block" />
          <h3 className={`text-sm sm:text-lg lg:text-xl font-bold absolute inset-0 w-1/2 mx-auto flex items-center justify-center ${designVar.fontFamily}`}>{`More in ${product.categoryName}`}</h3>
          <hr className="bg-categorySeparatorGradient absolute inset-0 w-[30%] min-[400px]:w-[34%] md:w-[37%] my-auto ml-auto h-px block" />
        </div>
        <section className="w-[90%] mx-auto p-4 pt-2 bg-white rounded-lg shadow-md">
          <Suspense
            fallback={<LoadingSpinner className="w-full min-h-[500px]" />}
          >
            <RelatedProducts
              categoryId={product.categoryId}
              productId={product.id}
              favorites={favorites}
            />
          </Suspense>
        </section>
      </main>
    );
  } catch (error) {
    return <ServiceError />;
  }
}
