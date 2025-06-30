"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import ProfileSkeleton from "./SkeltonLoader"
import { designVar } from "@/designVar/desighVar"
import { toast } from "sonner"
import { useCartContext } from "@/context/context"
import { useRouter } from "next/navigation";


// Define the form data type
interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  countryCode: string
  mobileNumber: string
  gender: string
  address: string
  city: string
  profileImage: string
}

export default function ProfileForm() {
  const [date, setDate] = useState<Date>()
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting , isDirty , isSubmitSuccessful },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+92",
      mobileNumber: "",
      gender: "",
      address: "",
      city: "",
      profileImage: ""
    },
  })

  const watchedGender = watch("gender")
  const watchedCountryCode = watch("countryCode")
  const [profileImage, setProfileImage] = useState<string>("")
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const {user} = useCartContext();
  const router = useRouter();
  const handleProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      setIsSubmitted(false) // Re-enable button when user changes image
      // Mark form as dirty when image changes
      setValue("profileImage", URL.createObjectURL(file), { shouldDirty: true })
    }
  }

  const getProfile = async () => {
    const data = await apiClient.get("/auth/profile");
    return data.data.data?.profile
  }

  const {data, isLoading} = useQuery({
    queryKey : ["profile"],
    queryFn : getProfile
  })


  const onSubmit = async (data: ProfileFormData) => {

    try {
      // Simulate API call
      const formData = new FormData();
      formData.append("firstName", data.firstName)
      formData.append("lastName", data.lastName)
      formData.append("email", data.email)
      formData.append("phone", data.mobileNumber)
      formData.append("gender", data.gender || "")
      formData.append("image", profileImage)
      // Here you would typically make an API call to update the profile
      const res = await apiClient.put("/auth/profile", formData)
      if(res.status === 200 || res.status === 201){
        toast.success("Profile updated successfully")
        setIsSubmitted(true) // Mark as submitted successfully
        
        // Reset the form's dirty state to prepare for next cycle
        setTimeout(() => {
          reset(data, { keepDirty: false, keepErrors: false })
       
        }, 100)
      }else{
        toast.error("Failed to update profile")
      }
    
    } catch (error) {
     
      toast.error("Failed to update profile")
    }
  }

  // Reset submitted state when form becomes dirty
  useEffect(() => {
    if (isDirty && isSubmitted) {
     
      setIsSubmitted(false)
    }
  }, [isDirty, isSubmitted])

  // Debug logging for button state


  useEffect(() => {

    if(!user){
      router.push("/")
    }
    if (data && !isDataLoaded) {

      
      setProfileImage(data?.image || "")
      setValue("firstName", data?.firstName || "")
      setValue("lastName", data?.lastName || "")
      setValue("email", data?.email || "")
      setValue("mobileNumber", data?.phone || "")
      setValue("address", data?.address || "")
      setValue("city", data?.city || "")
      // Set gender with a small delay to ensure Select component updates
      setTimeout(() => {
        setValue("gender", data?.gender || "")
      }, 100)
      
      setIsDataLoaded(true)

    }
  }, [data, setValue, isDataLoaded, watchedGender])



  return (
    <div className={`   flex items-center justify-center sm:p-4 ${designVar.fontFamily} `}>
      {
        isLoading ? <div className="flex items-center justify-center w-full">
          <ProfileSkeleton/>
        </div> :
        <Card className="w-full max-w-[100%] sm:max-w-[60%] ">
          <CardHeader>
          <CardTitle className="text-xl font-semibold text-center sr-only">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4  p-4 rounded-md shadow-lg shadow-black/20">
            {/* profile image */}
            <div onClick={() => {
              const fileInput = document.getElementById("fileInput") as HTMLInputElement;
              if (fileInput) {
                fileInput.click();
              }
            }} className="w-full  flex items-center justify-center">
              <img  src={profileImage || data?.image} alt="profile" className="w-20 h-20 rounded-full bg-gray-100 " />
              <input id="fileInput" type="file" className="hidden" onChange={handleProfileImage} />
            </div>
            {/* Full Name */}
            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                First Name
              </Label>
              <Input
                id="firstName"
                {...register("firstName", {
                  required: "First name is required",
                  minLength: { value: 2, message: "First name must be at least 2 characters" },
                })}
                className="w-full"
                placeholder="Enter your first name"
              />
              {errors.firstName && <p className="text-sm ">{errors.firstName?.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Last Name
              </Label>
              <Input
                id="lastName"
                {...register("lastName", {
                  required: "Last name is required",
                  minLength: { value: 2, message: "Last name must be at least 2 characters" },
                })}
                className="w-full"
                placeholder="Enter your last name"
              />
              {errors.lastName && <p className="text-sm text-red-600">{errors.lastName?.message}</p>}
            </div>
            </div>
            

            {/* Gender and Date of Birth Row */}
            <div className="space-y-2 w-full">
                <Label className="text-sm font-medium text-gray-700">
                  Gender <span className="text-gray-400">(Optional)</span>
                </Label>
                <Select 
                  value={watchedGender} 
                  onValueChange={(value) => {
                    setValue("gender", value, { shouldDirty: true })
                    setIsSubmitted(false) // Re-enable button when gender changes
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {/* Hidden input to ensure gender is tracked by react-hook-form */}
                <input 
                  type="hidden" 
                  {...register("gender")} 
                />
              </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Please enter a valid email address" },
                })}
                className="w-full"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email?.message}</p>}
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Mobile Number</Label>
              <div className="flex gap-2">
                <Input
                  {...register("mobileNumber", {
                    required: "Mobile number is required",
                    minLength: { value: 10, message: "Please enter a valid mobile number" },
                  })}
                  className="flex-1"
                  placeholder="300-9721927"
                />
              </div>
              {errors.mobileNumber && <p className="text-sm text-red-600">{errors.mobileNumber?.message}</p>}
            </div>

            {/* Update Profile Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty || isSubmitted}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-3 mt-6"
            >
              {isSubmitting ? "Updating..." : isSubmitted ? "Profile Updated!" : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
      }
    </div>
  )
}
