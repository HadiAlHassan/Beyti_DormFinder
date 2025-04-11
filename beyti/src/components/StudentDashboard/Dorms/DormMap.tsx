"use client";

import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export interface Apartment {
  _id: string;
  name: string;
  pricePerMonth: number;
  capacity: number;
  availableSpots: number;
  isBooked: boolean;
}

export interface Building {
  _id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  description: string;
  isVisible: boolean;
  ispublic: boolean;
  rules: {
    smoking: boolean;
    petsAllowed: boolean;
    noiseRestrictions: boolean;
    otherPolicies?: string;
  };
  pictures?: {
    data: { type: "Buffer"; data: number[] };
    contentType: string;
  }[];
  apartments: Apartment[];
}

interface DormMapProps {
  buildings: Building[];
}

const LAU_CENTER = { lat: 33.8959, lng: 35.4786 };

const DormMap: FC<DormMapProps> = ({ buildings }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );
  const router = useRouter();

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        defaultCenter={LAU_CENTER}
        defaultZoom={15}
        gestureHandling="greedy"
        disableDefaultUI={false}
        clickableIcons={true}
        style={{ width: "100%", height: "600px", borderRadius: "12px" }}
        onIdle={() => setIsLoaded(true)}
      >
        {isLoaded &&
          buildings.map((building) => (
            <Marker
              key={building._id}
              position={{ lat: building.lat, lng: building.lon }}
              title={building.name}
              onClick={() => setSelectedBuilding(building)}
              icon={{
                url: "/pin.png",
                scaledSize:
                  typeof google !== "undefined"
                    ? new google.maps.Size(40, 40)
                    : undefined,
                anchor:
                  typeof google !== "undefined"
                    ? new google.maps.Point(20, 40)
                    : undefined,
              }}
            />
          ))}

        {selectedBuilding && (
          <InfoWindow
            position={{
              lat: selectedBuilding.lat,
              lng: selectedBuilding.lon,
            }}
            onCloseClick={() => setSelectedBuilding(null)}
          >
            <div className="w-64 space-y-2">
              {/* Image */}
              {selectedBuilding.pictures &&
                selectedBuilding.pictures.length > 0 && (
                  <div className="relative w-full h-32 rounded overflow-hidden">
                    <Image
                      src={`data:${
                        selectedBuilding.pictures[0].contentType
                      };base64,${Buffer.from(
                        selectedBuilding.pictures[0].data.data
                      ).toString("base64")}`}
                      alt={selectedBuilding.name}
                      fill
                      className="object-cover"
                      sizes="256px"
                    />
                  </div>
                )}

              {/* Name + Address */}
              <h3 className="font-semibold text-sm">{selectedBuilding.name}</h3>
              <p className="text-xs text-muted-foreground">
                {selectedBuilding.address}
              </p>

              {/* Rules */}
              <div className="text-xs flex gap-2 flex-wrap">
                <span
                  className={`px-2 py-0.5 rounded ${
                    selectedBuilding.rules.smoking
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {selectedBuilding.rules.smoking
                    ? "🚬 Smoking Allowed"
                    : "🚭 No Smoking"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded ${
                    selectedBuilding.rules.petsAllowed
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {selectedBuilding.rules.petsAllowed
                    ? "🐶 Pets Allowed"
                    : "🚫 No Pets"}
                </span>
              </div>

              {/* Button */}
              <button
                onClick={() => {
                  const queryParams = new URLSearchParams({
                    name: selectedBuilding.name,
                    address: selectedBuilding.address,
                    description: selectedBuilding.description,
                  }).toString();
                  router.push(
                    `/student/buildings/${selectedBuilding._id}?${queryParams}`
                  );
                }}
                className="mt-2 w-full px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 transition"
              >
                View Building
              </button>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
};

export default DormMap;
