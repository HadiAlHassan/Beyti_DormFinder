// File: components/StudentDashboard/Search/DormSearchBar.tsx
"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Props {
  onSearch: (criteria: any) => void;
}

const DormSearchBar: React.FC<Props> = ({ onSearch }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [priceRange, setPriceRange] = useState<{ min: number | ""; max: number | "" }>({ min: "", max: "" });
  const [apartmentType, setApartmentType] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState<number | "">("");

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities((prev) => [...prev, amenity]);
    } else {
      setSelectedAmenities((prev) => prev.filter((a) => a !== amenity));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const criteria = {
      name: searchName,
      priceRange,
      apartmentType,
      amenities: selectedAmenities,
      proximity: maxDistance,
    };
    onSearch(criteria);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md shadow-sm">
      <div className="flex items-center">
        <Input
          type="text"
          placeholder="Search by building name or leave blank"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="flex-1"
        />
        <Button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="ml-2">
          {showAdvanced ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </Button>
        <Button type="submit" className="ml-2">
          Search
        </Button>
      </div>

      {showAdvanced && (
        <div className="space-y-4 border-t pt-4">
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Min Price"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({ ...priceRange, min: e.target.value ? Number(e.target.value) : "" })
              }
              className="w-32"
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({ ...priceRange, max: e.target.value ? Number(e.target.value) : "" })
              }
              className="w-32"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Apartment Type</label>
            <Select value={apartmentType} onValueChange={(val) => setApartmentType(val)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="shared">Shared</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amenities</label>
            <div className="flex flex-wrap gap-4">
              {["Wifi", "Electricity", "Water", "Gas", "Room Service"].map((amenity) => (
                <div className="flex items-center space-x-2" key={amenity}>
                  <input
                    type="checkbox"
                    id={amenity}
                    onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
                  />
                  <label htmlFor={amenity}>{amenity}</label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Max Distance to LAU (km)</label>
            <Input
              type="number"
              placeholder="e.g. 5"
              value={maxDistance}
              onChange={(e) =>
                setMaxDistance(e.target.value ? Number(e.target.value) : "")
              }
              className="w-32"
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default DormSearchBar;
