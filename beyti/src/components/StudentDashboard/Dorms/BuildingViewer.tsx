"use client";

import { useApartmentData } from "@/context/ApartmentsContext";
import ApartmentCard from "./ApartmentCard";
import { useState } from "react";
import { BookingDialog } from "./BookingModal";
import { getCookie } from "@/utils/cookieUtils";

interface BuildingViewerProps {
  buildingId: string;
  name?: string;
  address?: string;
  description?: string;
}

const BuildingViewer: React.FC<BuildingViewerProps> = ({
  buildingId,
  name,
  address,
  description,
}) => {
  const { userId: studentId } = getCookie();
  if (!studentId) return null;

  const { apartmentsByBuilding, loading, error } = useApartmentData();
  const [selectedApartment, setSelectedApartment] = useState<any | null>(null);
  const apartments = apartmentsByBuilding?.[buildingId] || [];

  if (loading) {
    return <p className="p-6">Loading apartments...</p>;
  }

  if (error) {
    return (
      <p className="p-6 text-red-500">Error loading apartments: {error}</p>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{name ?? "Unnamed Building"}</h1>
        {address && <p className="text-muted-foreground">{address}</p>}
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      {apartments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No apartments available in this building.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {apartments.map((apt) => (
            <ApartmentCard
              key={apt._id}
              apartment={{
                _id: apt._id,
                name: apt.name,
                pricePerMonth: apt.pricePerMonth,
                depositAmount: apt.depositAmount ?? 0, // ✅ Added this
                capacity: apt.capacity,
                availableSpots: apt.availableSpots,
                isBooked: apt.isBooked,
                amenities: apt.amenities ?? [],
                pictures: apt.pictures, // optional
              }}
              onView={() => setSelectedApartment(apt)}
              onEdit={() => console.log("Edit", apt._id)}
            />
          ))}
        </div>
      )}

      {selectedApartment && (
        <BookingDialog
          open={!!selectedApartment}
          apartment={{
            _id: selectedApartment._id,
            pricePerMonth: selectedApartment.pricePerMonth,
            depositAmount: selectedApartment.depositAmount, // ✅ FIXED: now passed correctly
            dormOwnerId: selectedApartment.dormOwner,
            buildingId: selectedApartment.building,
          }}
          studentId={studentId}
          onClose={() => setSelectedApartment(null)}
        />
      )}
    </div>
  );
};

export default BuildingViewer;
