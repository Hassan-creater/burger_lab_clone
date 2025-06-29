import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileSkeleton() {
  return (
    <Card className="w-full max-w-[60%]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          <Skeleton className="w-32 h-6 mx-auto" />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Profile Image */}
        <div className="w-full flex items-center justify-center">
          <Skeleton className="w-20 h-20 rounded-full" />
        </div>

        {/* First & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-full h-10" />
          </div>
          <div className="space-y-2">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-full h-10" />
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-full h-10" />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-full h-10" />
        </div>

        {/* Mobile Number */}
        <div className="space-y-2">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-full h-10" />
        </div>

        {/* Button */}
        <Skeleton className="w-full h-12 rounded-md" />
      </CardContent>
    </Card>
  )
}
