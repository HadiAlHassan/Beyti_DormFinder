"use client";

import React, { useState } from "react";
import MyPropertiesList from "./MyPropertiesList";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import AddListingModal from "./AddListingModal";
import AddBuildingModal from "./AddBuildingModal";
import AddApartmentModal from "./AddApartmentModal";

const MyProperties = () => {
  const [isListingModalOpen, setListingModalOpen] = useState(false);
  const [isBuildingModalOpen, setBuildingModalOpen] = useState(false);
  const [isApartmentModalOpen, setApartmentModalOpen] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );

  const openApartmentModalForBuilding = (buildingId: string) => {
    setSelectedBuildingId(buildingId);
    setApartmentModalOpen(true);
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-end">
        <Button onClick={() => setListingModalOpen(true)}>
          <Plus className="mr-2" /> Add Listing
        </Button>
      </div>

      <AddListingModal
        isOpen={isListingModalOpen}
        setIsOpen={setListingModalOpen}
        openBuildingModal={() => setBuildingModalOpen(true)}
        openApartmentModal={() => setApartmentModalOpen(true)}
      />

      <AddBuildingModal
        isOpen={isBuildingModalOpen}
        setIsOpen={setBuildingModalOpen}
      />

      <AddApartmentModal
        isOpen={isApartmentModalOpen}
        setIsOpen={setApartmentModalOpen}
        buildingId={selectedBuildingId}
      />

      <MyPropertiesList onAddApartment={openApartmentModalForBuilding} />
    </div>
  );
};

export default MyProperties;
