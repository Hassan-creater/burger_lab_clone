"use client"

import { useEffect, useState } from "react"
import { ChevronDown, MapPin, X, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose,  DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiClientCustomer } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { useCartContext } from "@/context/context"
import { VisuallyHidden } from "../ui/visually-hidden"
import { designVar } from "@/designVar/desighVar"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

// Dummy data


const orderTypes = [
  { name: "DELIVERY", value: "delivery" },
  { name: "PICK-UP", value: "pickup" },
  { name: "DINE-IN", value: "dine_in" },
]

export default function LocationModal() {
  const [selectedOrderType, setSelectedOrderType] = useState("delivery")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedArea, setSelectedArea] = useState("")
  const [selectedPickupBranch, setSelectedPickupBranch] = useState("")
  const [selectedDineInBranch, setSelectedDineInBranch] = useState("")
  const {UpdateAddressData , AddressData , dineInClose , setDineInClose , pickupClose , setPickupClose , deliveryClose , setDeliveryClose } = useCartContext();
  const [open, setOpen] = useState(false)

  const handleSelect = () => {
    const AddressData =  {
      orderType: selectedOrderType,
      city: selectedCity,
      ...(selectedOrderType === "delivery" && { area: selectedArea , 
        tax : deliveryBranch?.tax,
        branchId : deliveryBranch?.branchId,
        openTime :   convertTo12HourFormat(deliveryBranch?.openTime) || "",
        endTime : convertTo12HourFormat(deliveryBranch?.endTime) || "",
        supportEmail : deliveryBranch?.supportEmail,
        address : deliveryBranch?.address || "",
        contactPhone : deliveryBranch?.contactPhone
       }),
      ...(selectedOrderType === "pickup" && { branch: selectedPickupBranch ,
        openTime :   convertTo12HourFormat(selectedPickupBranchData?.openTime) || "",
        endTime : convertTo12HourFormat(selectedPickupBranchData?.endTime) || "",
        address : selectedPickupBranchData?.address || "",
        tax : selectedPickupBranchData?.tax,
        supportEmail : selectedPickupBranchData?.supportEmail,
        branchId : selectedPickupBranchData?.id,
        contactPhone : selectedPickupBranchData?.contactPhone

        
       }),
      ...(selectedOrderType === "dine_in" && {
        branch: selectedDineInBranch,
        openTime :   convertTo12HourFormat(selectedDineInBranchData?.openTime) || "",
        endTime : convertTo12HourFormat(selectedDineInBranchData?.endTime) || "",
        address : selectedDineInBranchData?.address || "",
        tax : selectedDineInBranchData?.tax,
        supportEmail : selectedDineInBranchData?.supportEmail,
        branchId : selectedDineInBranchData?.id,
        contactPhone : selectedDineInBranchData?.contactPhone
       
      })
      
    }

   
    UpdateAddressData(AddressData);
    setOpen(false)
  }


  function convertTo12HourFormat(time24: string): string {
    if (!time24) return "";
    
    // Parse the time string (HH:mm:ss or HH:mm)
    const [hourStr, minuteStr] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr?.padStart(2, "0") || "00";
    
    // Convert to UTC+5 (Pakistan time)
    hour = (hour + 5) % 24;
    
    // Convert to 12-hour format
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    
    return `${hour}:${minute} ${ampm}`;
  }


  function isBranchOpen(branch: { openTime: string; endTime: string }): boolean {
    if (!branch) return false;
  
    const now = new Date();
    // Get current time in UTC+5 (Pakistan time)
    const pakistanTime = new Date(now.getTime() + (5 * 60 * 60 * 1000));
    const currentMinutes = pakistanTime.getUTCHours() * 60 + pakistanTime.getUTCMinutes();
    
  
    // Parse "HH:mm(:ss)" but take only hours & minutes
    const [oH, oM] = branch?.openTime?.split(":").map(Number) || [];
    const [cH, cM] = branch?.endTime?.split(":").map(Number) || [];
  
    // Convert to UTC+5
    const openMinutes  = ((oH + 5) % 24) * 60 + oM;
    const closeMinutes = ((cH + 5) % 24) * 60 + cM;
  
    const isOvernight = closeMinutes <= openMinutes;
  
    if (isOvernight) {
      // e.g. 13:37 → 01:37 next day
      return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
    } else {
      // e.g. 09:00 → 17:00 same day
      return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
    }
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Current location:", position.coords)
          alert("Using current location!")
          setSelectedCity("Karachi") // Mock setting city based on location
        },
        (error) => {
          console.error("Error getting location:", error)
          alert("Unable to get current location")
        },
      )
    } else {
      alert("Geolocation is not supported by this browser")
    }
  }

  // const getOptionsForCity = (city: string) => {
  //   if (!city || !dummyData.branches[city as keyof typeof dummyData.branches]) return []

  //   const cityData = dummyData.branches[city as keyof typeof dummyData.branches]
  //   return selectedOrderType === "delivery" ? cityData.delivery_areas : cityData.branches
  // }

  const getPlaceholderText = () => {
    switch (selectedOrderType) {
      case "delivery":
        return "Select Area / Sub Region"
      case "pickup":
        return "Select Branch"
      case "dine_in":
        return "Select Branch"
      default:
        return "Select Option"
    }
  }

  const getModalTitle = () => {
    switch (selectedOrderType) {
      case "delivery":
        return "Where should we deliver your order?"
      case "pickup":
        return "Which branch would you like to pick up from?"
      case "dine_in":
        return "Which outlet would you like to dine-in at?"
      default:
        return "Select your preference"
    }
  }

  // Function to get current tab value
  const getCurrentTabValue = () => {
    return selectedOrderType;
  }

  function utcTimeToLocalTimeString(utcTimeStr : string) {
    if (!utcTimeStr) return "";
    
    // Parse the UTC time string
    const [hours, minutes] = utcTimeStr.split(":").map(Number);
    
    // Convert UTC to UTC+5 (Pakistan time)
    let pakistanHour = (hours + 5) % 24;
    
    // Convert to 12-hour format
    const ampm = pakistanHour >= 12 ? "PM" : "AM";
    pakistanHour = pakistanHour % 12 || 12; // Convert 0 to 12 for 12 AM
    
    const formattedMinutes = minutes.toString().padStart(2, "0");
    
    return `${pakistanHour}:${formattedMinutes} ${ampm}`;
  }


  function isAreaOpen(openTime : string, closeTime : string) {
    if (!openTime || !closeTime) return false;
    
    // Get current time in UTC+5 (Pakistan time)
    const now = new Date();
    const pakistanTime = new Date(now.getTime() + (5 * 60 * 60 * 1000));
    const currentMinutes = pakistanTime.getUTCHours() * 60 + pakistanTime.getUTCMinutes();
    
    // Parse opening and closing times
    const [oh, om] = openTime.split(":").map(Number);
    const [ch, cm] = closeTime.split(":").map(Number);
    
    // Convert to UTC+5
    const openMinutes = ((oh + 5) % 24) * 60 + om;
    const closeMinutes = ((ch + 5) % 24) * 60 + cm;
    
    const isOvernight = closeMinutes <= openMinutes;
    
    if (isOvernight) {
      // e.g. 13:37 → 01:37 next day
      return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
    } else {
      // e.g. 09:00 → 17:00 same day
      return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
    }
  }

  const getAllBranches = async ()=>{
    const res = await apiClientCustomer.get("/branch/view/customer");
    return res.data.data?.branches;
  }

  const {data}= useQuery({
    queryKey : ["branches"],
    queryFn : getAllBranches,
    staleTime : 1000 * 60 * 60,
  })


 

 
