"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { designVar } from "@/designVar/desighVar";


interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

export function ProfileDisplay({ profile }: { profile: UserProfile }) {
  return (
    <div className="max-w-md mx-auto p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl space-y-8">
      {/* Photo + Name */}
      <div className="flex items-center space-x-6">
        {/* Photo container */}
        <div
          className="w-24 h-24 bg-center bg-cover rounded-full ring-4 ring-indigo-200 shadow-lg"
          style={{ backgroundImage: `url(${profile.image})` }}
        />
        <div>
          <p className={`text-2xl font-semibold text-gray-800 ${designVar.fontFamily}`}>
            {profile.firstName} {profile.lastName}
          </p>
          <p className={`text-sm text-gray-500 ${designVar.fontFamily}`}>ID: {profile.id}</p>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email" className={`${designVar.fontFamily}`}>Email</Label>
          <Input
            id="email"
            readOnly
            value={profile.email}
            className="bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="firstName" className={`${designVar.fontFamily}`}>First Name</Label>
          <Input
            id="firstName"
            readOnly
            value={profile.firstName}
            className="bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className={`${designVar.fontFamily}`}>Last Name</Label>
          <Input
            id="lastName"
            readOnly
            value={profile.lastName}
            className="bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}
