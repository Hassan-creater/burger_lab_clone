"use client";

import { EnvelopeIcon, LocationDropIcon, PhoneIcon } from "./icons";
import { FacebookIcon, InstagramIcon } from "@/components/icons";
import Image from "next/image";
import Link from "next/link";

const timings = [
	{
		title: "Monday - Thursday",
		duration: "12:00 PM - 12:30 AM",
	},
	{
		title: "Friday",
		duration: "02:00 PM - 01:00 AM",
	},
	{
		title: "Saturday - Sunday",
		duration: "12:00 PM - 01:00 AM",
	},
];

const FooterNav = () => {
	return (
		<>
			<nav className="flex flex-col gap-2 justify-center flex-1">
				<h5 className="font-bold text-md">Burger Lab</h5>
				<div className="flex gap-2 items-center ">
					<PhoneIcon width={12} height={12} />
					<p className="text-sm text-gray-500">021-111-112-522</p>
				</div>
				<div className="flex gap-2 items-center ">
					<EnvelopeIcon width={12} height={12} />
					<p className="text-sm text-gray-500">customercare@burgerlab.com.pk</p>
				</div>
				<div className="flex gap-2 items-center ">
					<LocationDropIcon width={12} height={12} />
					<p className="text-sm text-gray-500">
						Burger Lab - University Road Peshawar, Ettehad Plaza adjacent to
						City Pharmacy, University Road, Peshawar, Peshawar
					</p>
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
			<div className="flex gap-2 flex-col flex-1">
				<h5 className="font-bold text-md">Our Timings</h5>
				{timings.map((timing) => (
					<div className="flex justify-between" key={timing.duration}>
						<span className="text-sm font-normal">{timing.title}</span>
						<span className="text-sm text-gray-500">{timing.duration}</span>
					</div>
				))}
				<div className="mt-4">
					<h5 className="font-bold text-md">Follow us:</h5>
					<div className="flex gap-2 items-center h-full w-auto">
						<Link href="facebook.com" target="_blank">
							<FacebookIcon
								height={8}
								width={8}
								className="text-white p-1 rounded-full text-sm w-8 h-8"
							/>
						</Link>
						<Link href="">
							<InstagramIcon
								height={8}
								width={8}
								className="text-white p-1 rounded-full text-sm w-8 h-8"
							/>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default FooterNav;
