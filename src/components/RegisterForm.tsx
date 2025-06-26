// "use client";

// import React from "react";
// // import { Label } from "./ui/label";
// // import { Input } from "./ui/input";
// // import { Button } from "./ui/button";
// // import { LucideEye, LucideEyeOff } from "lucide-react";
// // import { useMutation } from "@tanstack/react-query";
// // import LoadingSpinner from "./LoadingSpinner";
// // import { register, updateUserDetails } from "@/functions";
// // import { toast } from "sonner";
// // import { UserDetails } from "@/types";
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"



//   import { useForm } from "react-hook-form";

// type userData= {
//   firstName : string,
//   lastName : string,
//   id : string,
//   image? : string,
//   email : string,

// }

// //TODO Import all Logic for Register into the component itself.

// type Props = {
//   isPassVisible?: boolean;
//   setIsPassVisible?: React.Dispatch<React.SetStateAction<boolean>>;
//   setModalType?: React.Dispatch<
//     React.SetStateAction<"LOGIN" | "REGISTER" | "RESET">
//   >;
//   user?: userData;
//   type?: "REGISTER" | "UPDATE";
// };

// function RegisterForm({
//   isPassVisible,
//   setIsPassVisible,
//   setModalType,
//   user,
//   type = "REGISTER",
// }: Props) {
 
  


//    const initialUser = {
//         firstName: user?.firstName,
//         lastName: user?.lastName,
//         id : user?.id,
//         email: user?.email,
//         image : user?.image,
      
        
//     };


//         const { register, handleSubmit, formState: { isDirty } } = useForm({
//         defaultValues: initialUser
//     });

//     const [User, setUser] = useState(initialUser);

//     const onSubmit = (data: any) => {
//         console.log("Updated Data:", data);
//         setUser(data); // Update user state
//     };





//   return (
//     <>
//       {/* {error.status && !registerMutation.isPending && (
//         <p
//           className={`text-red-500 text-center ${type === "UPDATE" && "mb-3"}`}
//         >
//           {error.message}
//         </p>
//       )}
//       <form
//         className="flex w-full flex-col items-center justify-center"
//         onSubmit={handleAction}
//       >
//         <Label className="w-full rounded-2xl mb-4 space-y-2">
//           <span className="font-normal text-gray-700">Full Name</span>
//           <Input
//             required
//             type="text"
//             placeholder="Enter your Full Name"
//             value={details.name}
//             onChange={(e) =>
//               setDetails({
//                 ...details,
//                 name: e.target.value,
//               })
//             }
//             className="w-full focus-visible:ring-primaryOrange     "
//           />
//         </Label>
//         <Label className="w-full rounded-2xl mb-4 space-y-2">
//           <span className="font-normal text-gray-700">Email</span>
//           <Input
//             required
//             type="email"
//             placeholder="Enter your email"
//             value={details.email}
//             onChange={(e) =>
//               setDetails({
//                 ...details,
//                 email: e.target.value,
//               })
//             }
//             className="w-full focus-visible:ring-primaryOrange     "
//           />
//         </Label>
//         {type === "REGISTER" && (
//           <>
//             <Label className="w-full rounded-2xl mb-4 relative space-y-2">
//               <span className="font-normal text-gray-700">Password</span>
//               <Input
//                 required
//                 type={isPassVisible ? "text" : "password"}
//                 placeholder="Enter your password"
//                 value={details.password}
//                 onChange={(e) =>
//                   setDetails({
//                     ...details,
//                     password: e.target.value,
//                   })
//                 }
//                 className="w-full focus-visible:ring-primaryOrange  "
//               />
//               <Button
//                 variant="link"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   setIsPassVisible && setIsPassVisible(!isPassVisible);
//                 }}
//                 className="absolute right-0 top-1/2 -translate-y-1/2 focus-visible:ring-primaryOrange focus-visible:ring-offset-0"
//               >
//                 {isPassVisible ? <LucideEyeOff /> : <LucideEye />}
//               </Button>
//             </Label>
//             <Label className="w-full rounded-2xl relative space-y-2">
//               <span className="font-normal text-gray-700">
//                 Confirm Password
//               </span>
//               <Input
//                 required
//                 type={isPassVisible ? "text" : "password"}
//                 placeholder="Confirm your password"
//                 value={details.confirmPassword}
//                 onChange={(e) =>
//                   setDetails({
//                     ...details,
//                     confirmPassword: e.target.value,
//                   })
//                 }
//                 className="w-full focus-visible:ring-primaryOrange  "
//               />
//               <Button
//                 variant="link"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   setIsPassVisible && setIsPassVisible(!isPassVisible);
//                 }}
//                 className="absolute right-0 top-1/2 -translate-y-1/2 focus-visible:ring-primaryOrange focus-visible:ring-offset-0"
//               >
//                 {isPassVisible ? <LucideEyeOff /> : <LucideEye />}
//               </Button>
//             </Label>
//           </>
//         )}
//         <Label className="w-full rounded-2xl my-3 mb-5 space-y-2">
//           <span className="font-normal text-gray-700">Phone</span>
//           <div className="flex">
//             <Input
//               className="rounded-r-none w-14 px-2 focus-visible:ring-primaryOrange focus-visible:ring-offset-0"
//               value={details.countryCode}
//               readOnly
//             />
//             <Input
//               required
//               type="tel"
//               placeholder="Enter your mobile number"
//               value={details.phone}
//               onChange={(e) =>
//                 setDetails({
//                   ...details,
//                   phone: e.target.value,
//                 })
//               }
//               className="w-full focus-visible:ring-primaryOrange focus-visible:ring-offset-0 rounded-l-none"
//             />
//           </div>
//         </Label>
//         <Button
//           type="submit"
//           disabled={registerMutation && registerMutation.isPending}
//           className="w-full p-2 flex items-center justify-center rounded-2xl mb-3 bg-primaryOrange hover:bg-primaryOrange/80 text-black font-semibold"
//         >
//           <div className="w-full flex items-center justify-center p-2">
//             {registerMutation && registerMutation.isPending ? (
//               <LoadingSpinner className="size-6 border-t-white" />
//             ) : (
//               <span>{type === "REGISTER" ? "Register" : "Update"}</span>
//             )}
//           </div>
//         </Button>
//         {type === "REGISTER" && (
//           <Button
//             className="rounded-2xl w-full p-2 flex items-center justify-center border-primaryOrange font-semibold"
//             variant="outline"
//             onClick={(e) => {
//               e.preventDefault();
//               setModalType && setModalType("LOGIN");
//             }}
//           >
//             Already have an account?
//           </Button>
//         )}
//       </form> */}

