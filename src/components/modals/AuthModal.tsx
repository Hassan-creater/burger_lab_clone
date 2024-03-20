"use client";

import React, { useCallback, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { LucideEye, LucideEyeOff, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { checkLoginStatus, login } from "@/functions";

type Props = {};

function AuthModal({}: Props) {
  const [modalType, setModalType] = React.useState<
    "LOGIN" | "REGISTER" | "RESET"
  >("LOGIN");

  const [loginDetails, setLoginDetails] = React.useState({
    email: "",
    password: "",
  });

  const [isPassVisible, setIsPassVisible] = React.useState(false);

  const loginMutation = useMutation({
    mutationFn: () => login(loginDetails.email, loginDetails.password),
  });

  const handleLogin = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      loginMutation.mutate();
      // if (loginMutation.status === "success")
    },
    [loginMutation]
  );

  useEffect(() => {
    checkLoginStatus().then(({ isLoggedIn }) => {
      if (isLoggedIn) alert("Logged in");
      else alert("Not logged in");
    });
  }, [loginMutation.data?.status]);

  const renderModalContent = () => {
    if (modalType === "LOGIN") {
      return (
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-2xl font-bold mb-3">Welcome Back</h3>
          <form
            className="flex w-full flex-col items-center justify-center mb-1"
            onSubmit={handleLogin}
          >
            <Label className="w-full rounded-2xl mb-4">
              <span className="sr-only">Email</span>
              <Input
                required
                type="email"
                placeholder="Enter your email"
                value={loginDetails.email}
                onChange={(e) =>
                  setLoginDetails({ ...loginDetails, email: e.target.value })
                }
                className="w-full focus-visible:ring-primaryOrange     "
              />
            </Label>
            <Label className="w-full rounded-2xl relative">
              <span className="sr-only">Password</span>
              <Input
                required
                type={isPassVisible ? "text" : "password"}
                placeholder="Enter your password"
                value={loginDetails.password}
                onChange={(e) =>
                  setLoginDetails({
                    ...loginDetails,
                    password: e.target.value,
                  })
                }
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
                setModalType("RESET");
              }}
            >
              Forgot Password?
            </Button>
            <Button
              type="submit"
              className="w-full p-2 flex items-center justify-center rounded-2xl mb-3 bg-primaryOrange hover:bg-primaryOrange/80 text-black font-semibold"
            >
              Login
            </Button>
            <Button
              className="rounded-2xl w-full p-2 flex items-center justify-center border-primaryOrange font-semibold"
              variant="outline"
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
          <h3 className="text-2xl font-bold mb-3">Enter Your Mobile Number</h3>

          <form className="flex w-full flex-col items-center justify-center">
            <p className="text-sm font-semibold mb-3 text-left self-start">
              Please confirm your country code and re-enter your mobile number
            </p>
            <Label className="w-full rounded-2xl my-3 mb-5 flex">
              <span className="sr-only">Email</span>
              <Input
                className="rounded-r-none w-14 px-2 focus-visible:ring-primaryOrange focus-visible:ring-offset-0"
                value={"+92"}
                readOnly
              />
              <Input
                required
                type="tel"
                placeholder="Enter your mobile number"
                className="w-full focus-visible:ring-primaryOrange focus-visible:ring-offset-0 rounded-l-none"
              />
            </Label>
            <p className="text-sm font-semibold mb-3">
              This site is protected by reCAPTCHA and the Google{" "}
              <Link
                href="https://policies.google.com/privacy"
                rel="noreferrer"
                target="_blank"
              >
                Privacy Policy
              </Link>
              and{" "}
              <Link
                href="https://policies.google.com/terms"
                rel="noreferrer"
                target="_blank"
              >
                Terms of Service
              </Link>{" "}
              apply.
            </p>
            <Button
              type="submit"
              className="w-full p-2 flex items-center justify-center rounded-2xl mb-3 bg-primaryOrange hover:bg-primaryOrange/80 text-black font-semibold"
            >
              Proceed
            </Button>
            <Button
              className="rounded-2xl w-full p-2 flex items-center justify-center border-primaryOrange font-semibold"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                setModalType("LOGIN");
              }}
            >
              Already have an account?
            </Button>
          </form>
        </div>
      );
    }
    if (modalType === "RESET") {
      return (
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-2xl font-bold mb-3">Change Your Password!</h3>
          <form className="flex w-full flex-col items-center justify-center">
            <Label className="w-full rounded-2xl my-4 mb-6">
              <span className="sr-only">Email</span>
              <Input
                required
                type="email"
                placeholder="Enter your email"
                className="w-full focus-visible:ring-primaryOrange     "
              />
            </Label>
            <Button
              type="submit"
              className="w-full p-2 flex items-center justify-center rounded-2xl mb-3 bg-primaryOrange hover:bg-primaryOrange/80 text-black font-semibold"
            >
              Send Verification Code
            </Button>
            <Button
              className="rounded-2xl w-full p-2 flex items-center justify-center border-primaryOrange font-semibold"
              variant="outline"
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

    return null;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={
            "p-4 font-bold text-black bg-primaryOrange rounded-3xl !hover:border-[#fabf2c] hover:bg-primaryOrange"
          }
        >
          Login / Register
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[80%] sm:w-[40%] max-w-full h-max min-h-40 flex flex-col px-5 py-6 gap-0 rounded-xl border-0 descriptionModal">
        {renderModalContent()}
        <DialogClose className="bg-black/80 p-1 rounded-xl text-white right-2 top-2 sm:right-2 sm:top-2">
          <XIcon className="w-6 h-6" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;
