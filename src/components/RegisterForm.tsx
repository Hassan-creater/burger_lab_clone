"use client";

import React from "react";
// import { Label } from "./ui/label";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";
// import { LucideEye, LucideEyeOff } from "lucide-react";
// import { useMutation } from "@tanstack/react-query";
// import LoadingSpinner from "./LoadingSpinner";
// import { register, updateUserDetails } from "@/functions";
// import { toast } from "sonner";
// import { UserDetails } from "@/types";
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"



  import { useForm } from "react-hook-form";

type userData= {
  firstName : string,
  lastName : string,
  id : string,
  image? : string,
  email : string,

}

//TODO Import all Logic for Register into the component itself.

type Props = {
  isPassVisible?: boolean;
  setIsPassVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setModalType?: React.Dispatch<
    React.SetStateAction<"LOGIN" | "REGISTER" | "RESET">
  >;
  user?: userData;
  type?: "REGISTER" | "UPDATE";
};

function RegisterForm({
  isPassVisible,
  setIsPassVisible,
  setModalType,
  user,
  type = "REGISTER",
}: Props) {
  // const [details, setDetails] = React.useState({
  //   email: user?.email || "",
  //   password: "",
  //   confirmPassword: "",
  //   name: user?.name || "",
  //   countryCode: user?.phone.slice(0, 3) || "+92",
  //   phone: user?.phone.slice(3) || "",
  // });

  // const [error, setError] = React.useState(() => ({
  //   status: false,
  //   message: "",
  // }));

  // const registerMutation = useMutation({
  //   mutationFn: () =>
  //     register(
  //       details.name,
  //       details.email,
  //       details.password,
  //       `${details.countryCode}${details.phone}`
  //     ),
  //   onSuccess(data) {
  //     if (data.status === "error") {
  //       console.log(data.message);
  //       setError(() => ({
  //         status: Boolean(data.status),
  //         message: data.message || "Something went wrong",
  //       }));
  //       return;
  //     }
  //     toast.success("User Registered Successfully.", {
  //       style: { backgroundColor: "green", color: "white" },
  //       closeButton: true,
  //       dismissible: true,
  //     });
  //     setError(() => ({ status: false, message: "" }));
  //     setModalType && setModalType("LOGIN");
  //   },
  // });

  // const updateMutation = useMutation({
  //   mutationFn: () =>
  //     updateUserDetails(
  //       user?.id!,
  //       details.name,
  //       details.email,
  //       `${details.countryCode}${details.phone}`
  //     ),
  //   onSuccess(data) {
  //     if (data.status === 500) {
  //       console.log(data.error);
  //       setError(() => ({
  //         status: Boolean(data.status),
  //         message: data.error || "Something went wrong",
  //       }));
  //       return;
  //     }
  //     location.reload();
  //   },
  // });

  // const handleAction = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (type === "REGISTER") {
  //     if (details.password !== details.confirmPassword) {
  //       setError(() => ({
  //         status: true,
  //         message: "Password and Confirm Password do not match",
  //       }));
  //       return;
  //     }
  //   }

  //   if (
  //     details.phone.startsWith(details.countryCode) ||
  //     details.phone.startsWith("+")
  //   ) {
  //     setError(() => ({
  //       status: true,
  //       message: "Phone number must not include the country code",
  //     }));
  //     return;
  //   }

  //   type === "REGISTER" ? registerMutation.mutate() : updateMutation.mutate();
  // };

  


   const initialUser = {
        firstName: user?.firstName,
        lastName: user?.lastName,
        id : user?.id,
        email: user?.email,
        image : user?.image,
      
        
    };


        const { register, handleSubmit, formState: { isDirty } } = useForm({
        defaultValues: initialUser
    });

    const [User, setUser] = useState(initialUser);

    const onSubmit = (data: any) => {
        console.log("Updated Data:", data);
        setUser(data); // Update user state
    };





  return (
    <>
      {/* {error.status && !registerMutation.isPending && (
        <p
          className={`text-red-500 text-center ${type === "UPDATE" && "mb-3"}`}
        >
          {error.message}
        </p>
      )}
      <form
        className="flex w-full flex-col items-center justify-center"
        onSubmit={handleAction}
      >
        <Label className="w-full rounded-2xl mb-4 space-y-2">
          <span className="font-normal text-gray-700">Full Name</span>
          <Input
            required
            type="text"
            placeholder="Enter your Full Name"
            value={details.name}
            onChange={(e) =>
              setDetails({
                ...details,
                name: e.target.value,
              })
            }
            className="w-full focus-visible:ring-primaryOrange     "
          />
        </Label>
        <Label className="w-full rounded-2xl mb-4 space-y-2">
          <span className="font-normal text-gray-700">Email</span>
          <Input
            required
            type="email"
            placeholder="Enter your email"
            value={details.email}
            onChange={(e) =>
              setDetails({
                ...details,
                email: e.target.value,
              })
            }
            className="w-full focus-visible:ring-primaryOrange     "
          />
        </Label>
        {type === "REGISTER" && (
          <>
            <Label className="w-full rounded-2xl mb-4 relative space-y-2">
              <span className="font-normal text-gray-700">Password</span>
              <Input
                required
                type={isPassVisible ? "text" : "password"}
                placeholder="Enter your password"
                value={details.password}
                onChange={(e) =>
                  setDetails({
                    ...details,
                    password: e.target.value,
                  })
                }
                className="w-full focus-visible:ring-primaryOrange  "
              />
              <Button
                variant="link"
                onClick={(e) => {
                  e.preventDefault();
                  setIsPassVisible && setIsPassVisible(!isPassVisible);
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 focus-visible:ring-primaryOrange focus-visible:ring-offset-0"
              >
                {isPassVisible ? <LucideEyeOff /> : <LucideEye />}
              </Button>
            </Label>
            <Label className="w-full rounded-2xl relative space-y-2">
              <span className="font-normal text-gray-700">
                Confirm Password
              </span>
              <Input
                required
                type={isPassVisible ? "text" : "password"}
                placeholder="Confirm your password"
                value={details.confirmPassword}
                onChange={(e) =>
                  setDetails({
                    ...details,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full focus-visible:ring-primaryOrange  "
              />
              <Button
                variant="link"
                onClick={(e) => {
                  e.preventDefault();
                  setIsPassVisible && setIsPassVisible(!isPassVisible);
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 focus-visible:ring-primaryOrange focus-visible:ring-offset-0"
              >
                {isPassVisible ? <LucideEyeOff /> : <LucideEye />}
              </Button>
            </Label>
          </>
        )}
        <Label className="w-full rounded-2xl my-3 mb-5 space-y-2">
          <span className="font-normal text-gray-700">Phone</span>
          <div className="flex">
            <Input
              className="rounded-r-none w-14 px-2 focus-visible:ring-primaryOrange focus-visible:ring-offset-0"
              value={details.countryCode}
              readOnly
            />
            <Input
              required
              type="tel"
              placeholder="Enter your mobile number"
              value={details.phone}
              onChange={(e) =>
                setDetails({
                  ...details,
                  phone: e.target.value,
                })
              }
              className="w-full focus-visible:ring-primaryOrange focus-visible:ring-offset-0 rounded-l-none"
            />
          </div>
        </Label>
        <Button
          type="submit"
          disabled={registerMutation && registerMutation.isPending}
          className="w-full p-2 flex items-center justify-center rounded-2xl mb-3 bg-primaryOrange hover:bg-primaryOrange/80 text-black font-semibold"
        >
          <div className="w-full flex items-center justify-center p-2">
            {registerMutation && registerMutation.isPending ? (
              <LoadingSpinner className="size-6 border-t-white" />
            ) : (
              <span>{type === "REGISTER" ? "Register" : "Update"}</span>
            )}
          </div>
        </Button>
        {type === "REGISTER" && (
          <Button
            className="rounded-2xl w-full p-2 flex items-center justify-center border-primaryOrange font-semibold"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              setModalType && setModalType("LOGIN");
            }}
          >
            Already have an account?
          </Button>
        )}
      </form> */}

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 flex items-center justify-center ">
      <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
              <img src={User.image || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Profile Details
          </CardTitle>
          <CardDescription className="text-gray-500">Your account information</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">First Name</div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">{User.firstName}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">Last Name</div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">{User.lastName}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Email Address</div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">{User.email}</div>
            </div>

            {/* <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Phone</div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-500 text-sm break-all">
                {User.phone}
              </div>
            </div> */}
          </div>
        </CardContent>
      </Card>
    </div>

    </>
  );
}

export default RegisterForm;
