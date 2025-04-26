"use client";

import { useState } from "react";
import { useBuildings } from "@/context/BuildingsContext";
import BuildingCard from "./BuildingCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddBuildingModal from "./AddBuildingModal";
import AddApartmentModal from "./AddApartmentModal";

const MyProperties = () => {
  const { buildings, isLoading, refetchBuildings } = useBuildings();

  const [filter, setFilter] = useState("");
  const [isBuildingModalOpen, setBuildingModalOpen] = useState(false);
  const [isApartmentModalOpen, setApartmentModalOpen] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState<
    string | undefined
  >(undefined);

  const openApartmentModalForBuilding = (buildingId: string) => {
    setSelectedBuildingId(buildingId);
    setTimeout(() => {
      setApartmentModalOpen(true);
    }, 50); // small delay to ensure state is updated
  };

  const filtered =
    buildings?.filter((b) =>
      b.name.toLowerCase().includes(filter.toLowerCase())
    ) ?? [];

  return (
    <div className="space-y-6 p-6">
      {/* Top Buttons */}
      <div className="flex justify-end gap-4">
        <Button onClick={() => setBuildingModalOpen(true)}>
          <Plus className="mr-2" /> Add Building
        </Button>
        <Button variant="outline" onClick={() => setApartmentModalOpen(true)}>
          <Plus className="mr-2" /> Add Apartment
        </Button>
      </div>

      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Search buildings..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Modals */}
      <AddBuildingModal
        isOpen={isBuildingModalOpen}
        setIsOpen={setBuildingModalOpen}
      />

      <AddApartmentModal
        isOpen={isApartmentModalOpen}
        setIsOpen={setApartmentModalOpen}
        buildingId={selectedBuildingId}
      />

      {/* Display filtered buildings */}
      {isLoading ? (
        <LoadingSpinner />
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((building) => (
            <BuildingCard
              key={building._id}
              building={building}
              refetchBuildings={async () => refetchBuildings()}
              onAddApartment={openApartmentModalForBuilding}
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
