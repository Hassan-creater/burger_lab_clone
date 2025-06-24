'use client'


import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from "lucide-react"
import React from 'react'
import Link from "next/link"
import { getClientCookie } from "@/lib/getCookie"
import { redirect } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form"
import { toast } from "sonner"
import { apiClient } from "@/lib/api"



type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password : string,
  image: FileList | null;
};

const Page  = () => {
  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<FormData>();

  // Redirect if already logged in
  useEffect(() => {
    if (getClientCookie('accessToken')) {
      redirect('/home');
    }
  }, []);

 const onSubmit = async (data: FormData) => {
    try {
        console.log(data);

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

        const res = await apiClient.post("/auth/register", formData);


        if(res.status == 201 || res.status == 200 ){
           toast.success('Registration successful!');
            reset();
            redirect("/");
        }

        // Reset form fields
        

        // Show success message
       
    } catch (error: any) { 
        // Extract and display the actual error message from the server
        if (error.response && error.response.data && error.response.data.error) {
            toast.error(error.response.data.error);
        } else {
            toast.error("Registration failed. Please try again.");
        }
    }
};

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-orange-300 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-orange-100 rounded-full opacity-70 animate-ping"></div>
        <div
          className="absolute bottom-32 right-32 w-12 h-12 bg-orange-400 rounded-full opacity-40 animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-8 h-8 bg-orange-300 rounded-full opacity-50 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-14 h-14 bg-orange-200 rounded-full opacity-60 animate-ping"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      <Card className="w-full max-w-md bg-white shadow-xl relative z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">Create Account</CardTitle>
          <CardDescription className="text-gray-600">Fill in your details to register</CardDescription>
        </CardHeader>
        
        <CardContent>
          {errors.root && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {errors.root.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                className="w-full"
                {...register('firstName', { 
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'First name must be at least 2 characters'
                  }
                })}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                placeholder="Enter your last name"
                className="w-full"
                {...register('lastName', { 
                  required: 'Last name is required',
                  minLength: {
                    value: 2,
                    message: 'Last name must be at least 2 characters'
                  }
                })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                className="w-full"
                {...register('phone', { 
                  required: 'Phone number is required',
                  pattern: {
                    value: /^\d{10,15}$/,
                    message: 'Invalid phone number (10-15 digits)'
                  }
                })}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="w-full"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>


            <div className="space-y-2">
              <Label htmlFor="paswword" className="text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="**********"
                className="w-full"
                {...register('password', { 
                  required: 'Password is required',
                 minLength : {
                    value : 6 ,
                    message : "Password should be at least 6 characters long"
                 }
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-medium text-gray-700">
                Profile Image
              </Label>
              <div className="relative">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register('image')}
                />
                <label
                  htmlFor="image"
                  className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded cursor-pointer"
                >
                  <span>Choose a file...</span>
                  <Upload className="h-4 w-4 text-gray-400" />
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <p className="w-full text-center mt-6 text-sm">
            Already have an account?{' '}
            <Link href="/" className="text-orange-500 font-medium hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page
