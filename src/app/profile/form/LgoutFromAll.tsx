"use client"

// -----------------------------
// Imports
// -----------------------------
import { useState } from "react"
import { useForm } from "react-hook-form"

import Cookies from "js-cookie"


import { Button } from "@/components/ui/button"

import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"


import { formatDateByPattern } from "@/lib/utils"
import { useCartContext } from "@/context/context"
import { toast } from "sonner"
import { apiClient } from "@/lib/api"

// -----------------------------
// Types
// -----------------------------
interface PasswordForm {
  includeMe: string 
}

// -----------------------------
// ChangePassword Component
// -----------------------------
export default function LogOut({data } : {data? : any}) {
  // -----------------------------
  // State
  // -----------------------------
  const {  dateFormat , setUser } = useCartContext()
//   const queryclient = useQueryClient();
  const [open, setOpen] = useState(false);

  
  // -----------------------------
  // Form Setup
  // -----------------------------
  const {
    register,
    handleSubmit,
    watch ,
    reset,
    formState: {  isSubmitting },
  } = useForm<PasswordForm>({
    defaultValues: {
      includeMe: "true", // default as string, will be converted by setValueAs
    },
  })

  // -----------------------------
  // Effects
  // -----------------------------
  // // Redirect to login if not logged in
  // useEffect(() => {
  //   if (!Cookies.get("user")) {
  //     router.navigate({ to: "/" })
  //   }
  // }, [])

  // -----------------------------
  // Handlers
  // -----------------------------
  const onSubmit = async (data: PasswordForm) => {
    await toast.promise(
      apiClient.post("/auth/customer/logout/all-devices", {
        includeMe : data.includeMe === "true" ? true : false
      }),
      {
        loading: "Logging out...",
        success: () => {
          reset();
          setOpen(false);
          if(data.includeMe == "true"){
            Cookies.remove("accessToken", { path: "/" });
            Cookies.remove("refreshToken", { path: "/" });
            Cookies.remove("userData" , {path : "/"});
            localStorage.removeItem("defaultAddress")
            setUser({});
            window.location.href = "/"
            
          }
          return "Logged out successfully.";
        },
        error: (err : any) =>
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to logout.",
      }
    );
  }




  // -----------------------------
  // Render
  // -----------------------------
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      if (isSubmitting) return;
      setOpen(nextOpen);
    }}>

      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <div className="flex-shrink-0">
          <DialogTrigger asChild>
            <Button className="bg-red-500 text-white cursor-pointer px-6 py-2" onClick={() => setOpen(true)}>
              Logout from all devices 
            </Button>
          </DialogTrigger>
        </div>
      </div>
      <DialogContent className="sm:max-w-[500px] p-4 descriptionModal">
        <DialogHeader>
          <DialogTitle className="sr-only">
            Logout
            {
             data && (
                <span className="text-[0.8em] font-normal ml-[0.4em]">(last Updated:{formatDateByPattern(data , dateFormat)})</span>
              )
            }
          </DialogTitle>
          <DialogDescription className="sr-only">
            This action will logout you from all of you devices.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
          {/* Include Me radio select */}
          <div>
            <Label className="block text-slate-700 mb-1">Include Me</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1">
               <input
                 type="radio"
                 value="true"
                 {...register("includeMe", {
                   setValueAs: v => v === "true",
                 })}
                 checked={watch("includeMe") === "true"}
               />
               
                               Yes
                             </label>
                             <label className="flex items-center gap-1">
                               <input
                 type="radio"
                 value="false"
                 {...register("includeMe", {
                   setValueAs: v => v === "true",
                 })}
                 checked={watch("includeMe") === "false"}
               />

                No
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            
              <Button type="button" onClick={()=>setOpen(false)} className="dark_blue_color flex-1" variant="outline" disabled={isSubmitting}>Cancel</Button>
           
            <Button className="orange_color flex-1" type="submit">
              Proceed
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
