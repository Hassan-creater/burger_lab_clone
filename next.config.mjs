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
		],
	},
	typescript: {
		ignoreBuildErrors: true, // This allows the build to succeed even with TypeScript errors
	},
};

export default nextConfig;
