import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BASE_URL_IMAGES } from "@/lib/constants";
import { MoveDiagonal } from "lucide-react";
import Image from "next/image";

type ImageModalProps = {
  imageSrc: string;
  imageAlt: string;
};

export default function ImageModal({ imageSrc, imageAlt }: ImageModalProps) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Image
            // src={`${BASE_URL_IMAGES}/${imageSrc}`}
            src={imageSrc}
            alt={imageAlt}
            width={500}
            height={500}
            className="object-contain w-full h-1/2 rounded-xl"
          />
        </DialogTrigger>
        <DialogContent className="max-w-[50%] sm:max-w-[300px] p-0">
          <Image
            // src={`${BASE_URL_IMAGES}/${imageSrc}`}
            src={"/cards-img2.jpeg"}
            alt={imageAlt}
            width={300}
            height={300}
            className="w-full h-full object-contain"
          />
          <DialogClose>
            <MoveDiagonal className="w-6 h-6" />
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
