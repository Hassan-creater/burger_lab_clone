"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { LucideEye, LucideEyeOff, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { VisuallyHidden } from "../ui/visually-hidden";

import LoadingSpinner from "../LoadingSpinner";
import { toast } from "sonner";
import RegisterForm from "../RegisterForm";
import { useForm } from "react-hook-form";

import { apiClient } from "@/lib/api";
import { useCartContext } from "@/context/context";

type Login = {
    email: string;
    password: string;
};

function AuthModal() {
  const [modalType, setModalType] = React.useState<
    "LOGIN" | "REGISTER"
  >("LOGIN");



  const {register, handleSubmit, formState: { isDirty}} = useForm<Login>();



  

  const [isPassVisible, setIsPassVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const {setLoggedIn , authOpen , setAuthOpen} = useCartContext()


  const handleLogin = async (data: {email: string, password: string}) => {
    try {
        setLoading(true);
    
        // Attempt API request
        const res = await apiClient.post("/auth/login/customer", {
          email : data.email,
          password : data.password,
        });
    
        // Extract tokens
        const { accessToken } = res.data.data;
        const user = {
        firstName: res.data.data.user.firstName,
        lastName: res.data.data.user.lastName,
        id: res.data.data.user.id,
        email: res.data.data.user.email,
        image: res.data.data.user.image,
    };
        setLoggedIn(user, accessToken);
      
        // Redirect on success
        if (res.status === 200 || res.status === 201) {
          toast.success("Login Successfull");
          setAuthOpen(false);
          setLoading(false);
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

  const renderModalContent = () => {
    if (modalType === "LOGIN") {
      return (
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-2xl font-bold mb-3">Welcome Back</h3>
          <form
            className="flex w-full flex-col items-center justify-center mb-1"
            onSubmit={handleSubmit(handleLogin)}
          >
            <Label className="w-full rounded-2xl mb-4">
              <span className="sr-only">Email</span>
              <Input
                
                type="email"
                placeholder="Enter your email"
                {...register("email", {required: true})}
               
                className="w-full focus-visible:ring-primaryOrange     "
              />
            </Label>
            <Label className="w-full rounded-2xl relative">
              <span className="sr-only">Password</span>
              <Input
                
                type={isPassVisible ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", {required: true})}
                className="w-full focus-visible:ring-primaryOrange  "
              />
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
            <Button
              className="w-max p-2 self-end my-1"
              variant="link"
              onClick={(e) => {
                e.preventDefault();
              
              }}
            >
              Forgot Password?
            </Button>
            <Button
              type="submit"
              disabled={!isDirty || loading}
              className="w-full p-2 flex items-center justify-center rounded-2xl mb-3 bg-primaryOrange hover:bg-primaryOrange/80 text-black font-semibold"
            ><div className="w-full flex items-center justify-center p-2">
                {loading ? <LoadingSpinner className="size-6 border-t-white" /> :
                  <span>Login</span>
                }
                </div>
            </Button>
            <Button
              className="rounded-2xl w-full p-2 flex items-center justify-center border-primaryOrange font-semibold"
              variant="outline"
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
    // if (modalType === "RESET") {
    //   return (
    //     <div className="flex flex-col items-center justify-center">
    //       <h3 className="text-2xl font-bold mb-3">Change Your Password!</h3>
    //       <form className="flex w-full flex-col items-center justify-center">
    //         <Label className="w-full rounded-2xl my-4 mb-6">
    //           <span className="sr-only">Email</span>
    //           <Input
    //             required
    //             type="email"
    //             placeholder="Enter your email"
    //             className="w-full focus-visible:ring-primaryOrange     "
    //           />
    //         </Label>
    //         <Button
    //           type="submit"
    //           className="w-full p-2 flex items-center justify-center rounded-2xl mb-3 bg-primaryOrange hover:bg-primaryOrange/80 text-black font-semibold"
    //         >
    //           Send Verification Code
    //         </Button>
    //         <Button
    //           className="rounded-2xl w-full p-2 flex items-center justify-center border-primaryOrange font-semibold"
    //           variant="outline"
    //           onClick={(e) => {
    //             e.preventDefault();
    //             setModalType("LOGIN");
    //           }}
    //         >
    //           Go Back To Login
    //         </Button>
    //       </form>
    //     </div>
    //   );
    // }

    return null;
  };

  return (
    <Dialog open={authOpen} onOpenChange={setAuthOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={
            "px-4 py-2 font-bold text-black bg-primaryOrange/60 rounded-xl text-xs !hover:border-[#fabf2c] hover:bg-primaryBg"
          }
        >
          Login / Register
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[80%] sm:w-[40%] max-w-full h-max min-h-40 flex flex-col px-5 py-6 gap-0 rounded-xl border-0 descriptionModal">
        <DialogHeader>
          <DialogTitle asChild>
            <VisuallyHidden>Authentication</VisuallyHidden>
          </DialogTitle>
        </DialogHeader>
        {renderModalContent()}
        <DialogClose disabled={loading} className="bg-black/80 p-1 rounded-xl text-white right-2 top-2 sm:right-2 sm:top-2">
          <XIcon className="w-6 h-6" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;
