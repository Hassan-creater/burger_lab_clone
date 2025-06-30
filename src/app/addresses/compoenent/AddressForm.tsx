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
  const {register , handleSubmit} = useForm();
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
    // <div className="min-h-screen absolute top-0 left-0 w-full h-[100dvh] bg-gradient-to-br  bg-[#F8F9FA] flex items-center justify-center p-4">
    //   <Cross onClick={()=>setNewAddress(false)} className="w-4 rotate-45 h-4 text-orange-500 absolute top-4 right-4" />
    //   <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
    //     <CardHeader className="text-center space-y-4 pb-8">
    //       <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
    //         <MapPin className="w-8 h-8 text-white" />
    //       </div>
    //       <div className="space-y-2">
    //         <h1 className={`text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent ${designVar.fontFamily}`}>
    //           Address Information
    //         </h1>
    //         <p className={`text-gray-600 ${designVar.fontFamily}`}>Please enter your address details below</p>
    //       </div>
    //     </CardHeader>

    //     <CardContent className="space-y-6 pb-[1em]">
    //       <form className="space-y-7 w-full px-[1em] bg-red-500" onSubmit={handleSubmit(addAddress as any)}>

    //       <div className="space-y-2">
    //         <Label htmlFor="line1" className={`text-gray-700 font-medium flex items-center gap-2 ${designVar.fontFamily}`}>
    //           <Home className="w-4 h-4 text-orange-500" />
    //           Address Line 1 *
    //         </Label>
    //         <Input
    //           id="line1"
    //           {...register("line1" , {required: true})}
    //           placeholder="123 Main Street"
             
    //           className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 hover:border-orange-300"
    //         />
    //       </div>

    //       <div className="space-y-2">
    //         <Label htmlFor="line2" className={`text-gray-700 font-medium flex items-center gap-2 ${designVar.fontFamily}`}>
    //           <Building2 className="w-4 h-4 text-orange-500" />
    //           Address Line 2
    //         </Label>
    //         <Input
    //           id="line2"
    //           {...register("line2")}
    //           placeholder="Apartment, suite, etc. (optional)"
    //           className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 hover:border-orange-300"
    //         />
    //       </div>

    //       <div className="space-y-2">
    //         <Label htmlFor="city" className={`text-gray-700 font-medium flex items-center gap-2 ${designVar.fontFamily}`}>
    //           <MapPin className="w-4 h-4 text-orange-500" />
    //           City *
    //         </Label>
    //         <Input
    //           id="city"
    //           placeholder="New York"
    //           {...register("city" , {required: true})}
    //           className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 hover:border-orange-300"
    //         />
    //       </div>

    //       <div className="space-y-2">
    //         <Label htmlFor="country" className={`text-gray-700 font-medium flex items-center gap-2 ${designVar.fontFamily}`}>
    //           <Globe className="w-4 h-4 text-orange-500" />
    //           Country *
    //         </Label>
    //         {/* <Select required>
    //           <SelectTrigger className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 hover:border-orange-300">
    //             <SelectValue placeholder="Select a country" />
    //           </SelectTrigger>
    //           <SelectContent>
    //             <SelectItem value="us">🇺🇸 United States</SelectItem>
    //             <SelectItem value="ca">🇨🇦 Canada</SelectItem>
    //             <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
    //             <SelectItem value="au">🇦🇺 Australia</SelectItem>
    //             <SelectItem value="de">🇩🇪 Germany</SelectItem>
    //             <SelectItem value="fr">🇫🇷 France</SelectItem>
    //             <SelectItem value="jp">🇯🇵 Japan</SelectItem>
    //             <SelectItem value="in">🇮🇳 India</SelectItem>
    //             <SelectItem value="br">🇧🇷 Brazil</SelectItem>
    //             <SelectItem value="mx">🇲🇽 Mexico</SelectItem>
    //           </SelectContent>
    //         </Select> */}
    //         <Input
    //           id="country"
    //           placeholder="Country"
    //           {...register("country" , {required: true})}
    //           className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 hover:border-orange-300"
    //         />
    //       </div>

    //       <Button
    //         disabled={loading}
    //         type="submit"
    //         className={`${designVar.widthFullButton.width} ${designVar.widthFullButton.registerButton.backgroundColor} ${designVar.widthFullButton.registerButton.borderRadius} ${designVar.widthFullButton.registerButton.paddingX} ${designVar.widthFullButton.registerButton.paddingY} ${designVar.widthFullButton.registerButton.fontSize} ${designVar.widthFullButton.registerButton.fontWeight} ${designVar.widthFullButton.registerButton.color} ${designVar.widthFullButton.registerButton.cursor} ${designVar.widthFullButton.registerButton.transition} ${designVar.widthFullButton.registerButton.hover.backgroundColor} ${designVar.widthFullButton.registerButton.hover.borderRadius} ${designVar.widthFullButton.registerButton.hover.color} ${designVar.widthFullButton.registerButton.hover.color} ${designVar.widthFullButton.registerButton.hover.backgroundColor}`}
    //       >
    //         {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Address"}
    //       </Button>
    //       </form>
         

    //       <div className="text-center ">
    //         <p className={`text-sm text-gray-500 ${designVar.fontFamily}`}>Your information is secure and encrypted</p> 
    //       </div>
    //     </CardContent>
    //   </Card>
    // </div>

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
           {...register("line1" , {required: true})}
           placeholder="123 Main Street"
         
          className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 hover:border-orange-300"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="line2" className={`text-gray-700 font-medium flex items-center gap-2 ${designVar.fontFamily}`}>
          <Building2 className="w-4 h-4 text-orange-500" />
          Address Line 2
        </Label>
        <Input
          id="line2"
          {...register("line2")}
          placeholder="Apartment, suite, etc. (optional)"
          className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 hover:border-orange-300"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city" className={`text-gray-700 font-medium flex items-center gap-2 ${designVar.fontFamily}`}>
          <MapPin className="w-4 h-4 text-orange-500" />
          City *
        </Label>
        <Input
          id="city"
          placeholder="New York"
          {...register("city" , {required: true})}
          className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 hover:border-orange-300"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country" className={`text-gray-700 font-medium flex items-center gap-2 ${designVar.fontFamily}`}>
          <Globe className="w-4 h-4 text-orange-500" />
          Country *
        </Label>
        {/* <Select required>
          <SelectTrigger className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 hover:border-orange-300">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">🇺🇸 United States</SelectItem>
            <SelectItem value="ca">🇨🇦 Canada</SelectItem>
            <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
            <SelectItem value="au">🇦🇺 Australia</SelectItem>
            <SelectItem value="de">🇩🇪 Germany</SelectItem>
            <SelectItem value="fr">🇫🇷 France</SelectItem>
            <SelectItem value="jp">🇯🇵 Japan</SelectItem>
            <SelectItem value="in">🇮🇳 India</SelectItem>
            <SelectItem value="br">🇧🇷 Brazil</SelectItem>
            <SelectItem value="mx">🇲🇽 Mexico</SelectItem>
          </SelectContent>
        </Select> */}
        <Input
          id="country"
          placeholder="Country"
          {...register("country" , {required: true})}
          className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 hover:border-orange-300"
        />
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
