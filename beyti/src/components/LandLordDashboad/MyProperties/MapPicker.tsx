import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useRef, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: 33.89316617148673,
  lng: 35.47786295407915,
};

interface MapPickerProps {
  onLocationSet: (lat: number, lng: number) => void;
}

export default function MapPicker({ onLocationSet }: MapPickerProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.VITE_GOOGLE_MAPS_API_KEY!, // or process.env if using Next.js
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [currentCenter, setCurrentCenter] = useState(defaultCenter);

  const handleLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setCurrentCenter(map.getCenter()?.toJSON() || defaultCenter);
  };

  const handleDragEnd = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      if (center) {
        const coords = center.toJSON();
        setCurrentCenter(coords);
      }
    }
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="space-y-2">
      <div className="relative">
        <GoogleMap
          mapContainerStyle={containerStyle}
          zoom={15}
          center={currentCenter}
          onLoad={handleLoad}
          onDragEnd={handleDragEnd}
          options={{
            streetViewControl: false,
            fullscreenControl: false,
          }}
        />

        {/* Fixed Lucide pin */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10">
          <MapPin className="w-8 h-8 text-red-500" />
        </div>
      </div>

      <Button
        type="button"
        onClick={() => onLocationSet(currentCenter.lat, currentCenter.lng)}
      >
        Set Location
      </Button>
    </div>
  );
}
