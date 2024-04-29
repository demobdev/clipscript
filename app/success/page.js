// SuccessPage.js
"use client";
import { db } from "@/firebase";
import axios from "axios";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";

function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const { data: session, status } = useSession();
  const [message, setMessage] = useState("");

  const fetchCheckoutSessionData = useCallback(async () => {
    if (!session) {
      console.log("Session not found, redirecting to sign in.");
      router.push("/signin");
      return;
    }

    try {
      const checkSessionDetails = await axios.post(
        `/api/checkout_sessions/${session_id}?email=${session.user.email}`
      );
      const data = checkSessionDetails.data;
      const createCustomerPortal = await axios.post(
        `/api/checkout_sessions/portal`,
        { customerId: data.customer }
      );
      const portalSession = createCustomerPortal.data;
      const portalUrl = portalSession.url;

      if (!portalUrl) {
        console.error("Portal URL is undefined");
        setMessage("error");
        return; // Stops execution if portal URL is undefined to prevent further errors
      }

      const userDoc = await getDoc(doc(db, "users", session.user.email));

      const userData = {
        paid: true,
        checkoutSessionId: data.id,
        subId: data.subscription,
        portalUrl,
        customerEmail: data.customer_details.email,
        customerName: data.customer_details.name,
        email: session.user.email,
        timestamp: serverTimestamp(),
      };

      if (userDoc.exists()) {
        await updateDoc(doc(db, "users", session.user.email), userData);
      } else {
        await setDoc(doc(db, "users", session.user.email), userData);
      }
      setMessage("success");
      setTimeout(() => router.push("/"), 4000);
    } catch (error) {
      console.error("Error processing payment details:", error);
      setMessage("error");
    }
  }, [session, session_id, router]);

  useEffect(() => {
    if (status === "authenticated" && session_id) {
      fetchCheckoutSessionData();
    }
  }, [status, session_id, fetchCheckoutSessionData]);

  if (!session || !session_id) {
    return (
      <div className="w-full min-h-screen bg-black text-white flex items-center justify-center flex-col">
        Loading...
      </div>
    );
  }

  if (message === "error") {
    return (
      <div className="w-full min-h-screen bg-black text-white flex items-center justify-center flex-col">
        <h1>There is an error validating your payment details.</h1>
      </div>
    );
  }

  if (message === "success") {
    return (
      <div className="w-full min-h-screen bg-black text-white flex items-center justify-center flex-col">
        <h1 className="text-2xl">
          Thanks for your purchase, {session.user.name}!
        </h1>
        <p>Redirecting now...</p>
      </div>
    );
  }
}

export default SuccessPage;
