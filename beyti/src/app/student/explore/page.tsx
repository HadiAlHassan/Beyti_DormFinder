"use client";

import React, { useEffect, useState } from "react";
import DormSearchBar from "@/components/StudentDashboard/SeachBarCompDorms";
import { getDistanceFromLatLonInKm } from "@/lib/distance";
import { getCookie } from "@/utils/cookieUtils";
import DormMap from "@/components/StudentDashboard/Dorms/DormMap";
import StudentBuildingCard from "@/components/StudentDashboard/Dorms/BuildingCard";

const LAU_LAT = 33.8959;
const LAU_LON = 35.4786;

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

interface SearchCriteria {
  name?: string;
  priceRange: {
    min?: number;
    max?: number;
  };
  apartmentType?: "private" | "shared";
  proximity?: number;
  amenities?: string[];
}

const Page: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [filteredBuildings, setFilteredBuildings] = useState<Building[]>([]);
  const [viewMode, setViewMode] = useState<"map" | "catalog">("map");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { token } = getCookie();
        if (!token) throw new Error("Missing token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/buildings-with-apartments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data: Building[] = await res.json();
        setBuildings(data);
        setFilteredBuildings(data);
      } catch (err) {
        console.error("Error fetching buildings:", err);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (criteria: SearchCriteria) => {
    const filtered = buildings.filter((building) =>
      building.apartments.some((apt) => {
        const matchesPrice =
          (criteria.priceRange.min === undefined ||
            apt.pricePerMonth >= criteria.priceRange.min) &&
          (criteria.priceRange.max === undefined ||
            apt.pricePerMonth <= criteria.priceRange.max);

        const matchesType =
          !criteria.apartmentType ||
          (criteria.apartmentType === "private" && apt.capacity === 1) ||
          (criteria.apartmentType === "shared" && apt.capacity > 1);

        const matchesName =
          !criteria.name ||
          building.name.toLowerCase().includes(criteria.name.toLowerCase());

        const distance = getDistanceFromLatLonInKm(
          building.lat,
          building.lon,
          LAU_LAT,
          LAU_LON
        );
        const matchesProximity =
          criteria.proximity === undefined || distance <= criteria.proximity;

        return matchesPrice && matchesType && matchesName && matchesProximity;
      })
    );

    setFilteredBuildings(filtered);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex-1">
          <DormSearchBar onSearch={handleSearch} />
        </div>

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

      {/* View Rendering */}
      {viewMode === "map" ? (
        <DormMap buildings={filteredBuildings} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuildings.map((building) => (
            <StudentBuildingCard key={building._id} building={building} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
