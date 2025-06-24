// "use client";

// import React, { useCallback, useEffect } from "react";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogFooter,
//   DialogTrigger,
// } from "../ui/dialog";
// import { Button } from "../ui/button";
// import { LucideEye, LucideEyeOff, XIcon } from "lucide-react";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import Link from "next/link";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { getUser, login, register } from "@/functions";
// import { useRouter } from "next/navigation";
// import useLocalStorage from "@/hooks/useLocalStorage";
// import { useUserStore } from "@/store/slices/userSlice";
// import LoadingSpinner from "../LoadingSpinner";
// import { toast } from "sonner";
// import RegisterForm from "../RegisterForm";

// type Props = {};

// function AuthModal({}: Props) {
//   const [modalType, setModalType] = React.useState<
//     "LOGIN" | "REGISTER" | "RESET"
//   >("LOGIN");

//   const [loginDetails, setLoginDetails] = React.useState({
//     email: "",
//     password: "",
//   });

//   const [registerDetails, setRegisterDetails] = React.useState({
//     email: "",
//     password: "",
//     confirmPassword: "",
//     name: "",
//     countryCode: "+92",
//     phone: "",
//   });

//   const [error, setError] = React.useState(() => ({
//     status: false,
//     message: "",
//   }));

//   const [isPassVisible, setIsPassVisible] = React.useState(false);

//   const loginMutation = useMutation({
//     mutationFn: () => login(loginDetails.email, loginDetails.password),
//     onSuccess(data) {
//       if (data.user?.status === "error") {
//         console.log(data.user);
//         setError(() => ({
//           status: Boolean(data.user?.status),
//           message: data.user?.message || "Something went wrong",
//         }));
//         return;
//       }
//       location.reload();
//     },
//   });

//   const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     loginMutation.mutate();
//   };

//   const renderModalContent = () => {
//     if (modalType === "LOGIN") {
//       return (
//         <div className="flex flex-col items-center justify-center">
//           <h3 className="text-2xl font-bold mb-3">Welcome Back</h3>
//           {error.status && !loginMutation.isPending && (
//             <p className="text-red-500 mb-3">{error.message}</p>
//           )}
//           <form
//             className="flex w-full flex-col items-center justify-center mb-1"
//             onSubmit={handleLogin}
//           >
//             <Label className="w-full rounded-2xl mb-4">
//               <span className="sr-only">Email</span>
//               <Input
//                 required
//                 type="email"
//                 placeholder="Enter your email"
//                 value={loginDetails.email}
//                 onChange={(e) =>
//                   setLoginDetails({ ...loginDetails, email: e.target.value })
//                 }
//                 className="w-full focus-visible:ring-primaryOrange     "
//               />
//             </Label>
//             <Label className="w-full rounded-2xl relative">
//               <span className="sr-only">Password</span>
//               <Input
//                 required
//                 type={isPassVisible ? "text" : "password"}
//                 placeholder="Enter your password"
//                 value={loginDetails.password}
//                 onChange={(e) =>
//                   setLoginDetails({
//                     ...loginDetails,
//                     password: e.target.value,
//                   })
//                 }
//                 className="w-full focus-visible:ring-primaryOrange  "
//               />
//               <Button
//                 variant="link"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   setIsPassVisible(!isPassVisible);
//                 }}
//                 className="absolute right-0 top-1/2 -translate-y-1/2 focus-visible:ring-primaryOrange focus-visible:ring-offset-0"
//               >
//                 {isPassVisible ? <LucideEyeOff /> : <LucideEye />}
//               </Button>
//             </Label>
//             <Button
//               className="w-max p-2 self-end my-1"
//               variant="link"
//               onClick={(e) => {
//                 e.preventDefault();
//                 setModalType("RESET");
//               }}
//             >
//               Forgot Password?
//             </Button>
//             <Button
//               type="submit"
//               disabled={loginMutation.isPending}
//               className="w-full p-2 flex items-center justify-center rounded-2xl mb-3 bg-primaryOrange hover:bg-primaryOrange/80 text-black font-semibold"
//             >
//               <div className="w-full flex items-center justify-center p-2">
//                 {loginMutation.isPending ? (
//                   <LoadingSpinner className="size-6 border-t-white" />
//                 ) : (
//                   <span>Login</span>
//                 )}
//               </div>
//             </Button>
//             <Button
//               className="rounded-2xl w-full p-2 flex items-center justify-center border-primaryOrange font-semibold"
//               variant="outline"
//               disabled={loginMutation.isPending}
//               onClick={(e) => {
//                 e.preventDefault();
//                 setModalType("REGISTER");
//               }}
//             >
//               Register
//             </Button>
//           </form>
//         </div>
//       );
//     }
//     if (modalType === "REGISTER") {
//       return (
//         <div className="flex flex-col items-center justify-center">
//           <h3 className="text-2xl font-bold mb-3">Register</h3>
//           <RegisterForm
//             isPassVisible={isPassVisible}
//             setIsPassVisible={setIsPassVisible}
//             setModalType={setModalType}
//           />
//         </div>
//       );
//     }
//     if (modalType === "RESET") {
//       return (
//         <div className="flex flex-col items-center justify-center">
//           <h3 className="text-2xl font-bold mb-3">Change Your Password!</h3>
//           <form className="flex w-full flex-col items-center justify-center">
//             <Label className="w-full rounded-2xl my-4 mb-6">
//               <span className="sr-only">Email</span>
//               <Input
//                 required
//                 type="email"
//                 placeholder="Enter your email"
//                 className="w-full focus-visible:ring-primaryOrange     "
//               />
//             </Label>
//             <Button
//               type="submit"
//               className="w-full p-2 flex items-center justify-center rounded-2xl mb-3 bg-primaryOrange hover:bg-primaryOrange/80 text-black font-semibold"
//             >
//               Send Verification Code
//             </Button>
//             <Button
//               className="rounded-2xl w-full p-2 flex items-center justify-center border-primaryOrange font-semibold"
//               variant="outline"
//               onClick={(e) => {
//                 e.preventDefault();
//                 setModalType("LOGIN");
//               }}
//             >
//               Go Back To Login
//             </Button>
//           </form>
//         </div>
//       );
//     }

//     return null;
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button
//           variant="outline"
//           className={
//             "px-4 py-2 font-bold text-black bg-primaryOrange/60 rounded-xl text-xs !hover:border-[#fabf2c] hover:bg-primaryBg"
//           }
//         >
//           Login / Register
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="w-[80%] sm:w-[40%] max-w-full h-max min-h-40 flex flex-col px-5 py-6 gap-0 rounded-xl border-0 descriptionModal">
//         {renderModalContent()}
//         <DialogClose className="bg-black/80 p-1 rounded-xl text-white right-2 top-2 sm:right-2 sm:top-2">
//           <XIcon className="w-6 h-6" />
//         </DialogClose>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default AuthModal;
