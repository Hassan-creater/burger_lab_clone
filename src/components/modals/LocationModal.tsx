"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LocationDropIcon } from "../icons";
import { getAllBranches } from "@/functions";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { deliveryModalTabList } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { XIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useCart from "@/hooks/useCart";

export default function LocationModal() {
  const { clearCart } = useCart();

  const [address, setAddress] = useState(() => ({
    city: "",
    area: "",
    orderType: "",
  }));
  const { data, isLoading, status } = useQuery({
    queryKey: ["branches"],
    queryFn: getAllBranches,
    staleTime: 1000 * 60 * 60,
  });
  const cities = useMemo(
    () => !isLoading && data?.branches?.map((branch) => branch.city),
    [data?.branches, isLoading]
  );
  const localBranchData = useLocalStorage("branch", null);

  const [open, setOpen] = useState(
    () =>
      !localBranchData.storedValue || localBranchData.storedValue.length === 0
  );

  useEffect(() => {
    if (localBranchData.storedValue) {
        setAddress((prev) => ({
            city: localBranchData.storedValue?.city,
            area: "",
            orderType: localBranchData.storedValue?.orderType,
        }));
        setOpen(false);
    }
  }, [localBranchData?.storedValue]);

  const handleSelect = () => {
    localBranchData.setValue({
      ...data?.branches?.filter((branch) => branch.city === address.city)[0],
      delivery_areas: address.area,
      orderType: address.orderType,
    });
    clearCart();
    setOpen(false);
  };

  const handleModalOpen = () => {
    setOpen(() => {
      if (
        open &&
        (!localBranchData.storedValue ||
          localBranchData.storedValue.length === 0)
      )
        return true;

      if (!open) return true;

      return false;
    });
  };

  return (
    <Dialog modal open={open} onOpenChange={handleModalOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex gap-2 flex-1 items-center h-full justify-start pl-2 pr-2 lg:-order-1 hover:bg-white active:scale-100">
          <LocationDropIcon width={18} height={18} />
          <div className="flex flex-col justify-center w-full max-w-36 cursor-pointer">
            <span className="text-xs lg:text-sm text-black font-medium text-start">
              {localBranchData.storedValue?.orderType.toUpperCase()}
            </span>
            <span className="text-xs lg:text-sm font-normal text-black text-ellipsis text-start">
              {localBranchData.storedValue?.delivery_areas}
            </span>
          </div>
        </Button>
      </DialogTrigger>
      {status === "success" && !isLoading ? (
        <DialogContent className=" h-auto flex flex-col gap-2 items-center loadingModal sm:w-[70%] md:w-[55%] lg:w-[40%] max-w-[90%] mx-auto rounded-lg">
          <div className="w-[20%] h-auto">
            <Image
              src="/logo.webp"
              alt="logo"
              width={120}
              height={120}
              priority
              className="object-fill w-full h-full"
            />
          </div>
          <h3 className="text-lg text-gray-900 font-bold">
            Select your order type
          </h3>
          <Tabs
            onValueChange={(value) => {
              setAddress((prev) => ({
                ...prev,
                orderType: value,
                area: "",
              }));
            }}
            defaultValue={
              localBranchData.storedValue?.orderType ||
              deliveryModalTabList[0].value
            }
            className="w-full"
          >
            <TabsList className="bg-transparent flex gap-1 mb-4">
              {deliveryModalTabList.map(({ name, value }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="py-3 data-[state=active]:bg-primaryOrange bg-transparent data-[state=active]:text-black text-gray-500 font-semibold"
                >
                  {name}
                </TabsTrigger>
              ))}
            </TabsList>
            {deliveryModalTabList.map(({ value }) => (
              <TabsContent
                key={value}
                value={value}
                className="w-full flex flex-col gap-2 data-[state=active]:mt-2 mt-0"
              >
                <Select
                  onValueChange={(city) => {
                    setAddress((prev) => ({ ...prev, city, orderType: value }));
                  }}
                  defaultValue={localBranchData.storedValue?.city}
                >
                  <SelectTrigger className="w-full focus:ring-primaryOrange focus:ring-offset-0 ">
                    <SelectValue
                      placeholder="Select City / Region"
                      style={{ color: "gray" }}
                    />
                  </SelectTrigger>
                  <SelectContent className="focus:ring-0">
                    {cities &&
                      cities.map((city) => (
                        <SelectItem
                          key={city}
                          value={city}
                          className="text-black"
                        >
                          {city}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={(areaVal) => {
                    setAddress({ ...address, area: areaVal, orderType: value });
                  }}
                  // defaultValue={
                  //   address.city !== "" &&
                  //   localBranchData.storedValue?.delivery_areas
                  // }
                >
                  <SelectTrigger className="w-full focus:ring-primaryOrange focus:ring-offset-0">
                    <SelectValue
                      placeholder={
                        value === "delivery"
                          ? "Select Area / Sub Region"
                          : "Select Branch"
                      }
                      className="text-gray-500"
                    />
                  </SelectTrigger>
                  <SelectContent className="focus:ring-0">
                    {address.city.length > 0
                      ? data?.branches
                        ? value === "delivery"
                          ? data?.branches
                              .find((branch) => branch.city === address.city)
                              ?.delivery_areas.split(",")
                              .map((area) => (
                                <SelectItem
                                  key={area}
                                  value={area}
                                  className="text-black"
                                >
                                  {area}
                                </SelectItem>
                              ))
                          : data?.branches
                              .filter((branch) => branch.city === address.city)
                              .map((branch) => (
                                <SelectItem
                                  key={branch.id}
                                  value={branch.name}
                                  className="text-black"
                                >
                                  {branch.name}
                                </SelectItem>
                              ))
                        : null
                      : null}
                  </SelectContent>
                </Select>
              </TabsContent>
            ))}
          </Tabs>
          <Button
            className="w-full bg-primaryOrange disabled:bg-slate-200 disabled:text-gray-600 text-black hover:bg-primaryOrange/90"
            disabled={!address.city || !address.area}
            onClick={handleSelect}
          >
            Select
          </Button>
          <DialogClose className="bg-black/80 p-1 rounded-xl text-white right-2 top-2 sm:right-2 sm:top-2">
            <XIcon className="w-6 h-6" />
          </DialogClose>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