// delivery areas
  const cities = data?.cities || [];
  const areas = data?.deliveryAreas || [];
  const city = areas.find((item: any) => item.city === selectedCity) || [];
  const area = city.areas || [];
  const deliveryAreas : any[] =  area.map((item: any) => item.areaName) || [];
  const areaInfo = area.find((a: any) => a.areaName === selectedArea)  || {};
  const deliveryBranch = areaInfo?.branch;
  const isDeliveryOpen = deliveryBranch?.isSpecialClosed;


 


  useEffect(() => {
    if(deliveryBranch?.openTime && deliveryBranch?.endTime){
    if(!isBranchOpen(deliveryBranch)){
      const openTime = convertTo12HourFormat(deliveryBranch?.openTime);
      const closeTime = convertTo12HourFormat(deliveryBranch?.endTime);
      setDeliveryClose(`Branch is closed. It will open at ${openTime} and close at ${closeTime}.`);
    }else{
        setDeliveryClose("");
      }
    }else{
      if(isDeliveryOpen){
        setDeliveryClose(deliveryBranch?.specialClosedMessage);
      }else{
        setDeliveryClose("");
      }
    }
  }, [isDeliveryOpen]);

  

 
  
  

  // pickup branches data 
  const pickupBranches = data?.takeAwayBranches
  || [];
  const branchNames = pickupBranches?.find((item: any) => item.city === selectedCity)?.branches.map((branch: any) => branch.name) || [];

  const allPickupBranches = pickupBranches?.flatMap((item: any) => item.branches);
  const selectedPickupBranchData = allPickupBranches?.find(
    (branch: any) => branch.name === selectedPickupBranch
  );




  // dine in branches data 
  const dineInBranches = data?.dineInBranches || [];
  const dineInBranchNames = dineInBranches?.find((item: any) => item.city === selectedCity)?.branches.map((branch: any) => branch.name) || [];

  const allDineInBranches = dineInBranches?.flatMap((item: any) => item.branches);
