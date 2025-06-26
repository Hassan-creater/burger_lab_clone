import { Skeleton, SVGSkeleton } from "../ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="bg-card text-card-foreground shadow-sm w-full max-w-lg h-40 rounded-2xl border-2 hover:border-primaryOrange flex overflow-hidden">
      {/* Left: Image Placeholder */}
      <div className="w-1/3 bg-muted flex items-center justify-center p-2">
        <SVGSkeleton className="rounded-2xl object-cover w-full h-full" />
      </div>

      {/* Right: Content */}
      <div className="w-2/3 flex flex-col justify-between p-4">
        {/* Top: Item Name */}
        <div className="">
          <h4 className="text-lg font-semibold mb-2">
            <Skeleton className="w-3/4 max-w-full" />
          </h4>
        </div>

        {/* Bottom: Two Divs */}
        <div className="flex flex-row gap-4">
          <div className="flex-1 bg-muted rounded-lg p-2 flex items-center justify-center">
            <Skeleton className="w-1/2" />
          </div>
          <div className="flex-1 bg-muted rounded-lg p-2 flex items-center justify-center">
            <Skeleton className="w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
