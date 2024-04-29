"use client";
import React, { useEffect, useState, } from "react";
import { db } from "@/firebase";
import axios from "axios";
import { doc, getDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";

export function usePlan() {
  const { data: session } = useSession();
  const [active, setActivePlan] = useState(false);
  const [customerPortal, setCustomerPortal] = useState();

  const checkActivePlanOrNot = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", session?.user?.email));
      if (!userDoc.exists()) {
        console.error("User document does not exist");
        return;
      }

      const userData = userDoc.data();
      const { subId, portalUrl } = userData;

      if (!subId) {
        console.error("Subscription ID is missing");
        return;
      }

      setCustomerPortal(portalUrl);

      const response = await axios.post(`/api/checkout_sessions/${subId}`, {
        email: session?.user?.email
      });
      const data = response.data;

      setActivePlan(data.status === "active");
    } catch (error) {
      console.error("Failed to check active plan:", error);
      setActivePlan(false);
    }
  };

  useEffect(() => {
    if (session && session.user && session.user.email) {
      checkActivePlanOrNot();
    }
  }, [session]);

  return { checkActivePlanOrNot, active, customerPortal };
}
