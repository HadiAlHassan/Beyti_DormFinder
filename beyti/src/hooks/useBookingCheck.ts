"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/utils/cookieUtils";

export function useBookingCheck(): boolean {
  const [hasCurrentDorm, setHasCurrentDorm] = useState(false);

  useEffect(() => {
    const { userId, token } = getCookie();
    if (!userId || !token) return;

    // 🧠 Check if cached and matches current user
    const cachedValue = sessionStorage.getItem("hasCurrentDorm");
    const cachedUser = sessionStorage.getItem("cachedDormUserId");

    if (cachedValue === "true" && cachedUser === userId) {
      setHasCurrentDorm(true);
      return;
    }

    const checkActiveBooking = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/active/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const result = await res.json();
          if (result && result.checkInDate && result.checkOutDate) {
            const now = new Date();
            const checkIn = new Date(result.checkInDate);
            const checkOut = new Date(result.checkOutDate);

            if (now >= checkIn && now <= checkOut) {
              setHasCurrentDorm(true);
              sessionStorage.setItem("hasCurrentDorm", "true");
              sessionStorage.setItem("cachedDormUserId", userId);
            }
          }
        }
      } catch (err) {
        console.error("Booking check failed:", err);
      }
    };

    checkActiveBooking();
  }, []);

  return hasCurrentDorm;
}
