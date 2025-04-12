"use client";

import { Marker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Building } from "./DormMap.types";

interface DormMapInnerProps {
  buildings: Building[];
}

const getImageUrl = (building: Building): string | null => {
  const pic = building.pictures?.[0];
  if (!pic?.data?.data || !pic.contentType) return null;

  try {
    const uint8Array = new Uint8Array(pic.data.data);
    let binary = "";
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    const base64String = window.btoa(binary);
    return `data:${pic.contentType};base64,${base64String}`;
  } catch (err) {
    console.error("Failed to convert image buffer to base64", err);
    return null;
  }
};

const DormMapInner = ({ buildings }: DormMapInnerProps) => {
  const map = useMap();
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
  const [circleCenter, setCircleCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const router = useRouter();

  const showRadar = (center: { lat: number; lng: number }) => {
    setSelectedBuilding(null);
    setPlaces([]);
    setCircleCenter(center);

    if (!map) return;

    const service = new google.maps.places.PlacesService(map);
    const types = ["restaurant", "gym", "pharmacy"] as const;

    types.forEach((type) => {
      service.nearbySearch(
        {
          location: center,
          radius: 200,
          type,
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            setPlaces((prev) => [...prev, ...results]);
          }
        }
      );
    });
  };

  useEffect(() => {
    if (!map || !circleCenter) return;

    const circle = new google.maps.Circle({
      center: circleCenter,
      radius: 200,
      strokeColor: "#4ade80",
      fillColor: "#bbf7d0",
      strokeOpacity: 0.7,
      fillOpacity: 0.25,
      strokeWeight: 2,
      map,
    });

    return () => circle.setMap(null);
  }, [circleCenter, map]);

  return (
    <>
      {/* Markers for buildings */}
      {buildings.map((building) => (
        <Marker
          key={building._id}
          position={{ lat: building.lat, lng: building.lon }}
          title={building.name}
          onClick={() => {
            setSelectedBuilding(building);
            setPlaces([]);
            setCircleCenter(null);
          }}
          icon={{
            url: "/pin.png",
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 40),
          }}
        />
      ))}

      {/* InfoWindow for selected building */}
      {selectedBuilding && (
        <InfoWindow
          position={{
            lat: selectedBuilding.lat,
            lng: selectedBuilding.lon,
          }}
          onCloseClick={() => setSelectedBuilding(null)}
        >
          <div className="w-64 space-y-2">
            {(() => {
              const imageUrl = getImageUrl(selectedBuilding);
              return (
                imageUrl && (
                  <div className="relative w-full h-32 rounded overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={selectedBuilding.name}
                      fill
                      className="object-cover"
                      sizes="256px"
                    />
                  </div>
                )
              );
            })()}

            <h3 className="font-semibold text-sm">{selectedBuilding.name}</h3>
            <p className="text-xs text-muted-foreground">
              {selectedBuilding.address}
            </p>

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
              className="w-full px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 transition"
            >
              View Building
            </button>

            <button
              onClick={() =>
                showRadar({
                  lat: selectedBuilding.lat,
                  lng: selectedBuilding.lon,
                })
              }
              className="w-full mt-1 px-3 py-1 text-sm bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition"
            >
              Show Nearby Places
            </button>
          </div>
        </InfoWindow>
      )}

      {/* Markers for places */}
      {places.map((place) => {
        const type = place.types?.find((t) =>
          ["restaurant", "gym", "pharmacy"].includes(t)
        ) as "restaurant" | "gym" | "pharmacy" | undefined;

        const iconUrl =
          type === "gym"
            ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            : type === "pharmacy"
            ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            : "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

        return (
          <Marker
            key={place.place_id}
            position={{
              lat: place.geometry?.location?.lat() ?? 0,
              lng: place.geometry?.location?.lng() ?? 0,
            }}
            title={place.name}
            icon={{
              url: iconUrl,
              scaledSize: new google.maps.Size(30, 30),
            }}
          />
        );
      })}

      {/* Tailwind-styled Legend */}
      <div className="absolute bottom-4 left-4 z-50 bg-white rounded shadow-lg p-4 text-sm space-y-2 border border-gray-200">
        <div className="font-semibold mb-1">Legend</div>
        <div className="flex items-center space-x-2">
          <Image
            src="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            alt="Restaurant"
            width={16}
            height={16}
          />
          <span>Restaurant</span>
        </div>
        <div className="flex items-center space-x-2">
          <Image
            src="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            alt="Gym"
            width={16}
            height={16}
          />
          <span>Gym</span>
        </div>
        <div className="flex items-center space-x-2">
          <Image
            src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            alt="Pharmacy"
            width={16}
            height={16}
          />
          <span>Pharmacy</span>
        </div>
      </div>
    </>
  );
};

export default DormMapInner;
