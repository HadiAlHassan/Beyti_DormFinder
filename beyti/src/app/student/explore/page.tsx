"use client";

import React, { useEffect, useState } from "react";
import DormSearchBar from "@/components/StudentDashboard/SeachBarCompDorms";
import { getDistanceFromLatLonInKm } from "@/lib/distance";
import { Building } from "@/types"; // if you have types, otherwise use any

const LAU_LAT = 33.8959;
const LAU_LON = 35.4786;

const Page = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [filteredBuildings, setFilteredBuildings] = useState<Building[]>([]);
  const [viewMode, setViewMode] = useState<"map" | "catalog">("map");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/buildings-with-apartments");
      const data = await res.json();
      setBuildings(data);
      setFilteredBuildings(data); // show all by default
    };
    fetchData();
  }, []);

  const handleSearch = (criteria: any) => {
    const filtered = buildings.filter((building) =>
      building.apartments.some((apt) => {
        const matchesPrice =
          (!criteria.priceRange.min || apt.pricePerMonth >= criteria.priceRange.min) &&
          (!criteria.priceRange.max || apt.pricePerMonth <= criteria.priceRange.max);

        const matchesType =
          !criteria.apartmentType ||
          (criteria.apartmentType === "private" && apt.capacity === 1) ||
          (criteria.apartmentType === "shared" && apt.capacity > 1);

        const matchesAmenities = criteria.amenities.every((a: string) => apt.amenities.includes(a));

        const matchesName =
          !criteria.name || building.name.toLowerCase().includes(criteria.name.toLowerCase());

        const distance = getDistanceFromLatLonInKm(building.lat, building.lon, LAU_LAT, LAU_LON);
        const matchesProximity = !criteria.proximity || distance <= criteria.proximity;

        return matchesPrice && matchesType && matchesAmenities && matchesName && matchesProximity;
      })
    );

    setFilteredBuildings(filtered);
  };

  return (
    <div className="p-4 space-y-4">
<div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
  {/* Left: Search bar takes full width except toggle */}
  <div className="flex-1">
    <DormSearchBar onSearch={handleSearch} />
  </div>

  {/* Right: View mode buttons */}
  <div className="flex gap-2 self-end sm:self-auto">
    <button
      onClick={() => setViewMode("map")}
      className={`px-4 py-2 text-sm rounded border ${
        viewMode === "map"
          ? "bg-primary text-white"
          : "bg-white text-gray-700 border-gray-300"
      }`}
    >
      Map
    </button>
    <button
      onClick={() => setViewMode("catalog")}
      className={`px-4 py-2 text-sm rounded border ${
        viewMode === "catalog"
          ? "bg-primary text-white"
          : "bg-white text-gray-700 border-gray-300"
      }`}
    >
      Catalog
    </button>
  </div>
</div>


      {/* Conditional view rendering */}
      {viewMode === "map" ? (
        <div className="border rounded p-10 text-center text-gray-500 bg-gray-100">
          🗺️ Map view placeholder — will be replaced with real map
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuildings.length > 0 ? (
            filteredBuildings.map((building) => (
              <div key={building._id} className="border p-4 rounded shadow">
                <h3 className="text-lg font-semibold">{building.name}</h3>
                <p className="text-sm">{building.address}</p>
                <p className="text-sm">{building.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">No buildings match your search.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
