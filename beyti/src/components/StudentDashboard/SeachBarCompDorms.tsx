"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Props {
  onSearch: (criteria: any) => void;
}

const DormSearchBar: React.FC<Props> = ({ onSearch }) => {
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

  const applyFilters = () => {
    const criteria = {
      name: searchName.trim() || undefined,
      priceRange,
      apartmentType,
      amenities: selectedAmenities,
      proximity: maxDistance,
    };
    onSearch(criteria);
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center w-full">
        <Input
          type="text"
          placeholder="Search by building name or leave blank"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="flex-1"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="ml-2">
              Advanced
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Advanced Search Filters</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min Price"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value ? Number(e.target.value) : "" })
                  }
                />
                <Input
                  type="number"
                  placeholder="Max Price"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value ? Number(e.target.value) : "" })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Apartment Type</label>
                <Select value={apartmentType} onValueChange={(val) => setApartmentType(val)}>
                  <SelectTrigger className="w-full">
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
                <div className="flex flex-wrap gap-3">
                  {["Wifi", "Electricity", "Water", "Gas", "Room Service"].map((amenity) => (
                    <div className="flex items-center space-x-2" key={amenity}>
                      <input
                        type="checkbox"
                        id={amenity}
                        checked={selectedAmenities.includes(amenity)}
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
                  onChange={(e) => setMaxDistance(e.target.value ? Number(e.target.value) : "")}
                />
              </div>

              <Button onClick={applyFilters} className="w-full mt-2">
                Apply Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button type="button" onClick={applyFilters} className="ml-2">
          Search
        </Button>
      </div>
    </div>
  );
};

export default DormSearchBar;