//             <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 flex items-center justify-center ">
//       <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
//         <CardHeader className="text-center pb-6">
//           <div className="mx-auto mb-4">
//             <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
//               <img src={User.image || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
//             </div>
//           </div>
//           <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
//             Profile Details
//           </CardTitle>
//           <CardDescription className="text-gray-500">Your account information</CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           <div className="space-y-5">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <div className="text-sm font-medium text-gray-700">First Name</div>
//                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">{User.firstName}</div>
//               </div>

//               <div className="space-y-2">
//                 <div className="text-sm font-medium text-gray-700">Last Name</div>
//                 <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">{User.lastName}</div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <div className="text-sm font-medium text-gray-700">Email Address</div>
//               <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">{User.email}</div>
//             </div>

           
//           </div>
//         </CardContent>
//       </Card>
//     </div>

//     </>
//   );
// }

// export default RegisterForm;

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

export type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  image?: any;
};



export default function RegisterForm({setModalType}:{setModalType:React.Dispatch<React.SetStateAction<"LOGIN" | "REGISTER">>}) {
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
      
      const res = await apiClient.post("/auth/register", formData);


      if(res.status == 201 || res.status == 200 ){
         toast.success('Registration successful!');
          reset();
          setIsSubmitting(false);
          setModalType("LOGIN");
      }   
  } catch (error: any) { 
      // Extract and display the actual error message from the server
      if (error.response && error.response.data && error.response.data.error) {
          toast.error(error.response.data.error);
          setIsSubmitting(false);
      } else {
          toast.error("Registration failed. Please try again.");
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
    <div className=" flex items-center justify-center w-full h-[38em] overflow-y-scroll">
      <Card className="w-full">
        <CardHeader className="text-center space-y-2 pb-4">
          <CardTitle className="text-2xl font-extrabold text-gray-800">
           Create Account
          </CardTitle>
          {/* <CardDescription className="text-gray-500">
            Fill in your details to get started
          </CardDescription> */}
        </CardHeader>

        <form onSubmit={handleSubmit(submitHandler)}>
        <CardContent className="space-y-4">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden border-2 border-orange-500">
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
             className="mt-1 text-sm text-gray-600"
            {...register("image", {
              required: "Avatar is required",
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
                  {...register("password", { required: "Password is required", minLength: 6 })}
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
              {errors.password && <p className="mt-1 text-xs text-red-500">Min 6 characters</p>}
            </div>

            <div>
              <Label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone *
              </Label>
              <Input
                id="phone"
                {...register("phone", { required: "Phone is required" })}
                type="tel"
                placeholder="123-456-7890"
                className="mt-1 focus:ring-orange-500"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">Required</p>}
            </div>
          </CardContent>

          <CardFooter className="pt-0 flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full py-3 font-semibold rounded-2xl bg-primaryOrange hover:bg-primaryOrange/80 text-black"
              disabled={!allRequiredFilled || isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner className="size-6 border-t-white" /> : "Register"}
            </Button>
            <Button
              variant="outline"
              disabled={isSubmitting}
              className="w-full py-3 font-semibold rounded-2xl border-primaryOrange"
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
