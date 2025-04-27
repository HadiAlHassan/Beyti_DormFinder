  "use client";

  import React, { useEffect, useState } from "react";
  import DormSearchBar from "@/components/StudentDashboard/SeachBarCompDorms";
  import DormMap from "@/components/StudentDashboard/Dorms/DormMap";
  import StudentBuildingCard from "@/components/StudentDashboard/Dorms/BuildingCard";
  import { getDistanceFromLatLonInKm } from "@/lib/distance";
  import LoadingSpinner from "@/components/LoadingSpinner";
  import { useDormData } from "@/context/DormContext";
  import { useApartmentData } from "@/context/ApartmentsContext";

  const LAU_LAT = 33.8959;
  const LAU_LON = 35.4786;

  interface Apartment {
    _id: string;
    name: string;
    pricePerMonth: number;
    capacity: number;
    availableSpots: number;
    isBooked: boolean;
    amenities?:string[];
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
    priceRange: { min?: number; max?: number };
    apartmentType?: "private" | "shared";
    proximity?: number;
    amenities?: string[];
  }

  interface BuildingWithRelevance extends Building {
    relevantApartmentCount: number;
  }

  const ExplorePage: React.FC = () => {
    console.log("done");
    
    const { buildings, loading} = useDormData();
    const [filteredBuildings, setFilteredBuildings] = useState<Building[]>([]);
    const [viewMode, setViewMode] = useState<"map" | "catalog">("map");
    const { apartmentsByBuilding } = useApartmentData(); 
console.log(apartmentsByBuilding);
    useEffect(() => {
      if (buildings) setFilteredBuildings(buildings);
    }, [buildings]);
    const handleSearch = (criteria: SearchCriteria) => {
      if (!buildings || !apartmentsByBuilding) return;
    
      const noFiltersApplied =
        !criteria.name &&
        !criteria.priceRange.min &&
        !criteria.priceRange.max &&
        !criteria.apartmentType &&
        !criteria.amenities?.length &&
        !criteria.proximity;
    
      if (noFiltersApplied) {
        setFilteredBuildings(buildings);
        console.log("🔁 No filters applied — showing all buildings.");
        return;
      }
    
      const filtered = buildings
        .map((building) => {
          console.log("b name",building.name);
          const apartments = apartmentsByBuilding[building._id] || [];
          let relevantApartmentCount = 0;
    
          // ✅ Proximity
          const distance = getDistanceFromLatLonInKm(
            building.lat,
            building.lon,
            LAU_LAT,
            LAU_LON
          );
          let score = 0;
          if (
            typeof criteria.proximity === "number" &&
            distance > criteria.proximity
          ) {
            return null;
          }
          else 
            score++;
          
    
          console.log("b5 and score", criteria.name, criteria.proximity);
          // ✅ Building name match (outside apt loop)
          if (
            criteria.name &&
            !building.name.toLowerCase().includes(criteria.name.toLowerCase())
          ) return null;
          else
            score++;
          
    console.log("b4 ", criteria.name);
          for (const apt of apartments) {
            // ✅ Skip if apartment not in price range
            if (
              (typeof criteria.priceRange.min === "number" &&
                apt.pricePerMonth < criteria.priceRange.min) ||
              (typeof criteria.priceRange.max === "number" &&
                apt.pricePerMonth > criteria.priceRange.max)
            ) continue;
    

    
            // ✅ Type match
            if (
              !criteria.apartmentType ||
              (criteria.apartmentType === "private" && apt.capacity === 1) ||
              (criteria.apartmentType === "shared" && apt.capacity > 1)
            ) score++;
    
            // ✅ Amenities scoring
            if (Array.isArray(apt.amenities) && criteria.amenities?.length) {
              for (const am of criteria.amenities) {
                if (apt.amenities.includes(am)) score++;
              }
            }
    
            if (score > 0) relevantApartmentCount++;
          }
    
          if (relevantApartmentCount > 0) {
            return {
              ...building,
              relevantApartmentCount,
            };
          }
    
          return null;
        })
        .filter((b): b is BuildingWithRelevance => b !== null)
        .sort((a, b) => b.relevantApartmentCount - a.relevantApartmentCount);
    
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result: Building[] = filtered.map(({ relevantApartmentCount, ...rest }) => rest);
    
      console.log(`🔍 Search submitted. ${result.length} buildings matched.`);
      console.log(result);
      setFilteredBuildings(result);
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

        {viewMode === "map" ? (
    <div className="relative h-[700px] w-full">
      {/* Map container */}
      <DormMap buildings={filteredBuildings} />

      {/* Overlay spinner while map loads */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-[9999] transition-opacity duration-300">
          <LoadingSpinner />
        </div>
      )}
    </div>
  ) : loading ? (
    <div className="flex justify-center mt-12">
      <LoadingSpinner />
    </div>
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

  export default ExplorePage;
