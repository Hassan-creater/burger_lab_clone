"use client";

import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LucideEye, LucideEyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";
import { register, updateUserDetails } from "@/functions";
import { toast } from "sonner";
import { UserDetails } from "@/types";

//TODO Import all Logic for Register into the component itself.

type Props = {
  isPassVisible?: boolean;
  setIsPassVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setModalType?: React.Dispatch<
    React.SetStateAction<"LOGIN" | "REGISTER" | "RESET">
  >;
  user?: UserDetails;
  type?: "REGISTER" | "UPDATE";
};

function RegisterForm({
  isPassVisible,
  setIsPassVisible,
  setModalType,
  user,
  type = "REGISTER",
}: Props) {
  const [details, setDetails] = React.useState({
    email: user?.email || "",
    password: "",
    confirmPassword: "",
    name: user?.name || "",
    countryCode: user?.phone.slice(0, 3) || "+92",
    phone: user?.phone.slice(3) || "",
  });

  const [error, setError] = React.useState(() => ({
    status: false,
    message: "",
  }));

  const registerMutation = useMutation({
    mutationFn: () =>
      register(
        details.name,
        details.email,
        details.password,
        `${details.countryCode}${details.phone}`
      ),
    onSuccess(data) {
      if (data.status === "error") {
        console.log(data.message);
        setError(() => ({
          status: Boolean(data.status),
          message: data.message || "Something went wrong",
        }));
        return;
      }
      toast.success("User Registered Successfully.", {
        style: { backgroundColor: "green", color: "white" },
        closeButton: true,
        dismissible: true,
      });
      setError(() => ({ status: false, message: "" }));
      setModalType && setModalType("LOGIN");
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateUserDetails(
        user?.id!,
        details.name,
        details.email,
        `${details.countryCode}${details.phone}`
      ),
    onSuccess(data) {
      if (data.status === 500) {
        console.log(data.error);
        setError(() => ({
          status: Boolean(data.status),
          message: data.error || "Something went wrong",
        }));
        return;
      }
      location.reload();
    },
  });

  const handleAction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type === "REGISTER") {
      if (details.password !== details.confirmPassword) {
        setError(() => ({
          status: true,
          message: "Password and Confirm Password do not match",
        }));
        return;
      }
    }

    if (
      details.phone.startsWith(details.countryCode) ||
      details.phone.startsWith("+")
    ) {
      setError(() => ({
        status: true,
        message: "Phone number must not include the country code",
      }));
      return;
    }

    type === "REGISTER" ? registerMutation.mutate() : updateMutation.mutate();
  };

  return (
    <>
      {error.status && !registerMutation.isPending && (
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
      </form>
    </>
  );
}

export default RegisterForm;
