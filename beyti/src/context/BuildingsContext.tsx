"use client";

import { createContext, useContext } from "react";
import useSWR from "swr";
import { getMyBuildings } from "@/utils/BuildingAPI";
import { Building } from "@/types";

interface BuildingsContextType {
  buildings: Building[] | undefined;
  isLoading: boolean;
  error: unknown;
  refetchBuildings: () => void;
}

const BuildingsContext = createContext<BuildingsContextType | undefined>(
  undefined
);

export const BuildingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, error, isLoading, mutate } = useSWR(
    "landlord_buildings",
    getMyBuildings
  );

  return (
    <BuildingsContext.Provider
      value={{
        buildings: data,
        isLoading,
        error,
        refetchBuildings: () => mutate(),
      }}
    >
      {children}
    </BuildingsContext.Provider>
  );
};

export const useBuildings = () => {
  const ctx = useContext(BuildingsContext);
  if (!ctx) {
    throw new Error("useBuildings must be used inside a BuildingsProvider");
  }
  return ctx;
};
