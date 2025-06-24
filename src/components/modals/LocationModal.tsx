"use client"

import { useEffect, useState } from "react"
import { MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiClientCustomer } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { useCartContext } from "@/context/context"

// Dummy data
const dummyData = {
  cities: ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad"],
  branches: {
    Karachi: {
      delivery_areas: ["Gulshan-e-Iqbal", "DHA", "Clifton", "Nazimabad", "North Nazimabad"],
      branches: ["Main Branch Karachi", "DHA Branch", "Gulshan Branch", "Clifton Branch"],
    },
    Lahore: {
      delivery_areas: ["DHA", "Gulberg", "Model Town", "Johar Town", "Cantt"],
      branches: ["Main Branch Lahore", "DHA Branch", "Gulberg Branch", "Model Town Branch"],
    },
    Islamabad: {
      delivery_areas: ["F-6", "F-7", "F-8", "G-9", "G-10"],
      branches: ["Main Branch Islamabad", "F-7 Branch", "Blue Area Branch"],
    },
    Rawalpindi: {
      delivery_areas: ["Saddar", "Commercial Market", "Committee Chowk", "Murree Road"],
      branches: ["Main Branch Rawalpindi", "Saddar Branch", "Committee Chowk Branch"],
    },
    Faisalabad: {
      delivery_areas: ["Civil Lines", "Peoples Colony", "Samanabad", "Millat Town"],
      branches: ["Main Branch Faisalabad", "Civil Lines Branch", "Peoples Colony Branch"],
    },
  },
}

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
  const [dineInClose , setDineInClose] = useState("");
  const [pickupClose , setPickupClose] = useState("");
  const {UpdateAddressData , AddressData} = useCartContext();

  const [open, setOpen] = useState(false)

  const handleSelect = () => {
    const AddressData =  {
      orderType: selectedOrderType,
      city: selectedCity,
      ...(selectedOrderType === "delivery" && { area: selectedArea }),
      ...(selectedOrderType === "pickup" && { branch: selectedPickupBranch }),
      ...(selectedOrderType === "dine_in" && {
        branch: selectedDineInBranch,
      })
    }
    UpdateAddressData(AddressData);
    setOpen(false)
  }


  function convertTo12HourFormat(time24: string): string {
    // Accepts "HH:mm:ss" or "HH:mm"
    const [hourStr, minuteStr] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr.padStart(2, "0");
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${hour}:${minute} ${ampm}`;
  }



  function isBranchOpen(branch: any): boolean {
    if (!branch) return false;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
    // Parse open and close times (assume "HH:mm:ss" or "HH:mm")
    const [openHour, openMinute] = branch.openTime.split(":").map(Number);
    const [closeHour, closeMinute] = branch.endTime.split(":").map(Number);
  
    const openMinutes = openHour * 60 + openMinute;
    const closeMinutes = closeHour * 60 + closeMinute;
  
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
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


  const getAllBranches = async ()=>{
    const res = await apiClientCustomer.get("/branch/view/customer");
    return res.data.data?.branches;
  }

  const {data}= useQuery({
    queryKey : ["branches"],
    queryFn : getAllBranches,
    staleTime : 1000 * 60 * 60,
  })


 

  const cities = data?.cities || [];
  const areas = data?.deliveryAreas || [];
  const deliveryAreas = areas?.find((item: any) => item.city === selectedCity)?.areas || [];

  // pickup branches data 
  const pickupBranches = data?.takeAwayBranches
  || [];
  const branchNames = pickupBranches?.find((item: any) => item.city === selectedCity)?.branches.map((branch: any) => branch.name) || [];

  const allPickupBranches = pickupBranches?.flatMap((item: any) => item.branches);
  const selectedPickupBranchData = allPickupBranches?.find(
    (branch: any) => branch.name === selectedPickupBranch
  );
  const isPickupClose = selectedPickupBranchData?.isSpecialClosed;

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
  if (isPickupClose) {
    setPickupClose(selectedPickupBranchData?.specialClosedMessage);
  }else{
    setPickupClose("");
  }

  
}, [isPickupClose ]);

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


useEffect(() => {
  if (selectedPickupBranchData) {
    if (!isBranchOpen(selectedPickupBranchData)) {
      const openTime12 = convertTo12HourFormat(selectedPickupBranchData.openTime);
      const closeTime12 = convertTo12HourFormat(selectedPickupBranchData.endTime);
      setPickupClose(`Branch is closed. It will open at ${openTime12} and close at ${closeTime12}.`);
    } else {
      setPickupClose(""); // Clear the message if open
    }
  }
}, [selectedPickupBranchData]);

 
/// open pop up
 
useEffect(() => {
  if (typeof window !== "undefined" && window.location.pathname == "/" && !AddressData.orderType) {
    setOpen(true)
  } else {
    setOpen(false)
  }
}, [])




  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <MapPin className="w-5 h-5 text-orange-500" />
      </DialogTrigger>

      <DialogContent className="h-auto bg-white flex flex-col gap-6 items-center sm:w-[70%] md:w-[55%] lg:w-[50%] max-w-[90%] mx-auto rounded-lg p-6 border-0">
        {/* Logo */}
        <div className="w-24 h-16 bg-gradient-to-br  flex items-center justify-center ">
          <img src="/logo.webp" alt="logo" className="w-full h-full object-contain" />
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

        {/* Title */}
        <h3 className="text-xl text-gray-900 font-bold text-center">Select your order type</h3>

        {/* Order Type Tabs */}
        <Tabs
          value={selectedOrderType}
          onValueChange={(value) => {
            setSelectedOrderType(value as "delivery" | "pickup" | "dine_in")
            setSelectedCity("")
            setSelectedArea("")
            setSelectedDineInBranch("")
            setDineInClose("")
            setSelectedPickupBranch("")
            setPickupClose("")
          }}
          className="w-full"
        >
          <TabsList className="bg-gray-100 flex gap-1 mb-6 w-full rounded-md">
            {orderTypes.map(({ name, value }) => (
              <TabsTrigger
                key={value}
                value={value}
               
                className="flex-1 py-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white text-gray-600 font-semibold rounded-md transition-all"
              >
                {name}
              </TabsTrigger>
            ))}
          </TabsList>

          {orderTypes.map(({ value }) => (
            <TabsContent key={value} value={value} className="w-full flex flex-col gap-4 mt-0">
              {/* Dynamic Title */}
              <h4 className="text-lg font-semibold text-gray-800 text-center">{getModalTitle()}</h4>

              {/* Use Current Location Button */}
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
                  {cities?.map((city:any) => (
                    <SelectItem key={city} value={city} className="text-black">
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Area/Branch Selection */}
              {/* <Select value={selectedArea} onValueChange={setSelectedArea} disabled={!selectedCity}>
                <SelectTrigger className="w-full focus:ring-orange-500 focus:ring-offset-0 border-gray-200">
                  <SelectValue placeholder={getPlaceholderText()} />
                </SelectTrigger>
                <SelectContent>
                {selectedOrderType === "delivery" && deliveryAreas?.map((option: any) => (
                <SelectItem key={option} value={option} className="text-black">
               {option}
                </SelectItem>
                ))}


                {selectedOrderType === "pickup" && branchNames?.map((option: any) => (
                <SelectItem key={option} value={option} className="text-black">
               {option}
                </SelectItem>
                ))}



                 {selectedOrderType === "dine_in" && dineInBranchNames?.map((option: any) => (
                <SelectItem key={option} value={option} className="text-black">
               {option}
                </SelectItem>
                ))}



                  
                </SelectContent>
              </Select> */}
              {selectedOrderType === "delivery" && (
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
)}

{selectedOrderType === "pickup" && (
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
)}

{selectedOrderType === "dine_in" && (
  <Select
    value={selectedDineInBranch}
    onValueChange={setSelectedDineInBranch}
    
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
)}
            </TabsContent>
          ))}
        </Tabs>

        {/* Select Button */}
        <Button
          className="w-full bg-orange-500 disabled:bg-gray-200 disabled:text-gray-500 text-white hover:bg-orange-600 py-3 font-semibold"
          disabled={isClose || !selectedCity}
          onClick={handleSelect}
        >
          Select
        </Button>

        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 p-2 bg-gray-500/80 hover:bg-gray-600/80 rounded-full text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </DialogContent>
    </Dialog>
  )
}

