"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { MapPin, Home, Building2, Globe,  Loader2, XIcon } from "lucide-react"
import { useCartContext } from "@/context/context"
import { useForm } from "react-hook-form"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { designVar } from "@/designVar/desighVar"
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { VisuallyHidden } from "@/components/ui/visually-hidden"


import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from "leaflet"
import 'leaflet/dist/leaflet.css';
import { useMapEvents } from 'react-leaflet';



type AddressFormProps = {
  line1: string;
  line2: string;
  city: string;
  country: string;
}

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});


function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
}


export default function UpdateAddress({id , onClose } : {id : string , onClose : ()=>void}) {
  const {setNewAddress , user , setAuthOpen} = useCartContext();
 
  const {register , handleSubmit , reset , formState: {errors}} = useForm({
    defaultValues : {
      country : "Pakistan",
      city : "",
      line1 : "",
      line2 : ""
    }
  });
  const [loading , setLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(true);
  const [updating , setUpdating] = useState<boolean>(false);
  const [lat , setLat] = useState(32.05233033402139)
  const [lng , setLng] = useState( 72.91958169612704);

  const GetAddress = async () => {
    setLoading(true);

    try {
        const res = await apiClient.get(`/address/${id}`);
      if (res.status === 200 || res.status === 201) {
        const addressData = res.data.data;
       
        
        reset({
          line1: addressData.line1 || "",
          line2: addressData.line2 || "",
          city: addressData.city || "",
          country: addressData.country || "",
        });

        setLat(addressData?.lat)
        setLng(addressData?.lon)
  
      }
    } catch (error) {
        toast.error("Something went wrong"),
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (data: AddressFormProps) => {
    if(!lat || !lng){
      toast.error("Please select location from map or enter it manually.")
      return 
    }


    const payload = {
      ...data,
      lat : lat,
      lon : lng,
    }
   
    setUpdating(true);
    const promise = apiClient.put(`/address/${id}`, payload);
  
    toast.promise(promise, {
      loading: "Updating address...",
      success: "Address updated successfully",
      error: "Failed to update address",
    });
  
    try {
      const res = await promise;
  
      if (res.status === 200 || res.status === 201) {
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
        setNewAddress(false);
        setUpdating(false);
        onClose(),
        reset();
      }
    } catch (error) {
      toast.error("Fail to update address.");
      setUpdating(false);
    } finally {
    setUpdating(false)
    }
  };

useEffect(()=>{
   if(id){
    GetAddress();
   }
},[id])



  // Inline click handler
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        setLat(e.latlng.lat);
        setLng(e.latlng.lng);
      },
    });
    return null;
  }



  return (
    <Dialog open={open} onOpenChange={setOpen}>
     
       <DialogContent  className="w-[90%] sm:w-[30em] max-w-full h-max max-h-[90vh] flex flex-col px-5 sm:py-6 gap-0 rounded-xl border-0 descriptionModal overflow-y-scroll">
      <DialogHeader>
        <DialogTitle asChild>
          <VisuallyHidden>Address Form</VisuallyHidden>
        </DialogTitle>
      </DialogHeader>


     {
        loading ? <div className="space-y-6 w-full p-[1em] animate-pulse">
        {/* Circle Icon */}
        <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full shadow-lg" />
    
        {/* Title */}
        <div className="h-6 w-2/3 mx-auto bg-gray-200 rounded" />
    
        {/* Field Skeletons */}
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="space-y-2">
            <div className="h-4 w-1/3 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>
        ))}
    
        {/* Button Skeleton */}
        <div className="h-10 w-full bg-gray-200 rounded" />
      </div> :   <form className="space-y-7 w-full p-[1em]" onSubmit={handleSubmit(addAddress as any)}>


<div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
      <MapPin className="w-8 h-8 text-white" />
     </div>
  <div className="flex items-center justify-between"> 
    <h2 className={`text-[1em] sm:text-[1.5em]  font-semibold text-center w-full text-gray-800 ${designVar.fontFamily}`}>
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
    readOnly
    placeholder="Country"
    {...register("country" , {required: true, minLength: {value: 3, message: "Country must be at least 3 characters long"}})}
    className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 hover:border-orange-300"
  />
  {errors?.country && typeof errors.country.message === 'string' && <p className="text-red-500 mt-[0.2em]">{errors.country.message}</p>}
</div>


<MapContainer
            center={[lat, lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: '300px', width: '100%', borderRadius: '0.5rem' }}
          >
           <TileLayer
             url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
             attribution="Tiles © Esri"
           />
           <TileLayer
             url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
             attribution="Labels © Esri"
           />

            <MapUpdater lat={lat} lng={lng} />
            <MapClickHandler />
            <Marker position={[lat, lng]} icon={defaultIcon} />
          </MapContainer>



          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* Latitude */}
  <div>
    <Label htmlFor="latitude" className="text-gray-700 font-medium">Latitude</Label>
    <Input
      id="latitude"
      type="number"
      step="any"
      value={lat}
      onChange={(e) => setLat(parseFloat(e.target.value))}
      placeholder="Enter latitude"
      className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20"
    />
  </div>

  {/* Longitude */}
  <div>
    <Label htmlFor="longitude" className="text-gray-700 font-medium">Longitude</Label>
    <Input
      id="longitude"
      type="number"
      step="any"
      value={lng}
      onChange={(e) => setLng(parseFloat(e.target.value))}
      placeholder="Enter longitude"
      className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20"
    />
  </div>
</div>


<Button
  disabled={updating}
  type="submit"
  className={`${designVar.widthFullButton.width} ${designVar.widthFullButton.registerButton.backgroundColor} ${designVar.widthFullButton.registerButton.borderRadius} ${designVar.widthFullButton.registerButton.paddingX} ${designVar.widthFullButton.registerButton.paddingY} ${designVar.widthFullButton.registerButton.fontSize} ${designVar.widthFullButton.registerButton.fontWeight} ${designVar.widthFullButton.registerButton.color} ${designVar.widthFullButton.registerButton.cursor} ${designVar.widthFullButton.registerButton.transition} ${designVar.widthFullButton.registerButton.hover.backgroundColor} ${designVar.widthFullButton.registerButton.hover.borderRadius} ${designVar.widthFullButton.registerButton.hover.color} ${designVar.widthFullButton.registerButton.hover.color} ${designVar.widthFullButton.registerButton.hover.backgroundColor} ${designVar.widthFullButton.textSize}`}
>
  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Address"}
</Button>
</form>
               
     }
     
     
    
      <DialogClose onClick={()=>{setOpen(false),onClose()}} disabled={loading} className="bg-black/80 p-1 rounded-xl text-white right-2 top-2 sm:right-2 sm:top-2">
        <XIcon className="w-6 h-6" />
      </DialogClose>
    </DialogContent>
  </Dialog>
  )
}
