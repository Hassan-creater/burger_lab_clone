import { BookXIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

function notFound() {
  return (
    <div className="w-full flex flex-col items-center gap-5 justify-center my-20">
      <BookXIcon size={150} />
      <p className="font-bold text-center text-3xl">Page not Found</p>
      <Link href="/" className="underline text-[#fabf2c]">
        Go to Home
      </Link>
    </div>
  );
}

export default notFound;
