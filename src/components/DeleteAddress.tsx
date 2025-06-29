"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";


interface DeleteAddressProps {
  id: string;
}

export default function DeleteAddress({ 
  id 
}: DeleteAddressProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const [disabled, setDisabled] = useState(false);

  const deleteAddress = async (id: string) => {
    setDisabled(true);

  
    const promise = apiClient.delete(`/address/delete/${id}`);
  
    toast.promise(promise, {
      loading: "Deleting address...",
      success: "Address deleted successfully",
      error: "Failed to delete address",
    });
  
    try {
      const res = await promise;
  
      if (res.status === 204) {
        setIsOpen(false);
        setDisabled(false);
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
      }
    } catch (error) {
      console.error("Address deletion failed:", error);
      setDisabled(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          className={cn(
            "p-2 h-auto text-red-500 hover:text-red-700 hover:bg-red-50",
            disabled && "opacity-50 cursor-not-allowed",
        
          )}
        >
          <Trash2 className="w-4 h-4" />
          <span className="sr-only">Delete address</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] descriptionModal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            Delete Address
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this address? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={disabled}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={()=>deleteAddress(id)}
            disabled={disabled}
            className="flex-1 sm:flex-none"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 