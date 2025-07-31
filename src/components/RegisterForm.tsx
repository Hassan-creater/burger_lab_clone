'use client'

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LucideEye, LucideEyeOff } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import LoadingSpinner from "./LoadingSpinner";
import { designVar } from "@/designVar/desighVar";
import { formatErrorMessage } from "@/lib/utils";

export type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  image?: any;
};

export default function RegisterForm({setModalType}:{setModalType:React.Dispatch<React.SetStateAction<"LOGIN" | "REGISTER" | "FORGOT" | "OTP" | "RESET-PASSWORD">>}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<UserData>(
    {
    defaultValues: { firstName: "", lastName: "", email: "", password: "", phone: "" },
    mode: "onChange",
    }
  );

  const [firstName, lastName, email, password, phone] = watch([
    "firstName",
    "lastName",
    "email",
    "password",
    "phone",
  ]);


  const allRequiredFilled = [firstName, lastName, email, password, phone]
    .every((val) => typeof val === "string" && val.trim() !== "");

  const [showPass, setShowPass] = useState(false);
  const [preview, setPreview] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      preview && URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const submitHandler = async (data: UserData) => {
 
    try {
      setIsSubmitting(true);

      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('phone', data.phone);
      formData.append('email', data.email);
      formData.append('password', data.password);
      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0]);
      }
      
      const res = await apiClient.post("/auth/register/customer", formData);


      if(res.status == 201 || res.status == 200 ){
        if(res.data.message == "User registered successfully"){
          toast.success("Verification link is sent to you email.")
        }else{
          toast.success('Registration successful!');
        }
          reset();
          setIsSubmitting(false);
          setModalType("LOGIN");
      }   
  } catch (error: any) { 
      // Extract and display the actual error message from the server
      if (error.response && error.response.data && error.response.data.error) {
          toast.error(formatErrorMessage(error));
          setIsSubmitting(false);
      } else {
          toast.error(formatErrorMessage(error));
          setIsSubmitting(false);
      }
  }
  };

 

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className={`${designVar.fontFamily} flex items-center productdetail justify-center w-full h-[37.5em] `}>
      <Card className="w-full">
        <CardHeader className="text-center space-y-2 pb-2 ">
          <CardTitle className="text-[20px] font-extrabold text-gray-800">
           Create Account
          </CardTitle>
          {/* <CardDescription className="text-gray-500">
            Fill in your details to get started
          </CardDescription> */}
        </CardHeader>

        <form onSubmit={handleSubmit(submitHandler)}>
        <CardContent className="space-y-5 p-[0.5em]">
            {/* Avatar */}
            <div onClick={()=>document.getElementById("image")?.click()} className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 cursor-pointer overflow-hidden border-2 border-orange-500">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" alt="avatar" />
                ) : (
                  <div className="h-full flex items-center justify-center text-orange-500 text-2xl">+</div>
                )}
              </div>
            </div>
            <input
              type="file"
             accept="image/*"
             id="image"
             hidden
             className="mt-1 text-sm text-gray-600"
            {...register("image", {
               onChange: handleAvatarChange  // RHF will merge this under the hood
                })}
            />

            <div className="flex gap-4 w-full">
            <div>
              <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name *
              </Label>
              <Input
                id="firstName"
                {...register("firstName", { required: "First Name is required" })}
                placeholder="John"
                className="mt-1 focus:ring-orange-500"
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-500">Required</p>}
            </div>

            <div>
              <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name *
              </Label>
              <Input
                id="lastName"
                {...register("lastName", { required: "Last Name is required" })}
                placeholder="Doe"
                className="mt-1 focus:ring-orange-500"
              />
              {errors.lastName && <p className="mt-1 text-xs text-red-500">Required</p>}
            </div>

            </div>
            
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="you@example.com"
                className="mt-1 focus:ring-orange-500"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">Invalid email</p>}
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  {...register("password", { required: "Password is required", minLength: {value: 8, message: "Password must be at least 8 characters long"}})}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="mt-1 focus:ring-orange-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-2 flex items-center"
                >
                  {showPass ? <LucideEyeOff /> : <LucideEye />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">Min 8 characters</p>}
            </div>

            <div>
              <Label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone *
              </Label>
              <Input
                id="phone"
                {...register("phone", { required: "Phone is required", pattern: {value: /^[0-9]{11}$/, message: "Invalid phone number"} })}
                type="tel"
                placeholder="123-456-7890"
                className="mt-1 focus:ring-orange-500"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
            </div>
          </CardContent>

          <CardFooter className="pt-0 w-full flex flex-col gap-2 p-[0.5em]">
            <Button
              type="submit"
              className={`${designVar.widthFullButton.width} ${designVar.widthFullButton.registerButton.backgroundColor} ${designVar.widthFullButton.registerButton.borderRadius} ${designVar.widthFullButton.registerButton.paddingX} ${designVar.widthFullButton.registerButton.paddingY} ${designVar.widthFullButton.registerButton.fontSize} ${designVar.widthFullButton.registerButton.fontWeight} ${designVar.widthFullButton.registerButton.color} ${designVar.widthFullButton.registerButton.cursor} ${designVar.widthFullButton.registerButton.transition} ${designVar.widthFullButton.registerButton.hover.backgroundColor} ${designVar.widthFullButton.registerButton.hover.borderRadius} ${designVar.widthFullButton.registerButton.hover.color} ${designVar.widthFullButton.registerButton.hover.color} ${designVar.widthFullButton.registerButton.hover.backgroundColor}`}
              disabled={!allRequiredFilled || isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner className="size-6 border-t-white" /> : "Register"}
            </Button>
            <Button
              variant="outline"
              disabled={isSubmitting}
              className={`${designVar.widthFullButton.width} ${designVar.widthFullButton.registerButtonLink.backgroundColor} ${designVar.widthFullButton.registerButtonLink.borderRadius} ${designVar.widthFullButton.registerButtonLink.paddingX} ${designVar.widthFullButton.registerButtonLink.paddingY} ${designVar.widthFullButton.registerButtonLink.fontSize} ${designVar.widthFullButton.registerButtonLink.fontWeight} ${designVar.widthFullButton.registerButtonLink.color} ${designVar.widthFullButton.registerButtonLink.cursor} ${designVar.widthFullButton.registerButtonLink.transition} ${designVar.widthFullButton.registerButtonLink.hover.backgroundColor} ${designVar.widthFullButton.registerButtonLink.hover.borderRadius} ${designVar.widthFullButton.registerButtonLink.hover.color} ${designVar.widthFullButton.registerButtonLink.hover.color} ${designVar.widthFullButton.registerButtonLink.hover.backgroundColor} ${designVar.widthFullButton.registerButtonLink.border } ${designVar.widthFullButton.textSize}`}
              onClick={() => setModalType("LOGIN")}
             
            > 
              Already have an account? Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
