"use client";

import React from "react";
import { Button } from "./ui/button";
import { HeartIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { addFavorite, removeFavorite } from "@/functions";
import { user } from "@/lib/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/slices/userSlice";

interface LikeButtonProps {
  className?: string;
  itemId: number;
  isFav: boolean;
  setIsFav: React.Dispatch<React.SetStateAction<boolean>>;
}

function LikeButton({ className, itemId, isFav, setIsFav }: LikeButtonProps) {
  const { user } = useUserStore();

  const router = useRouter();
  const addFav = useMutation({
    mutationFn: () => addFavorite(user?.userId!, itemId), // userId will be present because I am only calling this mutation fn when user is not null
    onSuccess() {
      toast.success("Item Added to Favorites", {
        style: { backgroundColor: "green", color: "white" },
        closeButton: true,
        dismissible: true,
      });
      setIsFav(true);
    },
  });

  const removeFav = useMutation({
    mutationFn: () => removeFavorite(user?.userId!, itemId),
    onSuccess(data) {
      router.refresh();
      toast.success(data.message?.message, {
        style: { backgroundColor: "green", color: "white" },
        closeButton: true,
        dismissible: true,
      });
      setIsFav(false);
    },
    onError(data) {
      toast.error(data.message, {
        style: { backgroundColor: "red", color: "white" },
        closeButton: true,
        dismissible: true,
      });
    },
  });

  const handleFavLogic = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (e?.currentTarget?.id === itemId.toString()) e.preventDefault();
    if (!user) {
      toast.error("Login to Start saving Favorites!", {
        style: { backgroundColor: "red", color: "white" },
        closeButton: true,
        dismissible: true,
      });
    } else !isFav ? addFav.mutateAsync() : removeFav.mutateAsync();
  };

  return (
    <Button
      onClick={handleFavLogic}
      id={itemId.toString()}
      variant="default"
      className={cn(
        "p-2 rounded-full flex items-center justify-center absolute top-2 right-2 bg-gray-200 text-black hover:bg-gray-300",
        isFav && "border-0 ring-0 text-transparent",
        className
      )}
    >
      <HeartIcon
        className={cn("hover:text-red-500", isFav && "text-red-500")}
        fill={isFav ? "rgb(239 68 68)" : "none"}
      />
    </Button>
  );
}

export default LikeButton;
