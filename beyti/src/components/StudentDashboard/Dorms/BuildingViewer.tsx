"use client";

import { useEffect, useState } from "react";
import { getStudentBuildingById } from "@/utils/StudentBuildingAPI";
import ApartmentCard from "./ApartmentCard";

interface BuildingViewerProps {
  buildingId: string;
}

interface Apartment {
  _id: string;
  name: string;
  description?: string;
  pricePerMonth: number;
  capacity: number;
  availableSpots: number;
  isBooked: boolean;
  amenities: string[];
}

export default function BuildingViewer({ buildingId }: BuildingViewerProps) {
  const [building, setBuilding] = useState<{
    name: string;
    address: string;
    description: string;
    apartments: Apartment[];
  } | null>(null);

  useEffect(() => {
    getStudentBuildingById(buildingId)
      .then(setBuilding)
      .catch((err) => console.error("Failed to load building", err));
  }, [buildingId]);

  if (!building) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{building.name}</h1>
        <p className="text-muted-foreground">{building.address}</p>
        <p className="text-muted-foreground">{building.description}</p>
      </div>

      {!building.apartments || building.apartments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No apartments yet in this building.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {building.apartments.map((apt) => (
            <ApartmentCard
              key={apt._id}
              apartment={apt}
              onView={() => console.log("View", apt._id)}
              onEdit={() => console.log("Edit", apt._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
