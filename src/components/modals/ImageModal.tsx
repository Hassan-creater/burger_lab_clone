import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
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
            src={imageSrc}
            alt={imageAlt}
            width={100}
            height={100}
            className="object-contain w-full h-1/2 rounded-xl"
          />
        </DialogTrigger>
        <DialogContent className="max-w-[50%] sm:max-w-[300px] p-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={100}
            height={100}
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
