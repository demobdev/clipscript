import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { pay } from "@/app/actions/actions";
import { usePlan } from "@/hooks/usePlan";
import CTAButton from "./CTAButton";

function Pricing({ plansPage }) {
  const { data: session, status: sessionStatus } = useSession();
  const { active, customerPortal, error, loading } = usePlan();
  const router = useRouter();
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    if (sessionStatus === 'loading' || loading) {
      setLoadingState(true);
    } else {
      setLoadingState(false);
    }
  }, [sessionStatus, loading]);

  const handleButtonClick = () => {
    if (!session) {
      signIn("google");
    } else if (active) {
      router.replace(customerPortal);
    } else {
      pay(session);
    }
  };

  return (
    <div
      id="Pricing"
      className="min-h-screen w-full flex flex-col items-center justify-start bg-black pt-20 pb-12 px-6"
    >
      <h2 className="text-3xl text-white font-medium text-center">
        Simple pricing, for everyone.
      </h2>
      <p className="w-1/2 text-center mt-4 text-white">
        It doesn’t matter what size your business is, our software scales with you.
      </p>
      <div className="flex items-center justify-center py-20 w-full">
        <div className="bg-white rounded-xl min-h-[400px] min-w-[25%] shadow-xl py-4 px-4 flex flex-col items-start justify-start relative">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-4xl font-medium text-black py-4">$9.99</h2>
            {loadingState ? (
              <p>Loading...</p>
            ) : (
              <button
                onClick={handleButtonClick}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {session ? (active ? "Manage Plan" : "Subscribe") : "Sign In"}
              </button>
            )}
          </div>
          <div className="bg-black/20 w-full h-[0.5px] mb-8" />
          <h2 className="text-xl font-medium">Simple Plan</h2>
          <p className="text-sm">Get instant access to the extension.</p>
          <div className="mt-6 space-y-4">
            <p className="text-sm text-black/80">✓ Summarize any YouTube video</p>
            <p className="text-sm text-black/80">✓ Chat with any YouTube video using AI.</p>
            <p className="text-sm text-black/80">✓ Handle your own API key for better tracking.</p>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">
              Error: {error.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Pricing;
