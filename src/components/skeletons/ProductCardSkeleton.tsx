import { Skeleton, SVGSkeleton } from "../ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="bg-card text-card-foreground shadow-sm w-40 min-[500px]:w-52 min-h-[430px] max-h-[450px] rounded-2xl transition-colors border-2 hover:border-primaryOrange flex flex-col">
      <a className="flex-1">
        <div className="flex flex-col space-y-1.5 relative p-2 max-w-[200px]">
          <div className="flex items-center w-full justify-center">
            <SVGSkeleton className="rounded-2xl object-fill w-[100px] h-[100px]" />
          </div>
          <div className="h-10 p-2 flex items-center justify-center absolute top-2 right-2 border-0">
            <SVGSkeleton className="w-[24px] h-[24px]" />
          </div>
        </div>
        <div className="p-6 flex flex-col items-center justify-center py-3 min-h-[88px] px-2">
          <h4 className="min-h-12 flex items-center justify-center">
            <Skeleton className="w-[104px] max-w-full" />
          </h4>
          <p>
            <Skeleton className="w-[168px] max-w-full" />
          </p>
        </div>
      </a>
      <div className="p-6 flex flex-col items-center justify-center gap-1 pt-5 pb-3">
        <p>
          <Skeleton className="w-[80px] max-w-full rounded-full" />
        </p>
        <div className="flex flex-1 gap-2 items-center h-full p-2 max-h-10">
          <div className="inline-flex items-center justify-center p-2 w-7 h-7 transition-colors">
            <Skeleton className="w-[14px] max-w-full" />
          </div>
          <Skeleton className="flex file:border-0 w-10 h-auto px-1 py-0" />
          <div className="inline-flex items-center justify-center p-2 w-7 h-7 transition-colors">
            <Skeleton className="w-[14px] max-w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
