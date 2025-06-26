import { Link} from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

const NoFavorites = () => {
  return (
    <div className="w-full min-h-full bg-green-400 flex flex-col gap-3 items-center justify-center">
          <p className="text-lg font-bold">No Favorite Items</p>
          <Link href="/">
            <Button className="w-[40%] h-10 bg-red-400 min-w-[250px] mx-auto px-5 py-2  text-black hover:bg-primaryOrange/80 text-lg">
              View All Items
            </Button>
          </Link>
        </div>
  );
};

export default NoFavorites;
