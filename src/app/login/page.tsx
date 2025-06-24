'use client'

import Cookies from "js-cookie";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { apiClient } from "@/lib/api"

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getClientCookie } from "@/lib/getCookie";
import Link from "next/link";
import { useForm } from "react-hook-form";




type Login = {
  email : string,
  password : string
}

const Page = () => {
  
  const [loading , setLoading] = useState(false);
  const router = useRouter();

  const {register , handleSubmit} = useForm<Login>()


 const Login = async (data : Login) => {
  try {
    setLoading(true);

    // Attempt API request
    const res = await apiClient.post("/auth/login/customer", {
      email : data.email,
      password : data.password,
    });

    // Extract tokens
    const { accessToken, refreshToken } = res.data.data;
    const user = {
    firstName: res.data.data.user.firstName,
    lastName: res.data.data.user.lastName,
    id: res.data.data.user.id,
    email: res.data.data.user.email,
    image: res.data.data.user.image,
};



  

    // Check environment for secure cookie setting
    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

    // Set access token cookie (1-day expiration)
    Cookies.set("accessToken", accessToken, {
      expires: 1, // 1 day
      path: "/",
      secure: !isLocalhost, // Secure in production only
      sameSite: "lax",
    });

    Cookies.set("userData", JSON.stringify(user), { expires: 1, path: "/", secure: !isLocalhost , sameSite : "lax" });
    
    // Redirect on success
    if (res.status === 200 || res.status === 201) {
      toast.success("Login Successfull");
      setLoading(false);
      router.push("/");
    } else {
      toast.error("Something went wrong!");
    }
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
        setLoading(false) // Show actual error message
    } else {
        toast.error("Login failed! Please try again.");
        setLoading(false)
    }
}

};


 const token = getClientCookie("accessToken");

useEffect(()=>{
 
  if(token){
     redirect("/");
  }
},[token])





   return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4 relative overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Circles */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-300 rounded-full opacity-40 animate-pulse"></div>
        <div
          className="absolute bottom-32 left-20 w-24 h-24 bg-orange-200 rounded-full opacity-50 animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-12 h-12 bg-orange-400 rounded-full opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Floating Squares */}
        <div
          className="absolute top-60 left-1/4 w-8 h-8 bg-orange-300 opacity-40 animate-spin"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute top-80 right-1/3 w-6 h-6 bg-orange-400 opacity-50 animate-spin"
          style={{ animationDuration: "6s", animationDelay: "1s" }}
        ></div>

        {/* Large Background Shapes */}
        <div
          className="absolute -top-20 -left-20 w-40 h-40 bg-orange-200 rounded-full opacity-20 animate-pulse"
          style={{ animationDuration: "4s" }}
        ></div>
        <div
          className="absolute -bottom-20 -right-20 w-48 h-48 bg-orange-300 rounded-full opacity-15 animate-pulse"
          style={{ animationDuration: "5s", animationDelay: "2s" }}
        ></div>

        {/* Moving Gradient Orbs */}
        <div
          className="absolute top-1/4 left-1/2 w-32 h-32 bg-gradient-to-r from-orange-200 to-orange-300 rounded-full opacity-30 animate-ping"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-gradient-to-l from-orange-300 to-orange-400 rounded-full opacity-25 animate-ping"
          style={{ animationDuration: "4s", animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md border-orange-200 shadow-xl backdrop-blur-sm bg-white/90 relative z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-orange-900">Welcome Back</CardTitle>
          <CardDescription className="text-orange-700">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(Login)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-orange-800">
                Email
              </Label>
              <Input
                id="email"
                {...register("email", {required : true})}
                type="email"
                placeholder="Enter your email"
                required
                className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-orange-800">
                Password
              </Label>
              <Input
                id="password"
                 {...register("password", {required : true})}
                type="password"
                placeholder="Enter your password"
                required
                className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          
            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
              {
                loading  ? <Loader2 className="animate-spin" /> : "Sign In"
              }
            </Button>
          </form>

          
          <p className="w-full text-center mt-[1em]">Don&apos;t have an account ? <Link className="cursor-pointer text-orange-500 underline" href="/register">Register</Link></p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page
