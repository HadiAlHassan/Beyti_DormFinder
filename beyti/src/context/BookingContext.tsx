"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCookie } from "@/utils/cookieUtils";

interface DormOwner {
  _id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number: number;
  email: string;
  picture?: {
    data: { type: "Buffer"; data: number[] };
    contentType: string;
  };
}

interface Building {
  _id: string;
  name: string;
  address: string;
  rules: {
    smoking: boolean;
    petsAllowed: boolean;
    noiseRestrictions: boolean;
    otherPolicies?: string;
  };
}

interface Apartment {
  _id: string;
  name: string;
  description?: string;
  pricePerMonth: number;
  capacity: number;
  availableSpots: number;
  isBooked: boolean;
  amenities?: string[];
  pictures?: {
    data: { type: "Buffer"; data: number[] };
    contentType: string;
  }[];
}

interface ActiveBooking {
  _id: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  checkInDate: string;
  checkOutDate: string;
  apartment: Apartment;
  building: Building;
  dormOwner: DormOwner;
}

interface BookingContextType {
  activeBooking: ActiveBooking | null;
  setActiveBooking: (booking: ActiveBooking | null) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeBooking, setActiveBooking] = useState<ActiveBooking | null>(
    null
  );

  useEffect(() => {
    async function fetchBooking() {
      try {
        const { token, userId } = getCookie();
        if (!token || !userId) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/active/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setActiveBooking(data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch active booking:", err);
      }
    }

    fetchBooking();
  }, []);

  return (
    <BookingContext.Provider value={{ activeBooking, setActiveBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
