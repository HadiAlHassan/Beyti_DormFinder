"use client";

import { useApartmentData } from "@/context/ApartmentsContext";
import ApartmentCard from "./ApartmentCard";

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
  const { apartmentsByBuilding, loading, error } = useApartmentData();

  const apartments = apartmentsByBuilding?.[buildingId] || [];

  if (loading) {
    return <p className="p-6">Loading apartments...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">Error loading apartments: {error}</p>;
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
                ...apt,
                amenities: apt.amenities ?? [], // ✅ ensure amenities is always an array
              }}
              onView={() => console.log("View", apt._id)}
              onEdit={() => console.log("Edit", apt._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BuildingViewer;
