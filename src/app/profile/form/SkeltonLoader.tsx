import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileSkeleton() {
  return (
    <Card className="w-full p-[1em] max-w-[60%] bg-white shadow-none border-none ">
      <CardHeader>
        <CardTitle className="text-[20px] font-semibold text-center ">
          <Skeleton className="w-32 h-6 mx-auto bg-gray-200 rounded-md animate-pulse" />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Profile Image */}
        <div className="w-full flex items-center justify-center">
          <Skeleton className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
        </div>

        {/* First & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="w-24 h-4 bg-gray-200 animate-pulse" />
            <Skeleton className="w-full h-10 bg-gray-200 animate-pulse" />
          </div>
          <div className="space-y-2">
            <Skeleton className="w-24 h-4 bg-gray-200 animate-pulse" />
            <Skeleton className="w-full h-10 bg-gray-200 animate-pulse" />
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Skeleton className="w-32 h-4 bg-gray-200 animate-pulse" />
          <Skeleton className="w-full h-10 bg-gray-200 animate-pulse" />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Skeleton className="w-24 h-4 bg-gray-200 animate-pulse" />
          <Skeleton className="w-full h-10 bg-gray-200 animate-pulse" />
        </div>

        {/* Mobile Number */}
        <div className="space-y-2">
        <Skeleton className="w-32 h-4 bg-gray-200 animate-pulse" />
        <Skeleton className="w-full h-10 bg-gray-200 animate-pulse" />
        </div>

        {/* Button */}
        <Skeleton className="w-full h-12 rounded-md bg-gray-200 animate-pulse" />
      </CardContent>
    </Card>
  )
}
