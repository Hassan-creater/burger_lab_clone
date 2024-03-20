"use client";

import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import useLocalStorage from "@/hooks/useLocalStorage";
import { RefetchOptions, useMutation } from "@tanstack/react-query";
import { addAddress, updateAddress } from "@/functions";
import { toast } from "sonner";
import { QueryObserverResult } from "@tanstack/react-query";
import { Address } from "@/models/Address";

type addressFetch = QueryObserverResult<
  | {
      status: number;
      addresses: Address[];
    }
  | {
      status: number;
      addresses: null;
    },
  Error
>;

function AddressModal({
  streetAdd,
  children,
  type,
  addressId,
  refetch,
}: {
  streetAdd?: string;
  children: React.ReactNode;
  type: "ADD" | "EDIT";
  addressId?: number;
  refetch: (options?: RefetchOptions | undefined) => Promise<addressFetch>;
}) {
  //TODO TEMPORARY
  const userId = 80;

  const localBranchData = useLocalStorage("branch", null);

  const [streetAddress, setStreetAddress] = useState(streetAdd || "");
  const [isOpen, setIsOpen] = useState(false);

  const branchArea = useMemo(
    () =>
      `${localBranchData.storedValue?.delivery_areas}, ${localBranchData.storedValue?.city}`,
    [
      localBranchData.storedValue?.city,
      localBranchData.storedValue?.delivery_areas,
    ]
  );

  const addNewAddress = useMutation({
    mutationFn: () =>
      addAddress(
        userId,
        streetAddress,
        branchArea.split(",")[0],
        branchArea.split(",")[1].trimStart()
      ),

    onSuccess() {
      setStreetAddress("");
      setIsOpen(!isOpen);
      toast.success("Address Added Successfully", {
        style: { backgroundColor: "green", color: "white" },
        closeButton: true,
        dismissible: true,
      });
      refetch();
    },

    onError() {
      toast.error("Failed to add new Address", {
        style: { backgroundColor: "red", color: "white" },
        closeButton: true,
        dismissible: true,
      });
    },
  });

  const updateAdd = useMutation({
    mutationFn: () =>
      updateAddress(
        addressId!,
        streetAddress,
        branchArea.split(",")[0],
        branchArea.split(",")[1].trimStart()
      ),

    onSuccess(data) {
      if (data.status === 500) {
        toast.error("Failed to update Address", {
          style: { backgroundColor: "red", color: "white" },
          closeButton: true,
          dismissible: true,
        });
      } else {
        setStreetAddress("");
        setIsOpen(!isOpen);
        toast.success("Address updated Successfully", {
          style: { backgroundColor: "green", color: "white" },
          closeButton: true,
          dismissible: true,
        });
        refetch();
      }
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (localBranchData.storedValue?.orderType === "delivery") {
          setIsOpen(!isOpen);
          setStreetAddress(streetAdd || "");
        } else {
          toast.error("Cannot Perform Action.\nPlease select Delivery Option", {
            style: { backgroundColor: "red", color: "white" },
            closeButton: true,
            dismissible: true,
          });
        }
      }}
    >
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="flex flex-col p-4 descriptionModal gap-3 sm:w-[70%] md:w-[55%] lg:w-[40%] max-w-[90%] mx-auto rounded-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-5">
          {type === "EDIT" ? "Edit" : "Add new"} address
        </h3>
        <section className="space-y-2">
          <Label className="text-md font-normal" htmlFor="streetAddress">
            Address (with post code if applicable)
          </Label>
          <Input
            id="streetAddress"
            placeholder="Enter your complete street address"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            className=" focus-visible:ring-primaryOrange"
          />
        </section>
        <section className="space-y-2">
          <Label className="text-md font-normal" htmlFor="areaAddress">
            Area / City
          </Label>
          <Input
            id="areaAddress"
            disabled
            className=" focus-visible:ring-primaryOrange disabled:bg-slate-300 text-gray-700"
            value={branchArea}
          />
          <p className="text-xs font-normal text-gray-800">
            To change your area/region, please do it from top header location
            button.
          </p>
        </section>
        <Button
          className="w-full py-2 text-sm min-[500px]:text-lg font-bold bg-primaryOrange focus-visible:ring-black/50 hover:bg-primaryOrange/80 disabled:bg-slate-200 disabled:text-gray-600"
          variant="secondary"
          disabled={
            streetAddress.length === 0 || addNewAddress.status === "pending"
          }
          onClick={() =>
            type === "ADD" ? addNewAddress.mutate() : updateAdd.mutate()
          }
        >
          {type === "ADD" ? "Save Address" : "Update Address"}
        </Button>
        <DialogClose className="bg-black/80 p-1 rounded-xl text-white right-2 top-2 sm:right-2 sm:top-2">
          <XIcon className="w-6 h-6" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default AddressModal;
