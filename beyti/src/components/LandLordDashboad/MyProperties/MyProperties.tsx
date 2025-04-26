"use client";

import { useState } from "react";
import { useBuildings } from "@/context/BuildingsContext";
import BuildingCard from "./BuildingCard";
import LoadingSpinner from "@/components/LoadingSpinner";

const MyProperties = () => {
  const { buildings, isLoading, refetchBuildings } = useBuildings();
  const [filter, setFilter] = useState("");

  const filtered =
    buildings?.filter((b) =>
      b.name.toLowerCase().includes(filter.toLowerCase())
    ) ?? [];

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search buildings..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((building) => (
            <BuildingCard
              key={building._id}
              building={building}
              refetchBuildings={async () => refetchBuildings()}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center text-sm">
          No buildings found.
        </p>
      )}
    </div>
  );
};

export default MyProperties;
