"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

interface Props {
  building: Building;
}

const StudentBuildingCard: React.FC<Props> = ({ building }) => {
  const router = useRouter();

  const imageUrl =
    building.pictures && building.pictures.length > 0
      ? `data:${building.pictures[0].contentType};base64,${Buffer.from(
          building.pictures[0].data.data
        ).toString("base64")}`
      : null;

  return (
    <Card className="group w-full space-y-4 overflow-hidden border shadow-md transition-all duration-300 hover:shadow-lg hover:border-primary hover:ring-2 hover:ring-primary/30">
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
        <div className="flex flex-wrap gap-2 transition-all duration-300">
          <Badge
            className="transition-colors duration-300 group-hover:bg-primary group-hover:text-white"
            variant="outline"
          >
            {building.rules.smoking ? "🚬 Smoking Allowed" : "🚭 No Smoking"}
          </Badge>

          <Badge
            className="transition-colors duration-300 group-hover:bg-primary group-hover:text-white"
            variant="outline"
          >
            {building.rules.petsAllowed ? "🐶 Pets Allowed" : "🚫 No Pets"}
          </Badge>

          {building.rules.noiseRestrictions && (
            <Badge
              className="transition-colors duration-300 group-hover:bg-primary group-hover:text-white"
              variant="outline"
            >
              🔇 Noise Restrictions
            </Badge>
          )}

          {building.rules.otherPolicies && (
            <Badge
              className="transition-colors duration-300 group-hover:bg-primary group-hover:text-white"
              variant="outline"
            >
              📋 {building.rules.otherPolicies}
            </Badge>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button
            size="sm"
            variant="link"
            onClick={() => router.push(`/student/buildings/${building._id}`)}
          >
            View Apartments →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentBuildingCard;
