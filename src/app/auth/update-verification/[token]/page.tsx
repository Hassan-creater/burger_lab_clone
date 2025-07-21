
'use client'
import React, { useState } from "react";
import { createPortal } from "react-dom";

import { apiClient } from "@/lib/api";
import { toast } from "sonner";

interface UpdateVerificationPageProps {
  params: Promise<{ token: string }>;
}

const SuccessTick = () => (
  <svg
    className="w-16 h-16 text-green-500 mb-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2l4-4"
    />
  </svg>
);

const CrossIcon = () => (
  <svg
    className="w-16 h-16 text-red-500 mb-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 9l-6 6m0-6l6 6"
    />
  </svg>
);

const UpdateVerificationPage: React.FC<UpdateVerificationPageProps> = ({ params }) => {
  const { token } = React.use(params);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [alreadyVerified, setAlreadyVerified] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.put(`/auth/update-verification/${token}`);
      if (res.status === 204 && res.data?.success) {
        setSuccess(true);
      } else if (res.status == 409){
        setAlreadyVerified(true);
        setError(res.data?.error || "User is already verified");
      } else {
        setError(res.data?.message || "Verification failed.");
      }
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setAlreadyVerified(true);
        setError(err?.response?.data?.error || "User is already verified");
      } else {
        setError(err?.response?.data?.message || "Verification failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="bg-white rounded-lg  p-8 flex flex-col items-center max-w-lg w-full">
        {success ? (
          <>
            <SuccessTick />
            <h2 className="text-xl font-bold mb-2 text-green-600">Your account is verified</h2>
            <p className="text-gray-700">You can close this page.</p>
          </>
        ) : alreadyVerified ? (
          <>
            <CrossIcon />
            <h2 className="text-xl font-bold mb-2 text-red-600">{error || "User is already verified"}</h2>
            <p className="text-gray-700">You can close this page.</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Clink on Button to verify you Account.</h1>
            <button
              onClick={handleVerify}
              disabled={loading}
              className="mt-4 px-6 py-2 bg-primaryOrange text-white rounded hover:bg-orange-600 disabled:opacity-60 font-semibold"
            >
              {loading ? "Verifying..." : "Verify Account"}
            </button>
            {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
          </>
        )}
      </div>
    </div>
  );

  // Only render portal on client
  if (!mounted) return null;
  return createPortal(content, document.body);
};

export default UpdateVerificationPage; 