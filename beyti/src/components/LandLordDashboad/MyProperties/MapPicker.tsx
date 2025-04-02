"use client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const defaultCenter = {
  lat: 33.89316617148673,
  lng: 35.47786295407915,
};

interface MapPickerProps {
  onLocationSet: (lat: number, lng: number) => void;
}

export default function MapPicker({ onLocationSet }: MapPickerProps) {
  const [center, setCenter] = useState(defaultCenter);

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      onLoad={() => console.log("Maps API loaded")}
    >
      <div className="relative">
        <Map
          style={{ width: "100%", height: "300px" }}
          defaultCenter={defaultCenter}
          defaultZoom={15}
          onCameraChanged={(ev) => {
            const c = ev.detail.center;
            setCenter({ lat: c.lat, lng: c.lng });
          }}
          gestureHandling="greedy"
          disableDefaultUI={true}
        />

        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10">
          <MapPin className="w-8 h-8 text-red-500" />
        </div>
      </div>

      <div className="mt-2 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Lat: {center.lat.toFixed(6)}, Lng: {center.lng.toFixed(6)}
        </p>
        <Button onClick={() => onLocationSet(center.lat, center.lng)}>
          Set Location
        </Button>
      </div>
    </APIProvider>
  );
}
