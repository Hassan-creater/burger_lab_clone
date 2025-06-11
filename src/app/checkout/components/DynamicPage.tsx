import dynamic from "next/dynamic";

const DynamicCheckout = dynamic(() => import("../page"), { ssr: false });

export default DynamicCheckout;
