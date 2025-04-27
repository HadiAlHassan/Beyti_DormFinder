"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AddApartmentDirectModal from "./AddApartmentDirectModal";

interface Apartment {
  _id: string;
  name: string;
  pricePerMonth: number;
  depositAmount: number;
  capacity: number;
  availableSpots: number;
  isBooked: boolean;
}

interface Building {
  _id: string;
  name: string;
  address: string;
  description: string;
  isVisible: boolean;
  ispublic: boolean;
  rules: {
    smoking: boolean;
    petsAllowed: boolean;
    noiseRestrictions: boolean;
    otherPolicies?: string;
  };
  apartments: Apartment[];
  pictures?: {
    data: { type: "Buffer"; data: number[] };
    contentType: string;
  }[];
}

interface BuildingCardProps {
  building: Building;
  refetchBuildings?: () => Promise<void>;
  onAddApartment?: (buildingId: string) => void; // ✅ now allowed
}

const BuildingCard: React.FC<BuildingCardProps> = ({
  building,
  refetchBuildings,
  onAddApartment,
}) => {
  const router = useRouter();
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const imageUrl =
    building.pictures && building.pictures.length > 0
      ? `data:${building.pictures[0].contentType};base64,${Buffer.from(
          building.pictures[0].data.data
        ).toString("base64")}`
      : null;

  return (
    <Card className="w-full space-y-4 overflow-hidden shadow-md border">
      {imageUrl && (
        <div className="relative w-full h-64">
          <Image
            src={imageUrl}
            alt="Building"
            fill
            className="object-cover rounded-t-md"
            priority
          />
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-xl">{building.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{building.address}</p>
        <p className="text-sm text-muted-foreground">{building.description}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant={building.isVisible ? "default" : "outline"}>
            {building.isVisible ? "Visible" : "Hidden"}
          </Badge>

          <Badge variant={building.ispublic ? "outline" : "default"}>
            {building.ispublic ? "Public Dorm" : "Owned Dorm"}
          </Badge>
        </div>

        <div className="flex gap-4 pt-2">
          {/* Public Building Button */}
          {building.ispublic && onAddApartment ? (
            <Button size="sm" onClick={() => onAddApartment(building._id)}>
              ➕ Add Apartment
            </Button>
          ) : (
            // Owned Building Button
            <Button size="sm" onClick={() => setAddModalOpen(true)}>
              ➕ Add Apartment
            </Button>
          )}

          <Button
            size="sm"
            variant="link"
            onClick={() =>
              router.push(`/landlord/properties/building/${building._id}`)
            }
          >
            View Apartments →
          </Button>
        </div>
      </CardContent>

      {/* Modal only for owned buildings */}
      {!building.ispublic && (
        <AddApartmentDirectModal
          isOpen={isAddModalOpen}
          setIsOpen={setAddModalOpen}
          buildingId={building._id}
        />
      )}
    </Card>
  );
};

export default BuildingCard;