const selectedDineInBranchData = allDineInBranches?.find(
  (branch: any) => branch.name === selectedDineInBranch
);

const isClose = selectedDineInBranchData?.isSpecialClosed;

useEffect(() => {
  if (isClose) {
    setDineInClose(selectedDineInBranchData?.specialClosedMessage);
  }else{
    setDineInClose("");
  }
}, [isClose]);

useEffect(() => {
  if (selectedPickupBranchData) {
    if (selectedPickupBranchData.isSpecialClosed) {
      setPickupClose(selectedPickupBranchData.specialClosedMessage);
    } else if (!isBranchOpen(selectedPickupBranchData)) {
      const openTime12 = convertTo12HourFormat(selectedPickupBranchData.openTime);
      const closeTime12 = convertTo12HourFormat(selectedPickupBranchData.endTime);
      setPickupClose(`Branch is closed. It will open at ${openTime12} and close at ${closeTime12}.`);
    } else {
      setPickupClose(""); // Clear the message if open
    }
  } else {
    setPickupClose(""); // Clear if no branch selected
  }
}, [selectedPickupBranchData]);



useEffect(() => {
  if(AddressData){
    setSelectedOrderType(AddressData?.orderType);
    if(AddressData?.orderType == "delivery"){
      setSelectedCity(AddressData?.city);
      setSelectedArea(AddressData?.area);
    }else if(AddressData?.orderType == "pickup"){
      setSelectedCity(AddressData?.city);
      setSelectedPickupBranch(AddressData?.branch);
    }else if(AddressData?.orderType == "dine_in"){
      setSelectedCity(AddressData?.city);
      setSelectedDineInBranch(AddressData?.branch);
    }
  }
}, [AddressData]);



 
/// open pop up

// dine in close
useEffect(() => {
  if(selectedDineInBranchData){
    if(!isBranchOpen(selectedDineInBranchData)){
      const openTime12 = convertTo12HourFormat(selectedDineInBranchData.openTime);
      const closeTime12 = convertTo12HourFormat(selectedDineInBranchData.endTime);
      setDineInClose(`Branch is closed. It will open at ${openTime12} and close at ${closeTime12}.`);
    }
  }

}, [selectedDineInBranchData]);


useEffect(() => {
  if (!AddressData.orderType) {
    setOpen(true)
  } else {
    setOpen(false)
    if(AddressData?.orderType == "delivery" && orderTypes.find((item: any) => item.value == AddressData?.orderType)){
      setSelectedCity(AddressData?.city);
      setSelectedArea(AddressData?.area);
    }else if(AddressData?.orderType == "pickup" && orderTypes.find((item: any) => item.value == AddressData?.orderType)){
      setSelectedCity(AddressData?.city);
      setSelectedPickupBranch(AddressData?.branch);
    }else if(AddressData?.orderType == "dine_in" && orderTypes.find((item: any) => item.value == AddressData?.orderType)){
      setSelectedCity(AddressData?.city);
    }
  }
  setDeliveryClose("")
  setDineInClose("")
  setPickupClose("")
}, [orderTypes])


