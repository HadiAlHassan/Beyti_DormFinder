"use client";

import { useEffect, useState } from "react";
import { getMyBuildings } from "@/utils/BuildingAPI";
import BuildingCard from "./BuildingCard";

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
        const data = await getMyBuildings();
        setBuildings(data);
      } catch (err) {
        console.error("Error loading properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  if (loading) return <p>Loading properties...</p>;

  return (
    <div className="space-y-6">
      {buildings.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You have no buildings yet.
        </p>
      ) : (
        buildings.map((building) => (
          <BuildingCard
            key={building._id}
            building={building}
            onAddApartment={onAddApartment}
          />
        ))
      )}
    </div>
  );
};

export default MyPropertiesList;
