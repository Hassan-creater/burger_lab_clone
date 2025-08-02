"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useEffect, useRef, useState } from "react"
import { apiClient } from "@/lib/api"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { Camera, Loader2, XIcon } from "lucide-react"
import ProfileSkeleton from "./SkeltonLoader"
import { designVar } from "@/designVar/desighVar"
import { toast } from "sonner"
import { useCartContext } from "@/context/context"
import { useRouter } from "next/navigation";
import { getClientCookie } from "@/lib/getCookie"
import Cookies from "js-cookie"
import { DialogClose, DialogHeader,  DialogTitle, DialogContent,  Dialog, DialogTrigger } from "@/components/ui/dialog"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import DeleteAccount from "./DeleteAccount"
import UpdatePassword from "./UpdatePassword"


// Define the form data type
interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  gender: string
  profileImage: string
  dateOfBirth : string
  image  : any
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
    trigger,
    formState: { errors, isSubmitting , isDirty , isSubmitSuccessful },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      
      mobileNumber: "",
      gender: "",
     
     
    },
  })

  const token = getClientCookie("accessToken");

  const watchedGender = watch("gender")

  const [disable , setDisable] = useState(true);
  const [profileImage, setProfileImage] = useState<string>("")
  const removeImage = () => setProfileImage("");
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [phoneChange , setPhoneChange] = useState(false);
  const [emailChange , setEmailChange] = useState(false);
  const [phoneLoading , setPhoneLoading] = useState(true);
  const [phoneUpdate , setPhoneUpdated] = useState(true);
  const [emailUpdate , setEmailUpdated] = useState(true);
  const [authOpen , setAuthOpen] = useState(false);
  const [deleteImage , setDeleteImage] = useState(false);
  const [photoDialogOpen , setPhotoDialogOpen] = useState(false);
  const [verifiedEmail , setEmailVerified] = useState(true);
  const [otpLoading , setOtpLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const phoneLength = watch("mobileNumber");
  const emailWatch = watch("email")
  const formRef = useRef<any>("form")
  const { setUser , userProfile , ResetProfile} = useCartContext();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [img, setImg] = useState<any>();
  



  const deleteProfileImage = async ()=>{
  
  
    setDeleteImage(true);

   const res = await apiClient.delete("/auth/customer/profile/image");
   if(res.status == 204){
  
    toast.success("Profile image deleted.")
    setDeleteImage(false);
    // querClient.invalidateQueries({queryKey : ["profile"]})
   }
  }

  const getProfile = async () => {
    try {
      const res = await apiClient.get("/auth/customer/profile");
  
      if (res.status === 200 || res.status === 201) {
        ResetProfile(res.data.data?.profile)
       
        return res.data.data?.profile;
      }
  
      throw new Error(`Unexpected status code: ${res.status}`);
    } catch (error: any) {
      if(error.response.status == 401){
        Cookies.remove("accessToken", { path: "/" });
        Cookies.remove("refreshToken", { path: "/" });
        Cookies.remove("userData" , {path : "/"});
        localStorage.removeItem("defaultAddress")
        setUser({});
        router.push("/")
      }
      return null;
    }
  };
  

  const {data, isLoading} = useQuery({
    queryKey : ["profile"],
    queryFn : getProfile
  })

 
 const Data = userProfile || data
 

  const onSubmit = async (data: ProfileFormData) => {
 
    try {
      // Simulate API call
      const formData = new FormData();
      formData.append("firstName", data.firstName)
      formData.append("lastName", data.lastName)
      // formData.append("email", data.email)
      // formData.append("phone", data.mobileNumber)
      formData.append("gender", data.gender || "")
      formData.append("dateOfBirth", data.dateOfBirth)
      formData.append("avatar" , img);  
     
      // Here you would typically make an API call to update the profile
      const res = await apiClient.put("/auth/customer/profile", formData)
      if(res.status === 200 || res.status === 201){
        toast.success("Profile updated successfully")
        setDisable(true);
        queryClient.invalidateQueries({queryKey :["profile"]});
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

    if(!token){
      router.push("/")
    }

  

    if (data && !isDataLoaded && Data ) {
   
      setProfileImage(Data?.image || "")
      setValue("firstName", Data?.firstName || "")
      setValue("lastName", Data?.lastName || "")
      setValue("email", Data?.email || "")
      setValue("mobileNumber", Data?.phone || "")
      setValue("dateOfBirth", new Date(Data?.dob).toISOString().split('T')[0] || "")
      setValue("gender", Data?.gender || "")
      // Set gender with a small delay to ensure Select component updates
      setTimeout(() => {
        setValue("gender", Data?.gender || "")
      }, 100)
      
      setIsDataLoaded(true)
       
      setTimeout(() => {
        setDisable(true)
      }, 110)

    }
   
  }, [data , Data])


  const updatePhone = async () => {
   setPhoneLoading(false);
    try {
      const res = await toast.promise(
        apiClient.put("/auth/customer/phone", {
          phone: phoneLength,
        }),
        {
          loading: "Updating phone number...",
          success: "Phone number updated successfully.",
          error: (err) => {
            // Extract your custom error message here
            return (
              err?.response?.data?.error ||
              err?.response?.data?.message ||
              err?.message ||
              "Something went wrong"
            );
          },
        }
      
      );
  
      // Run UI logic after successful response
    // Update only the phone field in the form, not the whole form
    const updated = {
      ...userProfile,
      phone : phoneLength
    }
    ResetProfile(updated);
    setValue("mobileNumber" , phoneLength);
    setPhoneUpdated(false);
  }catch (error: any) {
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message || // fallback to generic JS error
      "Something went wrong";
  
    toast.error(message);
    setPhoneLoading(true);
    setPhoneUpdated(false);
  }
   finally {
      setPhoneLoading(true);
      setPhoneUpdated(false);
    }
  };




  const updateEmail = async () => {
  
 
  
    try {
      const res = await toast.promise(
        apiClient.put("/auth/customer/email", {
          email: emailWatch,
        }),
        {
          loading: "Processing...",
          success: (res) => {
            const message = res?.data?.message || "Email updated successfully";
  
            // Trigger modal or UI change if message matches
            if (message === "Verification OTP sent to new Email Successfully") {
              setAuthOpen(true);
            }
            return message;
          },
          error: (err) =>
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            err?.message ||
            "Something went wrong",
        }
  
  
      );
  
      
        //Show the actual success message from backend
    
  
    
     
  
     
    } catch (error: any) {
      // Optional: override the generic error toast with a specific one
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Something went wrong";
  
      toast.error(message);
    } finally {
     
    }
  };




  
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) return;
    const newOtp = [...otp];
    newOtp[idx] = value[0];
    setOtp(newOtp);
    // Move to next input if not last
    if (value && idx < 5) {
      const next = document.getElementById(`otp-input-${idx + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };
  
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
  
      // If current field has a value, clear it
      if (otp[idx]) {
        newOtp[idx] = "";
        setOtp(newOtp);
      }
      // If empty, move focus to previous
      else if (idx > 0) {
        const prev = document.getElementById(`otp-input-${idx - 1}`);
        prev && (prev as HTMLInputElement).focus();
      }
    }
  };
  
  
    // Handler for OTP form submit
    const handleOtpSubmit = async () => {
      setOtpLoading(true);
     
      const otpValue = otp.join("");
      if (otpValue.length !== 6) {
        toast.error("Please enter the 6-digit OTP");
        setOtpLoading(false);
        return;
      }
      // TODO: Call backend to verify OTP
    
  
     
      try {
    
        const res = await apiClient.post('/auth/customer/email/verify-otp', {
          code: otpValue.toString()
        });
    
        if (res.status === 200 || res.status === 201) {
          // If backend returns error in response (even with 200/201)
          if (res.data && (res.data.error || res.data.message === "Invalid OTP" || res.data.success === false)) {
            toast.error(res.data.error || res.data.message || "Invalid OTP");
          } else if (res.status === 200 || res.status === 201) {
            toast.success(res.data.message);
            setEmailVerified(true);
            setAuthOpen(false);
            window.location.reload();
            
          }
        }

      } catch (error : any) {
         let backendError =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Something went wrong . Try again later";
    
      // Try to parse JSON string error (e.g. "{'email':'Invalid email'}")
      if (
        typeof backendError === "string" &&
        (backendError.trim().startsWith("{") || backendError.trim().startsWith("["))
      ) {
        try {
          // Replace single quotes with double quotes for valid JSON parsing
          const jsonString = backendError.replace(/'/g, '"');
          const parsed = JSON.parse(jsonString);
          if (typeof parsed === "object" && parsed !== null) {
            // If it's an object, join all values (e.g. for field errors)
            backendError = Object.values(parsed).join(", ");
          }
        } catch {
          // If parsing fails, use the string as is
        }
      }
    
      // Always show the error, even if it's a plain string
      if(backendError == "Invalid email"){
        toast.error("Invalid email")
      }else{
      toast.error(backendError);
      }
      } finally {
    
        setOtpLoading(false);
      }
      // Optionally reset OTP or move to next step
    };


    function getDateOnly(isoString?: string) {
      if (!isoString) return "";
      return isoString.split("T")[0];
    }

    const handleReset = (e: React.FormEvent) => {
      e.preventDefault();
      if (userProfile) {
        reset({
          firstName: userProfile.firstName || data?.firstName,
          lastName: userProfile.lastName || data?.lastName,
          email: userProfile.email || data?.email,
          mobileNumber: userProfile.phone || data?.phone,
          gender: userProfile.gender || data?.gender,
          dateOfBirth: getDateOnly(userProfile?.dateOfBirth || userProfile?.dob || data?.dob
          ),
          image: userProfile?.image || data?.image
        });
        setProfileImage(userProfile?.image || data?.image);
        setEmailVerified(true);
        setDisable(true)
        toast.success("Profile reset to last saved data.");
      }
    };



  return (
    <div className={`   flex items-center justify-center sm:p-4 ${designVar.fontFamily} `}>

<Dialog open={authOpen} onOpenChange={setAuthOpen}>
      {/* <DialogTrigger asChild>
        <Button
          variant="outline"
          className={
            `${designVar.authButton.backgroundColor} ${designVar.authButton.borderRadius} ${designVar.authButton.paddingX} ${designVar.authButton.paddingY} ${designVar.authButton.fontSize} ${designVar.authButton.fontWeight} ${designVar.authButton.color} ${designVar.authButton.cursor} ${designVar.authButton.transition} ${designVar.authButton.hover.backgroundColor} ${designVar.authButton.hover.borderRadius} ${designVar.authButton.hover.color} ${designVar.authButton.hover.color} ${designVar.authButton.hover.backgroundColor}`
          }
        >
          <span className="hidden sm:block">Login / Register</span>
          <span className="block sm:hidden">Login</span>
        </Button>
      </DialogTrigger> */}
         <DialogContent className="w-[90%] sm:w-[30em] max-w-full h-max min-h-40 flex flex-col px-5 py-6 gap-0 rounded-xl border-0 descriptionModal">
        <DialogHeader>
          <DialogTitle asChild>
            <VisuallyHidden>Authentication</VisuallyHidden>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-xl xm:text-2xl font-bold mb-3">Enter OTP</h3>
          <form
            onSubmit={handleSubmit(handleOtpSubmit)}
            className="flex w-full flex-col items-center justify-center"
          >
            <Label className="w-full rounded-2xl my-4 mb-6 flex justify-center gap-2">
              <span className="sr-only">OTP</span>
              {otp.map((digit : any, idx : number) => (
                <Input
                disabled={otpLoading}
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-10 h-8 sm:w-10 sm:h-12 text-center text-xs sm:text-xl border-2 border-primaryOrange focus-visible:ring-primaryOrange rounded-lg sm:mx-1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, idx)}
                  onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                  autoFocus={idx === 0}
                />
              ))}
            </Label>
            <p className="w-full text-start text-red-500 text-sm mb-2">Otp will expire in 5 minutes</p>
            <Button
              type="submit"
              disabled={otpLoading || otp.some((d) => d === "")}
              className="w-full p-2 flex items-center justify-center rounded-2xl mb-3 bg-primaryOrange hover:bg-primaryOrange/80 text-black font-semibold"
            >
              {otpLoading ? <Loader2 className="animate-spin" /> : "Verify OTP"}
            </Button>
            {/* <Button
              className="rounded-2xl w-full p-2 flex items-center justify-center border-primaryOrange font-semibold"
              variant="outline"
              disabled={otpLoading}
              onClick={(e) => {
                e.preventDefault();
                
              }}
            >
              Go Back To Login
            </Button> */}
           
          </form>
        </div>
         
        <DialogClose className="bg-black/80 p-1 rounded-xl text-white right-2 top-2 sm:right-2 sm:top-2">
          <XIcon className="w-6 h-6" />
        </DialogClose>
      </DialogContent>
    </Dialog>
      {
        isLoading ? <div className="flex items-center justify-center w-full">
          <ProfileSkeleton/>
        </div> :
        <Card className="w-full max-w-[100%] sm:max-w-[100%] ">
          <CardHeader>
          <CardTitle className="text-xl font-semibold text-center sr-only">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4  p-4 rounded-md shadow-lg shadow-black/20 relative">
        <div className="absolute top-[2em] right-0 flex gap-1 ">

              
        <div className=" rounded-full   flex justify-center items-center">
            <UpdatePassword data={data?.passwordLastChangedAt} />
          </div>

            
          <div className=" rounded-full  flex justify-center items-center">
            <DeleteAccount/>
          </div>
        </div>
       



          <form ref={formRef} id="form" onSubmit={handleSubmit(onSubmit)} onReset={handleReset} className="space-y-4" >
            {/* profile image */}
            <div className="flex flex-col w-full max-w-[61em] justify-start sm:flex-row items-center mb-8 gap-4">
          <div className="relative mb-2 sm:mb-0">
       <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-100 to-orange-100 flex items-center justify-center shadow-lg border-4 border-white">
       <img
      src={profileImage || "/Avatar.png"}

      alt="Profile"
      className="w-14 h-14 rounded-full object-cover shadow-md border-2 border-white"
    />

    

     <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
      <button
        type="button"
        onClick={() => setPhotoDialogOpen(true)}
        className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow hover:bg-slate-100 transition border border-slate-200"
      >
        <Camera className="w-4 h-4 text-slate-700" />
      </button>
      <DialogContent className="flex flex-col items-center gap-6 max-w-[50%] descriptionModal">
        <DialogHeader>
          <DialogTitle>Profile Photo</DialogTitle>
        </DialogHeader>
        {/* Preview Image in a rounded box */}
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center shadow border-4 border-white mb-2">
          <img
            src={profileImage || "/Avatar.png"}
            alt="Preview"
            className="w-20 h-20 rounded-full object-cover"
          />
        </div>
        <div className="flex w-full flex-row-reverse gap-2">
        <button
          type="button"
          onClick={() => {
            setPhotoDialogOpen(false);
            document.getElementById("profile-photo-upload")?.click();
          }}
          className="w-full text-center px-4 py-2  rounded-md orange_color"
        >
          Change Profile Image
        </button>
        
        <button
          type="button"
          disabled={profileImage === null || profileImage === ""}
          onClick={() => {
            deleteProfileImage();
            removeImage();
            setPhotoDialogOpen(false);
          }}
          className={`w-full px-4 py-2   rounded-md ${profileImage == null || profileImage == "" ? "bg-red-500 opacity-65 " : "bg-red-500 hover:border-red-500 hover:text-red-500 hover:bg-white hover:border-[1px]"} text-center text-white  duration-300 `}
        >
          Delete Image
        </button>

        </div>
      </DialogContent>
    </Dialog>

    {/* Hidden file input */}
                <input
                id="profile-photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
               
                {...register("image", {
                  onChange: (e) => {
                    const file = e.target.files?.[0];
                    setImg(file);
                    if (!file) return;
                    
                    
                    const maxSize = 4 * 1024 * 1024; // 4MB in bytes
                    if (file.size > maxSize) {
                      toast.error("Image should be less than 4MB");
                      return;
                    }
              
                    const url = URL.createObjectURL(file);
                    setProfileImage(url);
                    setDisable(false);
                  }
                })}
              />

            </div>
            </div>

          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-base font-normal text-gray-900 mt-2 sm:mt-0">Your Photo</h3>
            <p className="text-sm text-gray-500 mb-2">This will be displayed on your profile</p>
          </div>
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
                  onChange : ()=>setDisable(false)
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
                  onChange : ()=>setDisable(false)
                })}
                className="w-full"
                placeholder="Enter your last name"
              />
              {errors.lastName && <p className="text-sm text-red-600">{errors.lastName?.message}</p>}
            </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              
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
                    setDisable(false)
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


              <div className="w-full ">
            <label htmlFor="dateOfBirth" className="text-base font-normal text-gray-900 block mb-1">
              Date of Birth
            </label>
            <Input
              id="dateOfBirth"
              type="date"
              {...register("dateOfBirth", {
                onChange: () => setDisable(false)
              })}
              
              className="border-gray-300"
             
            />
          </div>
              
               </div>

       
          </form>
          <div className="grid grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="flex gap-3">
                <div className="flex relative w-full items-center">
                 <Input
                   id="email"
                   type="email"
                
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Please enter a valid email address" },
                  onChange : ()=> {setEmailChange(true) ,setEmailUpdated(true), trigger("email")  , setEmailVerified(false) }
                })}
                className="w-full"
                placeholder="Enter your email"
              />
                {verifiedEmail && (
                <span className="absolute right-3 text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 111.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}

                </div>
              {
                  ((emailChange && emailUpdate && emailWatch != userProfile?.email  ) ) &&  (
                    <p onClick={()=>updateEmail()} className="bg-green-100 text-green-800 px-2 flex justify-center items-center rounded-lg cursor-pointer hover:bg-green-50 duration-300  whitespace-nowrap ">Verify Email</p>
                  )
                }
              </div>
              
              {errors.email && <p className="text-sm text-red-600">{errors.email?.message}</p>}
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Mobile Number</Label>
              <div className="flex gap-3">
                <Input
                  disabled={!phoneLoading}
                  type="number"
                  {...register("mobileNumber" , {
                    required: "Mobile number is required",
                    pattern: { value: /^[0-9]{11}$/, message: "Please enter a valid mobile number" },
                    onChange : ()=> {setPhoneChange(true),setPhoneUpdated(true), trigger("mobileNumber")}
                  })}
                  className="flex-1"
                  placeholder="e.g. 03421764532"
                />
                {
                  ((phoneChange && phoneLength.length == 11 && phoneUpdate && phoneLength != userProfile.phone ) ) &&  (
                    <p onClick={()=>updatePhone()} className="bg-green-100 text-green-800 px-2 flex justify-center items-center rounded-lg cursor-pointer hover:bg-green-50 duration-300  ">Update Phone</p>
                  )
                }

              </div>
              {errors.mobileNumber && <p className="text-sm text-red-600">{errors.mobileNumber?.message}</p>}
            </div>

          </div>


            {/* Update Profile Button */}
            <div className="flex justify-between items-center gap-4">
            <Button
             type="button"
             onClick={()=>{formRef?.current?.reset()}}
              disabled={isSubmitting}
              className="w-full dark_blue_color py-3 mt-6"
            >
             Reset 
            </Button>

            <Button
              type="submit"
              form={formRef.current.id}
              disabled={disable}
              className="w-full orange_color py-3 mt-6"
            >
              {isSubmitting ? "Updating..."  : "Update"}
            </Button>
            </div>
        </CardContent>
      </Card>
      }
    </div>
  )
}