const pathname = usePathname();


const isButtonDisabled =
  !Boolean(selectedCity) ||
  !Boolean(selectedArea || selectedDineInBranch || selectedPickupBranch)
 




  return (

<Dialog open={pathname.includes("/auth/update-verification/") ? false : open} onOpenChange={setOpen}>
<DialogTrigger asChild>
  <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-orange-500">
    <MapPin className="w-6 h-6 text-orange-500" />
    <div className="text-sm text-black flex flex-col justify-start items-start hover:text-orange-500 hover:underline duration-300 text-[14px]">
    <p
  className={cn(
    "font-bold text-[0.7em] sm:text-[1em]",
    "truncate max-w-[80%] overflow-hidden whitespace-nowrap",
    window.innerWidth < 500 ? "block" : "w-auto"
  )}
>
  {AddressData?.orderType
    ? `${AddressData.orderType.charAt(0).toUpperCase() + AddressData.orderType.slice(1)} location`
    : "Select your desired"}
</p>

<p
  className={cn(
    "flex items-center gap-2 hover:underline duration-300 text-[0.6em] sm:text-[12px]",
    "truncate max-w-[70%] overflow-hidden whitespace-nowrap"
  )}
>
  {!AddressData?.orderType
    ? "Location"
    : AddressData?.area
    ? AddressData.area
    : AddressData?.branch}
  <ChevronDown className="w-4 h-4" />
</p>

    </div>
    
  </button>
</DialogTrigger>
  <DialogContent className="w-[80%] sm:w-[30em] justify-center items-center flex flex-col px-5 py-6 gap-[1em] rounded-xl border-0 descriptionModal">
    <DialogHeader>
      <DialogTitle asChild>
        <VisuallyHidden>Location</VisuallyHidden>
      </DialogTitle>
    </DialogHeader>

    <div className="w-36 h-20  p-2 rounded-lg bg-gradient-to-br flex items-center justify-center">
      <img src="/blueLogo.png" alt="logo" className="w-full h-full object-contain scale-[1.1]" />
    </div>

    {dineInClose && (
      <div className="w-full bg-red-500 text-white p-2 rounded-md text-center">
        {dineInClose}
      </div>
    )}
    {pickupClose && (
      <div className="w-full bg-red-500 text-white p-2 rounded-md text-center">
        {pickupClose}
      </div>
    )}
    {deliveryClose && (
      <div className="w-full bg-red-500 text-white p-2 rounded-md text-center">
        {deliveryClose}
      </div>
    )}

    <h3 className="text-xl text-gray-900 font-bold text-center">Select your order type</h3>

    <Tabs
      value={selectedOrderType}
      onValueChange={(value) => {
        setSelectedOrderType(value as "delivery" | "pickup" | "dine_in");
        setSelectedCity("");
        setSelectedArea("");
        setSelectedDineInBranch("");
        setDineInClose("");
        setSelectedPickupBranch("");
        setPickupClose("");
        setDeliveryClose("");
      }}
      className="w-full"
    >
      <TabsList className="bg-gray-100 flex gap-1 mb-6 w-full rounded-md">
        {orderTypes.map(({ name, value }) => (
          <TabsTrigger
            key={value}
            value={value}
            onClick={() => {
              if(AddressData?.orderType){
              if(value == "delivery" && AddressData?.orderType == "delivery"){
                setSelectedCity(AddressData?.city);
                setSelectedArea(AddressData?.area);
              }else if(value == "pickup" && AddressData?.orderType == "pickup"){
                setSelectedCity(AddressData?.city);
                setSelectedPickupBranch(AddressData?.branch);
              }else if(value == "dine_in" && AddressData?.orderType == "dine_in"){
                setSelectedCity(AddressData?.city);
                setSelectedDineInBranch(AddressData?.branch);
              }
              }else{
                setSelectedCity("");
                setSelectedArea("");
                setSelectedDineInBranch("");
                setDineInClose("");
                setSelectedPickupBranch("");
              }
            }}
            className="flex-1 py-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white text-gray-600 font-semibold rounded-md transition-all"
          >
            {name}
          </TabsTrigger>
        ))}
      </TabsList>

      {orderTypes.map(({ value }) => (
        <TabsContent key={value} value={value} className="w-full flex flex-col gap-4 mt-0">
          <h4 className="text-lg font-semibold text-gray-800 text-center">{getModalTitle()}</h4>

          <Button
            variant="outline"
            onClick={handleUseCurrentLocation}
            className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Use Current Location
          </Button>

          {/* City Selection */}
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-full focus:ring-orange-500 focus:ring-offset-0 border-gray-200">
              <SelectValue placeholder="Select City / Region" />
            </SelectTrigger>
            <SelectContent>
              {cities?.map((city: any) => (
                <SelectItem key={city} value={city} className="text-black">
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Show only one dropdown based on selected order type */}
          {(() => {
            if (selectedOrderType === "delivery") {
              return (
                <Select
                  value={selectedArea}
                  onValueChange={setSelectedArea}
                  disabled={!selectedCity}
                >
                  <SelectTrigger className="w-full focus:ring-orange-500 focus:ring-offset-0 border-gray-200">
                    <SelectValue placeholder={getPlaceholderText()} />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryAreas?.map((option: any) => (
                      <SelectItem key={option} value={option} className="text-black">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }

            if (selectedOrderType === "pickup") {
              return (
                <Select
                  value={selectedPickupBranch}
                  onValueChange={setSelectedPickupBranch}
                  disabled={!selectedCity}
                >
                  <SelectTrigger className="w-full focus:ring-orange-500 focus:ring-offset-0 border-gray-200">
                    <SelectValue placeholder={getPlaceholderText()} />
                  </SelectTrigger>
                  <SelectContent>
                    {branchNames?.map((option: any) => (
                      <SelectItem key={option} value={option} className="text-black">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }

            if (selectedOrderType === "dine_in") {
              return (
                <Select
                  value={selectedDineInBranch}
                  onValueChange={setSelectedDineInBranch}
                  disabled={!selectedCity}
                >
                  <SelectTrigger className="w-full focus:ring-orange-500 focus:ring-offset-0 border-gray-200">
                    <SelectValue placeholder={getPlaceholderText()} />
                  </SelectTrigger>
                  <SelectContent>
                    {dineInBranchNames?.map((option: any) => (
                      <SelectItem key={option} value={option} className="text-black">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }

            return null;
          })()}
        </TabsContent>
      ))}
    </Tabs>

    <Button
      className={`${designVar.widthFullButton.width} ${designVar.widthFullButton.registerButton.backgroundColor} ${designVar.widthFullButton.registerButton.borderRadius} ${designVar.widthFullButton.registerButton.paddingX} ${designVar.widthFullButton.registerButton.paddingY} ${designVar.widthFullButton.registerButton.fontSize} ${designVar.widthFullButton.registerButton.fontWeight} ${designVar.widthFullButton.registerButton.color} ${designVar.widthFullButton.registerButton.cursor} ${designVar.widthFullButton.registerButton.transition} ${designVar.widthFullButton.registerButton.hover.backgroundColor} ${designVar.widthFullButton.registerButton.hover.borderRadius} ${designVar.widthFullButton.registerButton.hover.color} ${designVar.widthFullButton.registerButton.hover.color} ${designVar.widthFullButton.registerButton.hover.backgroundColor}`}
      disabled={isButtonDisabled}
      onClick={handleSelect}
    >
      Select
    </Button>


    {
      AddressData?.orderType && (
        <button
        onClick={() =>  setOpen(false)}
        className={`absolute ${AddressData.orderType != selectedOrderType ? "hidden" : "block"} top-3 right-3 p-2 bg-gray-500/80 hover:bg-gray-600/80 rounded-full text-white transition-colors`}
      >
        <X className="w-5 h-5" />
    </button>
      )
    }

   
  </DialogContent>
</Dialog>
  )
}

