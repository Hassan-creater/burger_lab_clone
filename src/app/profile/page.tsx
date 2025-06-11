import RegisterForm from "@/components/RegisterForm";
import { UserDetails } from "@/types";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { dummyUser } from "@/lib/dummyData";

export const metadata: Metadata = {
  title: "Profile - Burger Lab",
  description: "Profile Page",
};

export const dynamic = "force-dynamic";

//  TODO Properly handle fetch errors.
export default async function Profile() {
  // Using dummy data instead
  const user = dummyUser;
  if (!user?.userId) {
    redirect("/");
  }

  return (
    <main className="w-[90%] lg:max-w-[70%] mx-auto my-5 min-h-screen flex flex-col">
      <h1 className="text-lg font-bold mt-10 mb-7 text-gray-700">Profile</h1>
      <section className="bg-white rounded-lg h-max border-gray-200 border shadow-sm px-56 py-10">
        <RegisterForm user={user} type="UPDATE" />
      </section>
    </main>
  );
}
