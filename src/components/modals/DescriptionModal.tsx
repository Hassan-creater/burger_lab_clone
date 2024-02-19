import { DialogTrigger } from "@radix-ui/react-dialog";
import { Dialog, DialogClose, DialogContent, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { AddOn } from "@/types";
import Image from "next/image";
import { XIcon } from "lucide-react";
import QuantityCounter from "../cart/QuantityCounter";
import { formatPrice } from "@/lib/utils";
import AdditionalInfo from "@/app/product/components/AdditionalInfo";
import useProductDescription from "@/hooks/useProductDescription";
import useCart from "@/hooks/useCart";
import { Item } from "@/models/Item";
import { BASE_URL_IMAGES } from "@/lib/constants";

type DescriptionModalProps = {
  product: Item;
};

export default function DescriptionModal({ product }: DescriptionModalProps) {
  const {
    extraOptions,
    setExtraOptions,
    quantityToAdd,
    setQuantityToAdd,
    item,
    totalPrice,
  } = useProductDescription(product);

  const { handleAddToCart } = useCart();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={
            "p-4 font-bold text-black bg-[#fabf2c] rounded-3xl !hover:border-[#fabf2c]"
          }
        >
          Add to Cart
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-[50%] lg:w-[80%] max-w-full min-h-[80%] h-max lg:h-auto flex flex-col lg:flex-row p-0 gap-0 rounded-3xl border-0 sm:rounded-3xl descriptionModal">
        <div className="flex-1 w-full flex items-center relative">
          <Image
            src={`${BASE_URL_IMAGES}/${product.image}`}
            alt={product.name}
            width={500}
            height={500}
            className="object-cover w-full lg:h-full rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none"
          />
          <div className="absolute bottom-4 left-4 text-white flex flex-col gap-3 w-[85%] mx-auto">
            <h3 className="text-4xl font-extrabold">{product.name}</h3>
            <p>{product.description ?? ""}</p>
          </div>
        </div>
        <div className="flex-1 relative">
          <form
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
              <div
                className="p-3 overflow-y-scroll no-scrollbar"
                style={{ height: "calc(100% - 4.5rem)" }}
              >
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
            <DialogFooter className="px-2 py-3 h-[4.5rem] border-t-[1px] border-t-black/20 flex items-center justify-end w-1/2 shadow-xl lg:rounded-br-3xl shadow-black fixed bottom-0">
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
            </DialogFooter>
          </form>
          <QuantityCounter
            quantity={item.itemInCart ? item.itemInCart.quantity ?? 0 : 0}
            itemId={product.id}
            className="flex w-full sm:w-max sm:h-max item-center justify-between sm:justify-start sm:absolute sm:bottom-4 sm:left-2"
            buttonClassName="w-10 h-10 text-2xl"
            stateQuantity={quantityToAdd}
            setStateQuantity={setQuantityToAdd}
          />
        </div>
        <DialogClose className="bg-black/80 p-1 rounded-xl text-white right-2 top-2 sm:right-2 sm:top-2">
          <XIcon className="w-6 h-6" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
