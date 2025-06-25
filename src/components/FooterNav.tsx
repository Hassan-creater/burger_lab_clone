"use client";

import { useCartContext } from "@/context/context";
import { EnvelopeIcon, LocationDropIcon } from "./icons";
import { getSocials } from "@/functions";
import useLocalStorage from "@/hooks/useLocalStorage";
import { apiClientCustomer } from "@/lib/api";
import { cn, formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { PhoneIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FooterNav = () => {
	const localBranch = useLocalStorage("branch", null);
	const {AddressData} = useCartContext();
	const socialLinks = async () => {
		const res = await apiClientCustomer.get("/social-media");
		return res.data.data;
	}

	const { data , isLoading } = useQuery({
		queryKey: ["social-links"],
		queryFn: socialLinks,
	});
 
	return (
		<>
			<nav className="flex flex-col gap-2 justify-center flex-1  px-[1.5em]">
				<h5 className="font-bold text-xl">Burger Lab</h5>
				<div className="flex gap-2 items-center ">
          <PhoneIcon width={12} height={12} />
          <p className="text-sm text-gray-500">021-111-112-522</p>
        </div>
        <div className="flex gap-2 items-center ">
          <EnvelopeIcon width={12} height={12} />
          <p className="text-sm text-gray-500">customercare@burgerlab.com.pk</p>
        </div>
				<div className="flex gap-2 items-center my-2">
					
					{
						AddressData.orderType !== "delivery" && AddressData.address && AddressData.city && (
							<>	
							<LocationDropIcon width={12} height={12} />						<p
							className="text-sm text-gray-500"
							suppressHydrationWarning>{`${AddressData.address} `}</p>
							</>
						) 
					}
				</div>
				<div className="flex gap-1 items-center w-full h-full">
					<Link href="/https://play.google.com/store/apps/details?id=com.blink.burgerlab">
						<Image
							width={150}
							height={150}
							src="/playstore.svg"
							alt="playstore-image"
							className="object-cover"
						/>
					</Link>
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
			</nav>
			<div className="  flex gap-2 flex-col flex-1">
				<>
				 {
					AddressData.orderType === "delivery" ? (
						<>
						</>
					) : (
						<>
						{
							AddressData.openTime && AddressData.endTime && (
                               <div className=" w-full pr-[1.5em]">
							   <h5 className="font-bold text-md">Our Timings</h5>
				       <div className="flex justify-between">
					   <span className="text-sm font-normal">Mon - Sat</span>
					   <span className="text-sm text-gray-500" suppressHydrationWarning>
						{AddressData.openTime} - {AddressData.endTime}
					</span>
                           </div>
							   </div>
							)
						}
						
						</>
					)
				 }
				</>
				
				<div className="space-y-4">
					<h5 className="font-bold text-md">Follow us:</h5>
					<div className="flex gap-3  items-center h-full w-full">
						{
							isLoading ? (
								<>
								<div className="w-[3em] h-[3em] bg-slate-500 animate-pulse"></div>
							    <div className="w-[3em] h-[3em] bg-slate-500 animate-pulse"></div>
								<div className="w-[3em] h-[3em] bg-slate-500 animate-pulse"></div>
								<div className="w-[3em] h-[3em] bg-slate-500 animate-pulse"></div>
								</>
							) : (
								data?.map((link:any , index:number)=>(
									<a key={index} href={link.linkText} target="_blank"className="w-[3em] h-[3em] bg-red-500">
										<img src={link.linkIcon} alt={link.linkName} className="w-full h-full object-cover" />
									</a>
								   ))
							)
						}
						
						{/* <div className="w-[3em] h-[3em] bg-red-500"></div>
						<div className="w-[3em] h-[3em] bg-red-500"></div> */}
					</div>
				</div>
			</div>
		</>
	);
};

export default FooterNav;
