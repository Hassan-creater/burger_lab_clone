import React from "react";

function LoadingSpinner() {
	return (
		<div className="absolute z-100 min-h-screen min-w-screen w-screen flex items-center justify-center blur-lg">
			<div className="w-10 h-10 animate-spin absolute z-100 border-2 border-white rounded-full border-t-[#fabf2c]"></div>
		</div>
	);
}

export default LoadingSpinner;
