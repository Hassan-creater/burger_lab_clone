'use client'

import {  Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartContext } from "@/context/context";
import { apiClientCustomer } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { designVar } from "@/designVar/desighVar";

// const FooterNav = dynamic(() => import("./FooterNav"), { ssr: false });

const Footer = () => {


  const {TaxData , AddressData} = useCartContext()

  const getSocialMedia = async () => {
    const response = await apiClientCustomer.get(`/social-media`)
    return response.data.data
  }

  const {data: socialMediaData} = useQuery({
    queryKey: ["social-media"],
    queryFn : getSocialMedia
  })



  return (
    // <footer className="w-[95%]  min-h-80 border-[2px] flex flex-col gap-4 border-neutral-200 shadow-neutral-300 shadow-sm lg:w-[85%] m-auto mt-6 mb-[1em] pt-[1.5em]  rounded-t-2xl rounded-b-none">
    //   <div className="flex flex-col  lg:flex-row gap-5 lg:gap-3 w-full h-[12em] justify-between">
    //     <div className="flex w-full lg:w-1/4 items-center justify-center ">
    //       <Image
    //         src="/logo.webp"
    //         alt="website-logo-showing-its-name"
    //         width={120}
    //         height={120}
    //         priority
    //         className="object-contain m-auto w-auto h-auto"
    //         sizes=""
    //         title="Burger Lab"
    //       />
    //     </div>
    //     <FooterNav />
    //   </div>
    //   <div className="w-full flex items-center justify-center h-full">
    //     <Link
    //       href="/feedback"
    //       className=" underline text-sm text-gray-500 hover:text-black transition-colors"
    //     >
    //       Feedback
    //     </Link>
    //   </div>
    //   <div className="mb-12 border-t-2 border-t-black pt-6 flex items-center justify-center">
    //     <p className="text-sm font-normal ">
    //       &copy; {new Date().getFullYear()} Powered by{" "}
    //       <Link href="" target="_blank" className="underline font-bold">
    //         Blink Co
    //       </Link>
    //     </p>
    //   </div>
    // </footer>
    <footer className={`bg-white ${designVar.fontFamily} mt-[5em] border-t border-gray-200 py-8 px-4 md:px-6 lg:px-[4em]`}>
    <div className="max-w-7xl mx-auto ">
      <div className="flex  flex-col gap-6 justify-start items-start md:flex-row md:justify-evenly md:items-start">
        {/* Logo and App Downloads Section */}
        <div className="space-y-8 ">
          {/* Logo Placeholder */}
          <div className="flex items-center space-x-3">
            <div className="w-24 h-24 rounded-lg flex items-center justify-center">
              <Image src="/logo.webp" alt="logo" className="w-full h-full object-contain" width={64} height={64} />
            </div>
            
          </div>

          {/* App Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="bg-black text-white  rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
              <Link href="/https://play.google.com/store/apps/details?id=com.blink.burgerlab">
						<Image
							width={120}
							height={120}
							src="/playstore.svg"
							alt="playstore-image"
							className="object-cover"
						/>
					</Link>
            </div>
            <div className="bg-black text-white  rounded-lg flex items-center justify-center space-x-2 cursor-pointer hover:bg-gray-800 transition-colors">
            <Link href="https://apps.apple.com/pk/app/burger-lab/id1555639986">
						<Image
							width={150}
							height={150}
							src="/appstore.svg"
							alt="appstore-image"
							className="object-cover"
						/>
					</Link>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-4  h-[10.5em]">
          <h3 className="text-[16px] font-bold text-gray-900">Burger Lab</h3>

          <div className="space-y-3">
            {
              TaxData?.contact ? (
                <div className="flex items-start space-x-3 text-[14px]">
                <Phone className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-gray-900">Phone: </span>
                  <span className="text-gray-600">{TaxData?.contact}</span>
                </div>
              </div>
              ) : <div className="flex items-start space-x-3 animate-pulse">
              <div className="w-5 h-5 bg-gray-300 rounded-full mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <div className="h-4 bg-gray-300 rounded w-20" /> 
                <div className="h-4 bg-gray-300 rounded w-40" />
              </div>
            </div>
            }
             

             {
              TaxData?.supportEmail ? (
                <div className="flex items-start space-x-3 text-[14px]">
              <Mail className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold text-gray-900">Email: </span>
                <span className="text-gray-600">{TaxData?.supportEmail}</span>
              </div>
            </div>
              ) : <div className="flex items-start space-x-3 animate-pulse">
              <div className="w-5 h-5 bg-gray-300 rounded-full mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <div className="h-4 bg-gray-300 rounded w-20" /> 
                <div className="h-4 bg-gray-300 rounded w-40" />
              </div>
            </div>
             } 

            {
              AddressData?.address ? (
                <div className="flex items-start space-x-3 text-[14px]">
              <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold text-gray-900">Address: </span>
                <span className="text-gray-600">
                 {AddressData?.address}
                </span>
              </div>
            </div>
              ) :""
            }

            
          </div>
        </div>

        {/* Timings and Social Media Section */}
        <div className="space-y-6 pl-[3em]">
          {/* Operating Hours */}
          {
            TaxData?.timing ? (
              <div>
            <h3 className="text-[16px] font-bold text-gray-900 mb-4">Our Timings</h3>
            <div className="flex justify-between items-center text-[14px]">
              <p>{TaxData?.timing}</p>
            </div>
          </div>
            ) : <div className="flex items-start space-x-3 animate-pulse">
            <div className="w-5 h-5 bg-gray-300 rounded-full mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <div className="h-4 bg-gray-300 rounded w-20" /> 
              <div className="h-4 bg-gray-300 rounded w-40" />
            </div>
          </div>
          }
          

          {/* Social Media */}
          {
            socialMediaData?.length > 0 ? (
                <>
                 <h4 className="text-[16px] font-semibold text-gray-900 mb-3">Follow Us:</h4>
                 <div className="w-full flex gap-2">
                 {
                  socialMediaData?.map((item : any , index : number)=>{
                    return (
                      <a
                      key={index}
                    href={item?.linkText}
                    className="w-10 h-10 bg-gray-200 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                   aria-label="Facebook"
                   >
                    <Image src={item?.linkIcon} alt={item?.linkName} width={20} height={20} className="w-full h-full object-cover" />
              </a>
                    )
                  })
                 }
                 </div>
                 
                </>
            ) : <div className="flex justify-between gap-4 animate-pulse">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="flex-1 h-32 bg-gray-300 rounded-md"
              />
            ))}
          </div>
          }
          
        </div>
      </div>
      <div className="pt-4 text-[12px] text-center mt-4 border-t-[1.3px] border-gray-200">
        <p>Copyright © {new Date().getFullYear()} Burger Lab. All rights reserved.</p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
