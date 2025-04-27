"use client";

import { useEffect, useState } from "react";
import { getBuildingById } from "@/utils/BuildingAPI";
import { updateApartment } from "@/utils/updateApartment";
import ApartmentCard from "./ApartmentCard";
import EditApartmentModal from "./EditApartmentModal";

interface Apartment {
  _id: string;
  name: string;
  description?: string;
  pricePerMonth: number;
  depositAmount: number;
  capacity: number;
  availableSpots: number;
  isBooked: boolean;
  amenities: string[];
  pictures?: {
    data: { type: "Buffer"; data: number[] };
    contentType: string;
  }[];
}

interface Building {
  name: string;
  address: string;
  description: string;
  apartments: Apartment[];
}

interface BuildingViewerProps {
  buildingId: string;
}

export default function BuildingViewer({ buildingId }: BuildingViewerProps) {
  const [building, setBuilding] = useState<Building | null>(null);
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(
    null
  );

  useEffect(() => {
    getBuildingById(buildingId)
      .then(setBuilding)
      .catch((err) => console.error("Failed to load building", err));
  }, [buildingId]);

  if (!building) return <p className="p-6">Loading...</p>;

  const handleEditApartment = (apt: Apartment) => {
    // Only allow edit if fully vacant
    if (apt.availableSpots !== apt.capacity) {
      alert("You cannot edit an apartment that is already booked.");
      return;
    }
    setEditingApartment(apt);
  };

  const handleSaveApartment = async (updatedApartment: Apartment) => {
    try {
      const apartmentToUpdate: Partial<Apartment> = {};

      if (updatedApartment.name !== editingApartment?.name) {
        apartmentToUpdate.name = updatedApartment.name;
      }
      if (updatedApartment.pricePerMonth !== editingApartment?.pricePerMonth) {
        apartmentToUpdate.pricePerMonth = updatedApartment.pricePerMonth; // ✅ corrected
      }
      if (updatedApartment.depositAmount !== editingApartment?.depositAmount) {
        apartmentToUpdate.depositAmount = updatedApartment.depositAmount; // ✅ corrected
      }
      if (updatedApartment.capacity !== editingApartment?.capacity) {
        apartmentToUpdate.capacity = updatedApartment.capacity;
      }

      if (Object.keys(apartmentToUpdate).length === 0) {
        alert("No changes detected!");
        return;
      }

      apartmentToUpdate._id = updatedApartment._id;

      await updateApartment(updatedApartment._id, apartmentToUpdate);

      setBuilding((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          apartments: prev.apartments.map((apt) =>
            apt._id === updatedApartment._id
              ? { ...apt, ...apartmentToUpdate }
              : apt
          ),
        };
      });

      setEditingApartment(null);
      alert("✅ Apartment updated successfully!");
    } catch (error) {
      console.error("Failed to save apartment", error);
      alert("❌ Failed to save changes. Please try again.");
    }
  };




  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{building.name}</h1>
        <p className="text-muted-foreground">{building.address}</p>
        <p className="text-muted-foreground">{building.description}</p>
      </div>

      {building.apartments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No apartments yet in this building.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {building.apartments.map((apt) => (
            <ApartmentCard
              key={apt._id}
              apartment={apt}
              onEdit={() => handleEditApartment(apt)}
            />
          ))}
        </div>
      )}

      {editingApartment && (
        <EditApartmentModal
          apartment={editingApartment}
          onClose={() => setEditingApartment(null)}
          onSave={handleSaveApartment}
        />
      )}
    </div>
  );
}
