"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
  amenities: string[];
  isVisible: boolean;
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
  onAddApartment: (buildingId: string) => void;
}

const BuildingCard: React.FC<BuildingCardProps> = ({
  building,
  onAddApartment,
}) => {
  const imageUrl =
    building.pictures && building.pictures.length > 0
      ? `data:${building.pictures[0].contentType};base64,${Buffer.from(
          building.pictures[0].data.data
        ).toString("base64")}`
      : null;

  return (
    <Card className="w-full space-y-4 overflow-hidden">
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

      <div className="px-6 -mt-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAddApartment(building._id)}
        >
          ➕ Add Apartment
        </Button>
      </div>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant={building.isVisible ? "default" : "outline"}>
            {building.isVisible ? "Visible" : "Hidden"}
          </Badge>

          {building.amenities.map((amenity, index) => (
            <Badge key={index} variant="secondary">
              {amenity}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-1">
          {building.rules.smoking && <Badge>Smoking Allowed</Badge>}
          {building.rules.petsAllowed && <Badge>Pets Allowed</Badge>}
          {building.rules.noiseRestrictions && (
            <Badge>Noise Restrictions</Badge>
          )}
          {building.rules.otherPolicies && (
            <Badge variant="outline">{building.rules.otherPolicies}</Badge>
          )}
        </div>

        {building.apartments.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No apartments added yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {building.apartments.map((apt) => (
              <Card
                key={apt._id}
                className="p-3 space-y-1 bg-muted/50 border-muted"
              >
                <div className="font-medium text-sm">{apt.name}</div>
                <div className="text-sm">💰 ${apt.pricePerMonth}/mo</div>
                <div className="text-sm">
                  👥 {apt.availableSpots} of {apt.capacity} spots available
                </div>
                <Badge
                  variant="outline"
                  className={
                    apt.isBooked
                      ? "text-red-500 border-red-500"
                      : "text-green-600 border-green-600"
                  }
                >
                  {apt.isBooked ? "Booked" : "Available"}
                </Badge>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BuildingCard;
