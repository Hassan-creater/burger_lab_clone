import Image from "next/image";
import FooterNav from "./FooterNav";
import Link from "next/link";

const Footer = () => {
	return (
		<footer className="w-[95%] min-h-80 border-[2px] flex flex-col gap-4 border-neutral-200 shadow-neutral-300 shadow-sm lg:w-[85%] m-auto mt-6 pt-8 pb-4 pl-12 pr-12 bg-white rounded-t-2xl rounded-b-none">
			<div className="flex flex-col lg:flex-row gap-5 lg:gap-3 w-full h-full justify-center">
				<div className="flex w-full lg:w-1/4 items-center justify-center">
					<Image
						src="/logo.webp"
						alt="website-logo-showing-its-name"
						width={120}
						height={120}
						className="object-contain m-auto w-auto h-auto"
						sizes=""
						title="Burger Lab"
					/>
				</div>
				<FooterNav />
			</div>
			<div className="w-full flex items-center justify-center h-full">
				<Link
					href="/feedback"
					className=" underline text-sm text-gray-500 hover:text-black transition-colors">
					Feedback
				</Link>
			</div>
			<div className="mb-12 border-t-2 border-t-black pt-6 flex items-center justify-center">
				<p className="text-sm font-normal ">
					&copy; {new Date().getFullYear()} Powered by{" "}
					<Link href="" target="_blank" className="underline font-bold">
						Blink Co
					</Link>
				</p>
			</div>
		</footer>
	);
};

export default Footer;
