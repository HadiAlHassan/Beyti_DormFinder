"use client";

import { useEffect, useState } from "react";
import { getMyBuildings } from "@/utils/BuildingAPI";
import BuildingCard from "./BuildingCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Apartment {
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
  amenities: string[];
  isVisible: boolean;
  rules: {
    smoking: boolean;
    petsAllowed: boolean;
    noiseRestrictions: boolean;
    otherPolicies?: string;
  };
  apartments: Apartment[];
  pictures?: {
    data: { type: "Buffer"; data: number[] };
    contentType: string;
  }[];
}

interface MyPropertiesListProps {
  onAddApartment: (buildingId: string) => void;
}

const MyPropertiesList: React.FC<MyPropertiesListProps> = ({
  onAddApartment,
}) => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await getMyBuildings();
        setBuildings(response);
      } catch (err) {
        console.error("Error loading properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (buildings.length === 0) {
    return (
      <p className="text-muted-foreground text-center">
        No buildings added yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {buildings.map((building) => (
        <BuildingCard
          key={building._id}
          building={building}
          onAddApartment={onAddApartment}
        />
      ))}
    </div>
  );
};

export default MyPropertiesList;
