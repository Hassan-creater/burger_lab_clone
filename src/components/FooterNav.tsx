"use client";

import { LocationDropIcon } from "./icons";
import { getSocials } from "@/functions";
import useLocalStorage from "@/hooks/useLocalStorage";
import { cn, formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

const FooterNav = () => {
	const localBranch = useLocalStorage("branch", null);

	const { data } = useQuery({
		queryKey: ["socials"],
		queryFn: getSocials,
	});

	return (
		<>
			<nav className="flex flex-col gap-2 justify-center flex-1">
				<h5 className="font-bold text-xl">Burger Lab</h5>
				{/* <div className="flex gap-2 items-center ">
          <PhoneIcon width={12} height={12} />
          <p className="text-sm text-gray-500">021-111-112-522</p>
        </div>
        <div className="flex gap-2 items-center ">
          <EnvelopeIcon width={12} height={12} />
          <p className="text-sm text-gray-500">customercare@burgerlab.com.pk</p>
        </div> */}
				<div className="flex gap-2 items-center my-2">
					<LocationDropIcon width={12} height={12} />
					<p
						className="text-sm text-gray-500"
						suppressHydrationWarning>{`${localBranch.storedValue?.address}, ${localBranch.storedValue?.city}, Pakistan`}</p>
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
				<div className="flex justify-between">
					<span className="text-sm font-normal">Mon - Sat</span>
					<span className="text-sm text-gray-500" suppressHydrationWarning>
						{`${formatDate(localBranch.storedValue?.open_time)} - ${formatDate(
							localBranch.storedValue?.end_time
						)}`}
					</span>
				</div>
				<div className="space-y-4">
					<h5 className="font-bold text-md">Follow us:</h5>
					<div className="flex gap-4 items-center h-full w-auto">
						{data?.status !== 500 &&
							data?.links?.map((link) => (
								<Link
									key={link.id}
									href={link.link_text || "#"}
									target="_blank"
									rel="noopener noreferrer">
									<i
										className={cn(
											link.link_icon,
											"text-2xl text-primaryOrange"
										)}></i>
									<span className="sr-only">{link.link_name}</span>
								</Link>
							))}
					</div>
				</div>
			</div>
		</>
	);
};

export default FooterNav;
