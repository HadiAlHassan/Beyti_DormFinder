"use client";

import { useEffect, useState } from "react";
import { getMyBuildings } from "@/utils/BuildingAPI";
import { Building } from "@/types";
import BuildingCard from "./BuildingCard";

export default function MyPropertiesList({
  onAddApartment,
}: {
  onAddApartment?: (buildingId: string) => void;
}) {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await getMyBuildings();
        setBuildings(response);
      } catch (err) {
        console.error("Error fetching buildings:", err);
        setBuildings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {loading ? (
        <p className="text-gray-500">Loading buildings...</p>
      ) : buildings.length === 0 ? (
        <p className="text-gray-500">No buildings found.</p>
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
}
