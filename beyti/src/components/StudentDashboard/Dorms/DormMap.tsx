"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { FC, useState } from "react";

export interface Building {
  _id: string;
  name: string;
  lat: number;
  lon: number;
}

interface DormMapProps {
  buildings: Building[];
}

const LAU_CENTER = { lat: 33.8959, lng: 35.4786 };

const DormMap: FC<DormMapProps> = ({ buildings }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        defaultCenter={LAU_CENTER}
        defaultZoom={15}
        gestureHandling="greedy"
        disableDefaultUI={false}
        clickableIcons={true}
        style={{ width: "100%", height: "600px", borderRadius: "12px" }}
        onIdle={() => setIsLoaded(true)} // waits until map is fully initialized
      >
        {isLoaded &&
          buildings.map((building) => (
            <Marker
              key={building._id}
              position={{ lat: building.lat, lng: building.lon }}
              title={building.name}
              icon={{
                url: "/pin.png",
                scaledSize:
                  typeof google !== "undefined"
                    ? new google.maps.Size(40, 40)
                    : undefined,
              }}
            />
          ))}
      </Map>
    </APIProvider>
  );
};

export default DormMap;
