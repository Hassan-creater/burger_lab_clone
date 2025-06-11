import { UnplugIcon } from "lucide-react";
import React from "react";

const ServiceError = () => {
  return (
    <main className="w-full h-screen flex flex-col gap-2 overflow-x-hidden items-center justify-center px-6">
      <UnplugIcon className="w-24 h-24" />
      <p className="text-lg font-medium text-red-500 text-center">
        Could not Connect to Server. Please Try again Later!
      </p>
    </main>
  );
};

export default ServiceError;
