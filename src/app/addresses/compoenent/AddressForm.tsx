"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MapPin, Home, Building2, Globe,  Cross, Loader2, XIcon } from "lucide-react"
import { useCartContext } from "@/context/context"
import { useForm } from "react-hook-form"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { designVar } from "@/designVar/desighVar"
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { VisuallyHidden } from "@/components/ui/visually-hidden"


type AddressFormProps = {
  line1: string;
  line2: string;
  city: string;
  country: string;
}

export default function AddressForm() {
  const {setNewAddress} = useCartContext();
  const {register , handleSubmit , formState: {errors}} = useForm({
    defaultValues : {
      country : "Pakistan",
      city : "",
      line1 : "",
      line2 : ""
    }
  });
  const [loading , setLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const addAddress = async (data: AddressFormProps) => {
    setLoading(true);
  
    const promise = apiClient.post("/address/add", data);
  
    toast.promise(promise, {
      loading: "Adding address...",
      success: "Address added successfully",
      error: "Failed to add address",
    });
  
    try {
      const res = await promise;
  
      if (res.status === 200 || res.status === 201) {
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
        setNewAddress(false);
        setOpen(false);
      }
    } catch (error) {
      console.error("Address adding failed:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };



  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button
        variant="outline"
        className={
          `${designVar.authButton.backgroundColor} ${designVar.authButton.borderRadius} ${designVar.authButton.paddingX} ${designVar.authButton.paddingY} ${designVar.authButton.fontSize} ${designVar.authButton.fontWeight} ${designVar.authButton.color} ${designVar.authButton.cursor} ${designVar.authButton.transition} ${designVar.authButton.hover.backgroundColor} ${designVar.authButton.hover.borderRadius} ${designVar.authButton.hover.color} ${designVar.authButton.hover.color} ${designVar.authButton.hover.backgroundColor}`
        }
      >
        Add Address
      </Button>
    </DialogTrigger>
       <DialogContent  className="w-[80%] sm:w-[30em] max-w-full h-max max-h-[39em] flex flex-col px-5 py-6 gap-0 rounded-xl border-0 descriptionModal">
      <DialogHeader>
        <DialogTitle asChild>
          <VisuallyHidden>Authentication</VisuallyHidden>
        </DialogTitle>
      </DialogHeader>



      <form className="space-y-7 w-full p-[1em]" onSubmit={handleSubmit(addAddress as any)}>


      <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
            <MapPin className="w-8 h-8 text-white" />
           </div>
        <div className="flex items-center justify-between"> 
          <h2 className={`text-[1.5em]  font-semibold text-center w-full text-gray-800 ${designVar.fontFamily}`}>
            Address Information
          </h2>
        </div>

       <div className="space-y-2">
         <Label htmlFor="line1" className={`text-gray-700 font-medium flex items-center gap-2 ${designVar.fontFamily}`}>
           <Home className="w-4 h-4 text-orange-500" />
           Address Line 1 *
         </Label>
         <Input
           id="line1"
           {...register("line1" , {required: true, minLength: {value: 3, message: "Address must be at least 3 characters long"}})}
           placeholder="123 Main Street"
         
          className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 hover:border-orange-300"
        />
        {errors?.line1 && typeof errors.line1.message === 'string' && <p className="text-red-500 mt-[0.2em]">{errors.line1.message}</p>}
      </div>
 
      <div className="space-y-2">
        <Label htmlFor="line2" className={`text-gray-700 font-medium flex items-center gap-2 ${designVar.fontFamily}`}>
          <Building2 className="w-4 h-4 text-orange-500" />
          Address Line 2
        </Label>
        <Input
          id="line2"
          {...register("line2" , {minLength: {value: 3, message: "Address must be at least 3 characters long"}})}
          placeholder="Apartment, suite, etc. (optional)"
          className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 hover:border-orange-300"
        />
        {errors?.line2 && typeof errors.line2.message === 'string' && <p className="text-red-500 mt-[0.2em]">{errors.line2.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="city" className={`text-gray-700 font-medium flex items-center gap-2 ${designVar.fontFamily}`}>
          <MapPin className="w-4 h-4 text-orange-500" />
          City *
        </Label>
        <Input
          id="city"
          placeholder="New York"
          {...register("city" , {required: true, minLength: {value: 3, message: "City must be at least 3 characters long"}})}
          className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 hover:border-orange-300"
        />
        {errors?.city && typeof errors.city.message === 'string' && <p className="text-red-500 mt-[0.2em]">{errors.city.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="country" className={`text-gray-700 font-medium flex items-center gap-2 ${designVar.fontFamily}`}>
          <Globe className="w-4 h-4 text-orange-500" />
          Country *
        </Label>
        <Input
          id="country"
          disabled
          placeholder="Country"
          {...register("country" , {required: true, minLength: {value: 3, message: "Country must be at least 3 characters long"}})}
          className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 hover:border-orange-300"
        />
        {errors?.country && typeof errors.country.message === 'string' && <p className="text-red-500 mt-[0.2em]">{errors.country.message}</p>}
      </div>

      <Button
        disabled={loading}
        type="submit"
        className={`${designVar.widthFullButton.width} ${designVar.widthFullButton.registerButton.backgroundColor} ${designVar.widthFullButton.registerButton.borderRadius} ${designVar.widthFullButton.registerButton.paddingX} ${designVar.widthFullButton.registerButton.paddingY} ${designVar.widthFullButton.registerButton.fontSize} ${designVar.widthFullButton.registerButton.fontWeight} ${designVar.widthFullButton.registerButton.color} ${designVar.widthFullButton.registerButton.cursor} ${designVar.widthFullButton.registerButton.transition} ${designVar.widthFullButton.registerButton.hover.backgroundColor} ${designVar.widthFullButton.registerButton.hover.borderRadius} ${designVar.widthFullButton.registerButton.hover.color} ${designVar.widthFullButton.registerButton.hover.color} ${designVar.widthFullButton.registerButton.hover.backgroundColor}`}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Address"}
      </Button>
      </form>
     
    
      <DialogClose onClick={()=>setOpen(false)} disabled={loading} className="bg-black/80 p-1 rounded-xl text-white right-2 top-2 sm:right-2 sm:top-2">
        <XIcon className="w-6 h-6" />
      </DialogClose>
    </DialogContent>
  </Dialog>
  )
}
