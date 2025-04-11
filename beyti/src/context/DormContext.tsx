"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getCookie } from "@/utils/cookieUtils";

interface Apartment {
  amenities?: string[] | undefined;
  _id: string;
  name: string;
  pricePerMonth: number;
  capacity: number;
  availableSpots: number;
  isBooked: boolean;
}

interface Building {
  _id: string;
  name: string;
  address: string;
  description: string;
  lat: number;
  lon: number;
  isVisible: boolean;
  ispublic: boolean;
  rules: {
    smoking: boolean;
    petsAllowed: boolean;
    noiseRestrictions: boolean;
    otherPolicies?: string;
  };
  apartments: Apartment[];
}

interface DormContextType {
  buildings: Building[] | null;
  loading: boolean;
  error: string | null;
}

const DormDataContext = createContext<DormContextType>({
  buildings: null,
  loading: true,
  error: null,
});

export const DormDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [buildings, setBuildings] = useState<Building[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDorms = async () => {
      try {
        const { token } = getCookie();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/buildings-with-apartments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setBuildings(data);
      } catch (err) {
        setError("Failed to fetch dorms");
      } finally {
        setLoading(false);
      }
    };

    fetchDorms();
  }, []);

  return (
    <DormDataContext.Provider value={{ buildings, loading, error }}>
      {children}
    </DormDataContext.Provider>
  );
};

export const useDormData = () => useContext(DormDataContext);
