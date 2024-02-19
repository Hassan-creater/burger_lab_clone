"use client";

import LikeButton from "@/components/LikeButton";
import QuantityCounter from "@/components/cart/QuantityCounter";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { AddOn, MenuProduct } from "@/types";
import AdditionalInfo from "./AdditionalInfo";
import ImageModal from "@/components/modals/ImageModal";
import useProductDescription from "@/hooks/useProductDescription";
import { Item } from "@/models/Item";

interface ProductDescriptionProps {
  product: Item;
}

const ProductDescription = ({ product }: ProductDescriptionProps) => {
  const { handleAddToCart } = useCart();

  const {
    item,
    quantityToAdd,
    setQuantityToAdd,
    extraOptions,
    setExtraOptions,
    totalPrice,
  } = useProductDescription(product);

  return (
    <article className="flex flex-col min-[925px]:flex-row !h-full gap-5 mt-5 items-center min-[925px]:items-start justify-center">
      <div className="flex w-full min-[925px]:w-[40%] items-start justify-center cursor-zoom-in">
        <ImageModal imageSrc={product.image} imageAlt={product.name} />
      </div>
      <div className="flex flex-col gap-3 w-full min-[925px]:w-[60%] px-4  relative">
        <div className="flex w-full items-center justify-between">
          <h1 className="font-extrabold text-3xl">{product.name}</h1>
          <LikeButton className="static" />
        </div>
        {product.description ? (
          <div className="flex w-full flex-1">
            <p className="text-gray-500 text-lg">{product.description}</p>
          </div>
        ) : null}
        <form
          className="order-last"
          onSubmit={(e) =>
            handleAddToCart(
              e,
              item,
              quantityToAdd,
              product,
              totalPrice,
              extraOptions
            )
          }
        >
          {product.addOns ? (
            <div className="flex w-full flex-1 my-5">
              <AdditionalInfo
                extraOptions={extraOptions!}
                setExtraOptions={
                  setExtraOptions as React.Dispatch<
                    React.SetStateAction<AddOn[]>
                  >
                }
                productId={product.id}
              />
            </div>
          ) : null}
          <div className="flex w-full flex-col sm:flex-row gap-4 items-center justify-end">
            <Button
              variant="outline"
              type="submit"
              className={
                "px-4 py-3 flex items-center w-full sm:w-[60%] justify-between font-bold text-black bg-[#fabf2c] rounded-3xl !hover:border-[#fabf2c] hover:bg-[#fabf2c]"
              }
            >
              <p className="text-sm font-bold">{formatPrice(totalPrice)}</p>
              <p className="text-sm font-bold">Add to Cart</p>
            </Button>
          </div>
        </form>
        <QuantityCounter
          quantity={item.itemInCart ? item.itemInCart.quantity ?? 1 : 1}
          itemId={product.id}
          className="flex w-full sm:w-max sm:h-max item-center justify-between sm:justify-start sm:absolute sm:bottom-0 sm:left-2"
          buttonClassName="w-10 h-10 text-2xl"
          stateQuantity={quantityToAdd}
          setStateQuantity={setQuantityToAdd}
        />
      </div>
    </article>
  );
};

export default ProductDescription;
