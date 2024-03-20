import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";
import InputIndicator from "./InputIndicator";
import { cn, formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { AddOn } from "@/types";
import useCart from "@/hooks/useCart";

type AdditionalInfoProps = {
  extraOptions: AddOn[];
  setExtraOptions: React.Dispatch<React.SetStateAction<AddOn[]>>;
  productId: number;
};

function AdditionalInfo({
  extraOptions,
  setExtraOptions,
  productId,
}: AdditionalInfoProps) {
  const { items } = useCart();

  useEffect(() => {
    const itemInCartAddOns = items.find(
      (item) => item.id === productId
    )?.addOnOptions;

    if (itemInCartAddOns) {
      setExtraOptions((prev) =>
        prev.map((addOn) => {
          if (addOn.addOnOptions) {
            addOn.addOnOptions = addOn.addOnOptions.map((option) => {
              const matchingCartItem = itemInCartAddOns.find(
                (cartItem) => cartItem.label === option.label
              );

              if (matchingCartItem) {
                return { ...option, isChecked: matchingCartItem.isChecked };
              }

              return option;
            });
          }
          return addOn;
        })
      );
    }
  }, [items, productId, setExtraOptions]);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtraOptions((prev) => {
      return prev.map((addOn) => {
        if (
          addOn.addOnOptions &&
          addOn.addOnOptions.some((option) => option.label === e.target?.id)
        ) {
          const updatedOptions = addOn.addOnOptions.map((option) => ({
            ...option,
            isChecked: option.label === e.target?.id,
          }));

          return {
            ...addOn,
            addOnOptions: [...updatedOptions],
          };
        }
        return addOn;
      });
    });
  };

  const renderInputIndicators = (addOn: AddOn) => {
    const labelsToRender: React.JSX.Element[] = [];

    if (addOn.required) {
      const checkedOption =
        addOn.addOnOptions &&
        addOn.addOnOptions.some((option) => option.isChecked === true);

      if (checkedOption) {
        const inputIndicator = (
          <InputIndicator className="bg-green-500">Selected</InputIndicator>
        );
        labelsToRender.push(inputIndicator);
      } else {
        labelsToRender.push(
          <InputIndicator className="bg-red-500">Required</InputIndicator>
        );
      }
    }
    const enumeratedLabels =
      addOn.labels &&
      addOn.labels.map((label, index) => (
        <InputIndicator key={index} className="bg-yellow-500">
          {label}
        </InputIndicator>
      ));

    if (enumeratedLabels) {
      labelsToRender.push(...enumeratedLabels);
    }

    return labelsToRender;
  };

  return (
    <Accordion type="single" collapsible className="w-full flex flex-col gap-3">
      {extraOptions.map((addOn, index) => (
        <AccordionItem key={index} value={addOn.heading} className="border-0">
          <AccordionTrigger className="w-full flex gap-2 items-center rounded-sm min-[370px]:rounded-3xl min-[500px]:rounded-full bg-slate-200 font-medium text-lg px-5 py-3 !no-underline">
            <div className="flex gap-2 items-center h-full flex-wrap">
              <p className="no-underline">{addOn.heading}</p>
              <div className="flex flex-wrap items-center gap-2">
                {renderInputIndicators(addOn)}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex my-2 w-11/12 mx-auto">
            <div className="gap-3 w-full flex flex-col" aria-required>
              {addOn.addOnOptions
                ? addOn.addOnOptions.map((addOnOption) => (
                    <div
                      className="flex justify-between border-b-[1px] border-b-gray-200 py-3 w-full items-center space-x-2"
                      key={addOnOption.label}
                    >
                      <div className="flex items-center gap-2">
                        <Input
                          type="radio"
                          name={addOn.heading}
                          checked={addOnOption.isChecked}
                          value={
                            addOnOption.price
                              ? addOnOption.price.toString()
                              : "0"
                          }
                          onChange={handleRadioChange}
                          className="cursor-pointer h-max w-max"
                          id={addOnOption.label}
                          required
                        />
                        <label
                          className="text-sm font-medium text-gray-700"
                          htmlFor={addOnOption.label}
                        >
                          {addOnOption.label}
                        </label>
                      </div>
                      {addOnOption.price ? (
                        <p className="text-gray-500 font-normal text-sm">
                          {formatPrice(addOnOption.price)}
                        </p>
                      ) : null}
                    </div>
                  ))
                : null}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default AdditionalInfo;
