// context/ApartmentContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getCookie } from "@/utils/cookieUtils";

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
  dormOwner: string;
  building: string;
}

interface ApartmentContextType {
  apartmentsByBuilding: Record<string, Apartment[]> | null;
  loading: boolean;
  error: string | null;
}

const ApartmentContext = createContext<ApartmentContextType>({
  apartmentsByBuilding: null,
  loading: true,
  error: null,
});

export const ApartmentProvider = ({ children }: { children: React.ReactNode }) => {
  const [apartmentsByBuilding, setApartmentsByBuilding] = useState<Record<string, Apartment[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const { token } = getCookie();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/apartments/by-building`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setApartmentsByBuilding(data);
        console.log(data);
      } catch (err) {
        setError("Failed to fetch apartments");
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  return (
    <ApartmentContext.Provider value={{ apartmentsByBuilding, loading, error }}>
      {children}
    </ApartmentContext.Provider>
  );
};

export const useApartmentData = () => useContext(ApartmentContext);
