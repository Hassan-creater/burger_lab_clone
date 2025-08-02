"use client";
 
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2, LucideEye, LucideEyeOff, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { VisuallyHidden } from "../ui/visually-hidden";

import LoadingSpinner from "../LoadingSpinner";
import { toast } from "sonner";
import RegisterForm from "../RegisterForm";
import { useForm } from "react-hook-form";

import { apiClient } from "@/lib/api";
import { useCartContext } from "@/context/context";
import { designVar } from "@/designVar/desighVar";
import { formatErrorMessage } from "@/lib/utils";

type Login = {
    email: string;
    password: string;
    confirmPassword : string,
    rememberMe : boolean,
};

type forgotPassword = {
  email : string,
}

function AuthModal() {
  const [modalType, setModalType] = React.useState<
    "LOGIN" | "REGISTER" | "FORGOT" | "OTP" | "RESET-PASSWORD"
  >("LOGIN");


  const { register, handleSubmit, reset, watch, formState: {  errors  , isValid} } = useForm<Login>({
    mode : "onChange"
  });
  const [isPassVisible, setIsPassVisible] = React.useState(false);
  const [isConfPassVisible, setIsConfPassVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [email , setEmail] = useState("");
  const [forgotLoading,setForgotLoading] = useState(false);
  const {setLoggedIn , authOpen , setAuthOpen } = useCartContext()
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [passwordLoading,setPasswordLoading] = useState(false);


  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
  const value = e.target.value.replace(/[^0-9]/g, "");
  if (!value) return;
  const newOtp = [...otp];
  newOtp[idx] = value[0];
  setOtp(newOtp);
  // Move to next input if not last
  if (value && idx < 5) {
    const next = document.getElementById(`otp-input-${idx + 1}`);
    if (next) (next as HTMLInputElement).focus();
  }
};

const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
  if (e.key === "Backspace") {
    const newOtp = [...otp];

    // If current field has a value, clear it
    if (otp[idx]) {
      newOtp[idx] = "";
      setOtp(newOtp);
    }
    // If empty, move focus to previous
    else if (idx > 0) {
      const prev = document.getElementById(`otp-input-${idx - 1}`);
      prev && (prev as HTMLInputElement).focus();
    }
  }
};


  // Handler for OTP form submit
  const handleOtpSubmit = async () => {
    setOtpLoading(true);
   
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      setOtpLoading(false);
      return;
    }
    // TODO: Call backend to verify OTP
  

   
    try {
  
      const res = await apiClient.post('/auth/password/verify-otp', {
        email: email,
        code: otpValue.toString()
      });
  
    
      if (res.status === 200 || res.status === 201) {
        // If backend returns error in response (even with 200/201)
        if (res.data && (res.data.error || res.data.message === "Invalid OTP" || res.data.success === false)) {
          toast.error(res.data.error || res.data.message || "Invalid OTP");
        } else if (res.status === 200 || res.status === 201) {
          toast.success(res.data.message);
          reset();
          if (typeof window !== 'undefined') {
            sessionStorage.setItem("resetTokenUser", res.data.data.resetToken);
          }
          setModalType("RESET-PASSWORD")
        }
      }
    } catch (error : any) {
       let backendError =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Something went wrong . Try again later";
  
    // Try to parse JSON string error (e.g. "{'email':'Invalid email'}")
    if (
      typeof backendError === "string" &&
      (backendError.trim().startsWith("{") || backendError.trim().startsWith("["))
    ) {
      try {
        // Replace single quotes with double quotes for valid JSON parsing
        const jsonString = backendError.replace(/'/g, '"');
        const parsed = JSON.parse(jsonString);
        if (typeof parsed === "object" && parsed !== null) {
          // If it's an object, join all values (e.g. for field errors)
          backendError = Object.values(parsed).join(", ");
        }
      } catch {
        // If parsing fails, use the string as is
      }
    }
  
    // Always show the error, even if it's a plain string
    if(backendError == "Invalid email"){
      toast.error("Invalid email")
    }else{
    toast.error(backendError);
    }
    } finally {
  
      setOtpLoading(false);
    }
    // Optionally reset OTP or move to next step
  };

  


  const handleLogin = async (data: {email: string, password: string , rememberMe : boolean}) => {
    try {
        setLoading(true);
    
        // Attempt API request
        const res = await apiClient.post("/auth/customer/login", {
          email : data.email,
          password : data.password,
          // rememberMe : data.rememberMe
        });
    
        // Extract tokens
        const { accessToken , refreshToken } = res.data.data;
        const user = {
        firstName: res.data.data.user.firstName,
        lastName: res.data.data.user.lastName,
        id: res.data.data.user.id,
        email: res.data.data.user.email,
        image: res.data.data.user.image,
    };
        setLoggedIn(user, accessToken , refreshToken ?? "");
      
        // Redirect on success
        if (res.status === 200 || res.status === 201) {
          toast.success("Login Successfull");
          setAuthOpen(false);
          window.location.reload();
          setLoading(false);
        } else {
          toast.error("Something went wrong!");
        }
      } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
            toast.error(formatErrorMessage(error));
            setLoading(false) // Show actual error message
        } else {
            toast.error(formatErrorMessage(error));
            setLoading(false)
        }
    }
    
  };



  const forgotPassword = async (data: forgotPassword ) => {
    setForgotLoading(true);
    try {
  
      const res = await apiClient.post('/auth/customer/password/forgot', {
        email: data.email,
  
      });
  
    
      setEmail(data.email);
      if (res.status === 200 || res.status === 201) {
         toast.success(res.data.message);
         setModalType("OTP");
         reset();
         setForgotLoading(false);
         
      } 
    } catch (error : any) {
       let backendError =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "Something went wrong . Try again later";
  
    // Try to parse JSON string error (e.g. "{'email':'Invalid email'}")
    if (
      typeof backendError === "string" &&
      (backendError.trim().startsWith("{") || backendError.trim().startsWith("["))
    ) {
      try {
        // Replace single quotes with double quotes for valid JSON parsing
        const jsonString = backendError.replace(/'/g, '"');
        const parsed = JSON.parse(jsonString);
        if (typeof parsed === "object" && parsed !== null) {
          // If it's an object, join all values (e.g. for field errors)
          backendError = Object.values(parsed).join(", ");
        }
      } catch {
        // If parsing fails, use the string as is
      }
    }
  
    // Always show the error, even if it's a plain string
    if(backendError == "Invalid email"){
      toast.error("Invalid email")
    }else{

      if(backendError == "USER not found"){
        toast.error("User not found");
      }
 
    }
    } finally {
  
      setForgotLoading(false);
    }
  };



  const ResetPassword = async (data: { password: string; confirmPassword: string }) => {
    // Call backend to reset password with email, password, and resetToken from sessionStorage
    setPasswordLoading(true);
    try {
      let resetToken = '';
      if (typeof window !== 'undefined') {
        resetToken = sessionStorage.getItem('resetTokenUser') || '';
      }
      const res = await apiClient.put('/auth/customer/password/reset', {
        email,
        password: data.password,
        resetToken,
      });
      if (res.data && (res.data.error || res.data.success === false)) {
        toast.error(res.data.error || 'Password reset failed');
        setPasswordLoading(false);
      } else if (res.status === 200 || res.status === 204) {
        toast.success('Password reset successfully!');
        setModalType("LOGIN");
        reset();
        setPasswordLoading(false);
       
      }
    } catch (error: any) {
      let backendError =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'Something went wrong. Try again later';
      toast.error(backendError);
      setPasswordLoading(false);
    }
  };




  const renderModalContent = () => {
    if (modalType === "LOGIN") {
      return (
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-3">Welcome Back</h3>
          <form
            className="flex w-full flex-col items-center justify-center mb-1"
            onSubmit={handleSubmit(handleLogin)}
          >
            <Label className="w-full rounded-2xl mb-4">
              <span className="sr-only">Email</span>
              <Input
                
                type="email"
                placeholder="Enter your email"
                {...register("email", {required: true, pattern: {value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address"}})}
               
                className="w-full focus-visible:ring-primaryOrange  mb-2  "
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </Label>
            <Label className="w-full rounded-2xl relative">
              <span className="sr-only">Password</span>
              <Input
                
                type={isPassVisible ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", {required: true, minLength: {value: 8, message: "Password must be at least 8 characters long"}})}
                className="w-full focus-visible:ring-primaryOrange mb-2 "
              />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
              <Button
                variant="link"
                onClick={(e) => {
                  e.preventDefault();
                  setIsPassVisible(!isPassVisible);
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 focus-visible:ring-primaryOrange focus-visible:ring-offset-0"
              >
                {isPassVisible ? <LucideEyeOff /> : <LucideEye />}
              </Button>
            </Label>
            <div className="flex w-full items-center justify-between gap-2 mt-2 mb-4">
  {/* Left side: Checkbox + Label */}
  {/* <div className="flex items-center gap-2">
    <input
      id="remember-me"
      {...register("rememberMe")}
      type="checkbox"
      className="h-4 w-4 cursor-pointer rounded-md border-gray-300 text-orange-500 focus:ring-orange-500"
    />
    <label htmlFor="remember-me" className="text-xs sm:text-sm text-gray-600 cursor-pointer">
      Remember me for 30 days
    </label>
  </div> */}

  {/* Right side: Forgot Password Link */}
  <Button
    variant="link"
    className="text-xs sm:text-sm text-orange-600 hover:underline p-0"
    onClick={(e) => {
      e.preventDefault();
      setModalType("FORGOT");
    }}
  >
    Forgot Password?
  </Button>
</div>

            
            <Button
              type="submit"
              disabled={!isValid || loading}
              className={`${designVar.widthFullButton.width} ${designVar.widthFullButton.backgroundColor} ${designVar.widthFullButton.borderRadius} ${designVar.widthFullButton.paddingX} ${designVar.widthFullButton.paddingY} ${designVar.widthFullButton.fontSize} ${designVar.widthFullButton.fontWeight} ${designVar.widthFullButton.color} ${designVar.widthFullButton.cursor} ${designVar.widthFullButton.transition} ${designVar.widthFullButton.hover.backgroundColor} ${designVar.widthFullButton.hover.borderRadius} ${designVar.widthFullButton.hover.color} ${designVar.widthFullButton.hover.color} ${designVar.widthFullButton.hover.backgroundColor} mb-3`}
            ><div className="w-full flex items-center justify-center p-2">
                {loading ? <LoadingSpinner className="size-6 border-t-white" /> :
                  <span>Login</span>
                }
                </div>
            </Button>
            <Button
                  className={`${designVar.widthFullButton.width} ${designVar.widthFullButton.registerButtonLink.backgroundColor} ${designVar.widthFullButton.registerButtonLink.borderRadius} ${designVar.widthFullButton.registerButtonLink.paddingX} ${designVar.widthFullButton.registerButtonLink.paddingY} ${designVar.widthFullButton.registerButtonLink.fontSize} ${designVar.widthFullButton.registerButtonLink.fontWeight} ${designVar.widthFullButton.registerButtonLink.color} ${designVar.widthFullButton.registerButtonLink.cursor} ${designVar.widthFullButton.registerButtonLink.transition} ${designVar.widthFullButton.registerButtonLink.hover.backgroundColor} ${designVar.widthFullButton.registerButtonLink.hover.borderRadius} ${designVar.widthFullButton.registerButtonLink.hover.color} ${designVar.widthFullButton.registerButtonLink.hover.color} ${designVar.widthFullButton.registerButtonLink.hover.backgroundColor} ${designVar.widthFullButton.registerButtonLink.border}`}
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                setModalType("REGISTER");
              }}
            >
              Register
            </Button>
          </form>
        </div>
      );
    }
    if (modalType === "REGISTER") {
      return (
        <div className="flex flex-col items-center justify-center">
          <RegisterForm setModalType={setModalType} />
        </div>
      );
    }

    if (modalType === "FORGOT") {
      return (
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-3">Change Your Password!</h3>
          <form onSubmit={handleSubmit(forgotPassword)} className="flex w-full flex-col items-center justify-center">
            <Label className="w-full rounded-2xl my-4 mb-6">
              <span className="sr-only">Email</span>
              <Input
                required
                disabled={forgotLoading}
                type="email"
                {...register("email", {required: true, pattern: {value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address"}})}
                placeholder="Enter your email"
                className="w-full focus-visible:ring-primaryOrange     "
              />
            </Label>
            <Button
              type="submit"
              disabled={forgotLoading || !isValid}
              className="w-full p-2 flex items-center justify-center rounded-2xl mb-3 bg-primaryOrange hover:bg-primaryOrange/80 text-black font-semibold"
            >
              {
                forgotLoading ? <Loader2 className="animate-spin"/> : "Send Otp"
              }
            </Button>
            <Button
              className="rounded-2xl w-full p-2 flex items-center justify-center border-primaryOrange font-semibold"
              variant="outline"
              disabled = {forgotLoading}
              onClick={(e) => {
                e.preventDefault();
                setModalType("LOGIN");
              }}
            >
              Go Back To Login
            </Button>
          </form>
        </div>
      );
    }

    if (modalType === "OTP") {
      return (
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-xl xm:text-2xl font-bold mb-3">Enter OTP</h3>
          <form
            onSubmit={handleSubmit(handleOtpSubmit)}
            className="flex w-full flex-col items-center justify-center"
          >
            <Label className="w-full rounded-2xl my-4 mb-6 flex justify-center gap-2">
              <span className="sr-only">OTP</span>
              {otp.map((digit, idx) => (
                <Input
                disabled={otpLoading}
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-10 h-8 sm:w-10 sm:h-12 text-center text-xs sm:text-xl border-2 border-primaryOrange focus-visible:ring-primaryOrange rounded-lg sm:mx-1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, idx)}
                  onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                  autoFocus={idx === 0}
                />
              ))}
            </Label>
            <p className="w-full text-start text-red-500 text-sm mb-2">Otp will expire in 5 minutes</p>
            <Button
              type="submit"
              disabled={otpLoading || otp.some((d) => d === "")}
              className="w-full p-2 flex items-center justify-center rounded-2xl mb-3 bg-primaryOrange hover:bg-primaryOrange/80 text-black font-semibold"
            >
              {otpLoading ? <Loader2 className="animate-spin" /> : "Verify OTP"}
            </Button>
            <Button
              className="rounded-2xl w-full p-2 flex items-center justify-center border-primaryOrange font-semibold"
              variant="outline"
              disabled={otpLoading}
              onClick={(e) => {
                e.preventDefault();
                setModalType("LOGIN");
              }}
            >
              Go Back To Login
            </Button>
           
          </form>
        </div>
      );
    }

    if (modalType === "RESET-PASSWORD") {
      const password = watch("password");
      return (
        <div className="flex flex-col items-center justify-center">
          <form
            className="flex w-full flex-col items-center justify-center mb-1"
            onSubmit={handleSubmit(ResetPassword)}
          >
            <Label className="w-full rounded-2xl relative ">
              <span className="block mb-2 font-medium">New Password</span>
              <Input
                type={isPassVisible ? "text" : "password"}
                disabled={passwordLoading}
                placeholder="Enter your password"
                {...register("password", {
                  required: true,
                  minLength: { value: 8, message: "Password must be at least 8 characters long" },
                })}
                className="w-full focus-visible:ring-primaryOrange mb-2 "
              />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
              <Button
                variant="link"
                onClick={(e) => {
                  e.preventDefault();
                  setIsPassVisible(!isPassVisible);
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 focus-visible:ring-primaryOrange focus-visible:ring-offset-0"
              >
                {isPassVisible ? <LucideEyeOff /> : <LucideEye />}
              </Button>
            </Label>

            <Label className="w-full rounded-2xl relative mt-[1.5em]">
              <span className="block mb-2 font-medium">Confirm Password</span>
              <Input
                type={isConfPassVisible ? "text" : "password"}
                disabled={passwordLoading}
                placeholder="Confirm password"
                {...register("confirmPassword", {
                  required: true,
                  minLength: { value: 8, message: "Password must be at least 8 characters long" },
                  validate: (value) => value === password || "New password and confirm password must be same."
                })}
                className="w-full focus-visible:ring-primaryOrange mb-2  "
              />
              {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
              <Button
                variant="link"
                onClick={(e) => {
                  e.preventDefault();
                  setIsConfPassVisible(!isConfPassVisible);
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 focus-visible:ring-primaryOrange focus-visible:ring-offset-0"
              >
                {isConfPassVisible ? <LucideEyeOff /> : <LucideEye />}
              </Button>
            </Label>
            <Button
              type="submit"
              disabled={!isValid || passwordLoading}
              className={`${designVar.widthFullButton.width} ${designVar.widthFullButton.backgroundColor} ${designVar.widthFullButton.borderRadius} ${designVar.widthFullButton.paddingX} ${designVar.widthFullButton.paddingY} ${designVar.widthFullButton.fontSize} ${designVar.widthFullButton.fontWeight} ${designVar.widthFullButton.color} ${designVar.widthFullButton.cursor} ${designVar.widthFullButton.transition} ${designVar.widthFullButton.hover.backgroundColor} ${designVar.widthFullButton.hover.borderRadius} ${designVar.widthFullButton.hover.color} ${designVar.widthFullButton.hover.color} ${designVar.widthFullButton.hover.backgroundColor} mt-[1.5em]`}
            >
              <div className="w-full flex items-center justify-center p-2">
                {passwordLoading ? <LoadingSpinner className="size-6 border-t-white" /> :
                  <span>Reset Password</span>
                }
              </div>
            </Button>
          </form>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={authOpen} onOpenChange={setAuthOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={
            `${designVar.authButton.backgroundColor} ${designVar.authButton.borderRadius} ${designVar.authButton.paddingX} ${designVar.authButton.paddingY} ${designVar.authButton.fontSize} ${designVar.authButton.fontWeight} ${designVar.authButton.color} ${designVar.authButton.cursor} ${designVar.authButton.transition} ${designVar.authButton.hover.backgroundColor} ${designVar.authButton.hover.borderRadius} ${designVar.authButton.hover.color} ${designVar.authButton.hover.color} ${designVar.authButton.hover.backgroundColor}`
          }
        >
          <span className="hidden sm:block">Login / Register</span>
          <span className="block sm:hidden">Login</span>
        </Button>
      </DialogTrigger>
         <DialogContent className="w-[90%] sm:w-[30em] max-w-full h-max min-h-40 flex flex-col px-5 py-6 gap-0 rounded-xl border-0 descriptionModal">
        <DialogHeader>
          <DialogTitle asChild>
            <VisuallyHidden>Authentication</VisuallyHidden>
          </DialogTitle>
        </DialogHeader>
        {renderModalContent()}
        <DialogClose onClick={()=>{setModalType("LOGIN"), reset()}} disabled={loading || forgotLoading || otpLoading || passwordLoading} className="bg-black/80 p-1 rounded-xl text-white right-2 top-2 sm:right-2 sm:top-2">
          <XIcon className="w-6 h-6" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;
