
import RegisterForm from "@/components/RegisterForm";
import { UserDetails } from "@/types";
import { Metadata } from "next";
import  Cookies  from "js-cookie";
import { redirect } from "next/navigation";
import { dummyUser } from "@/lib/dummyData";
import { cookies } from "next/headers";
import ProfileDisplay from "./form/ProfileForm";
import { designVar } from "@/designVar/desighVar";
import LogOut from "./form/LgoutFromAll";


export const metadata: Metadata = {
  title: "Profile - Burger Lab",
  description: "Profile Page",
};

export const dynamic = "force-dynamic";

//  TODO Properly handle fetch errors.
export default async function Profile() {

   const cookieStore = await cookies();

    // Retrieve the userData cookie
    const userCookie = cookieStore.get("userData");

    // Parse user data safely
    const user = userCookie ? JSON.parse(userCookie.value) : null;


  return (
    <main className={`w-[90%] lg:max-w-[70%]  relative  mx-auto my-5  flex flex-col ${designVar.fontFamily}`}>
      <div className="w-full flex justify-center items-center"><h1 className={`text-xl text-center font-bold mt-10  text-gray-700 ${designVar.fontFamily}`}>Profile</h1>
     
      </div>
      <div className="absolute right-0 top-10 "> <LogOut  /></div>
      

      <section className=" rounded-lg ">
        <ProfileDisplay  />
      </section>
    </main>
  );
}
