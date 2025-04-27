"use client";

import { FC } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import DormMapInner from "./DormMapInner";
import { Building } from "./DormMap.types";

interface DormMapProps {
  buildings: Building[];
}

const LAU_CENTER = { lat: 33.8959, lng: 35.4786 };

const DormMap: FC<DormMapProps> = ({ buildings }) => {
  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={["places"]}
    >
      <Map
        defaultCenter={LAU_CENTER}
        defaultZoom={15}
        gestureHandling="greedy"
        disableDefaultUI={false}
        clickableIcons
        style={{ width: "100%", height: "600px", borderRadius: "12px" }}
      >
        <DormMapInner buildings={buildings} />
      </Map>
    </APIProvider>
  );
};

export default DormMap;
