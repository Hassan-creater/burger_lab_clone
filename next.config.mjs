/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "shazal-web.onrender.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "3001",
				pathname: "/**",
			},
			{
				protocol: "https", // Adding the missing hostname
				hostname: "localhost",
				port: "",
				pathname: "/**",
			},

			{
				protocol: "https", // Adding the missing hostname
				hostname: "placehold.co",
				port: "",
				pathname: "/**",
			},

			{
				protocol: "https", // Adding the missing hostname
				hostname: "zestupbackend-59oze.sevalla.app",
				port: "",
				pathname: "/**",
			},

			{
				protocol: "http", // Adding the missing hostname
				hostname: "localhost",
				port: "8000",
				pathname: "/**",
			},
			
		],
	},
	typescript: {
		ignoreBuildErrors: true, // This allows the build to succeed even with TypeScript errors
	},
};

export default nextConfig;