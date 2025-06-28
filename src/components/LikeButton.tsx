"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { HeartIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "sonner";
import { useCartContext } from "@/context/context";
import { apiClient } from "@/lib/api";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
  className?: string;
  itemId: string;
  isFav: boolean;
  id?: string;
  setIsFav: React.Dispatch<React.SetStateAction<boolean>>;
  favorites?: any[];
}

function LikeButton({ className, itemId, isFav, setIsFav, id, favorites }: LikeButtonProps) {
  const { setFavorite, favorite , setAuthOpen , user } = useCartContext();
  const [initialFavorites, setInitialFavorites] = useState(favorites);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const addFav = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.post(`/favorite/add`, {
        itemId: itemId,
      });
      if (res.status === 200 || res.status === 201 || res.status === 204) {
        toast.success("Item Added to Favorites");
        setIsFav(true);
        //Extract favoriteId from response and pass both itemId and favId
        const favoriteId = res.data.data.favoriteId;
        setFavorite({ itemId, favId: favoriteId });
      } else {
        setIsFav(false);
        toast.error("Something went wrong");
      }
    } catch (error) {
      setIsFav(false);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFav = async () => {
    setIsLoading(true);
    try {
      const Id = favorite?.find((fav: any) => fav.itemId == itemId)?.favId;
      console.log(Id);
      if (Id) {
        const res = await apiClient.delete(`favorite/${Id}`);
        if (res.status === 200 || res.status === 201 || res.status === 204) {
          toast.success("Item Removed from Favorites");
          setIsFav(false);
          setFavorite({ itemId, favId: "" }); // Pass empty favId for removal
          setInitialFavorites((prev) => prev?.filter(fav => fav.itemId !== itemId));
          router.refresh();
        } else {
          toast.error("Something went wrong");
          setIsFav(true);
        }
      } else {
        const res = await apiClient.delete(`favorite/${id}`);
        if (res.status === 200 || res.status === 201 || res.status === 204) {
          toast.success("Item Removed from Favorites");
          setIsFav(false);
          setFavorite({ itemId, favId: "" }); // Pass empty favId for removal
        } else {
          toast.error("Something went wrong");
          setIsFav(true);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
      setIsFav(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      id={itemId.toString()}
      variant="default"
      disabled={isLoading}
      className={cn(
        "p-2 rounded-full flex items-center justify-center absolute top-2 right-2 bg-gray-200 text-black hover:bg-gray-300",
        isFav && "border-0 ring-0 text-transparent",
        isLoading && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {isLoading ? (
        <LoadingSpinner className="w-4 h-4 border-t-gray-600" />
      ) : (
        <HeartIcon
          onClick={(e) => {
            if(!user){
              setAuthOpen(true);
              return;
            }
            e.stopPropagation();
            if (isFav) {
              setIsFav(false);
              removeFav();
            } else {
              setIsFav(true);
              addFav();
            }
          }}
          className={`${isFav ? "text-red-500" : "text-gray-500"}`}
          fill={isFav ? "rgb(239 68 68)" : "none"}
        />
      )}
    </Button>
  );
}

export default LikeButton;
