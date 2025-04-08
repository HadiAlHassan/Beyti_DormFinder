"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { createApartment } from "@/utils/BuildingAPI";

const AMENITIES = ["Wifi", "Electricity", "Water", "Gas", "Room Service"];

interface AddApartmentDirectModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  buildingId: string;
}

const AddApartmentDirectModal: React.FC<AddApartmentDirectModalProps> = ({
  isOpen,
  setIsOpen,
  buildingId,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerMonth: "",
    capacity: "",
    availableSpots: "",
    amenities: [] as string[],
    pictures: [] as File[],
  });

  const handleCheckbox = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, pictures: Array.from(e.target.files) });
    }
  };

  const handleSubmit = async () => {
    try {
      await createApartment({
        buildingId,
        name: formData.name,
        description: formData.description,
        pricePerMonth: Number(formData.pricePerMonth),
        capacity: Number(formData.capacity),
        availableSpots: Number(formData.availableSpots),
        amenities: formData.amenities,
        pictures: formData.pictures,
      });

      setFormData({
        name: "",
        description: "",
        pricePerMonth: "",
        capacity: "",
        availableSpots: "",
        amenities: [],
        pictures: [],
      });
      setIsOpen(false);
    } catch (err) {
      console.error("Error creating apartment:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Apartment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Input
            placeholder="Apartment Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Monthly Rent"
            value={formData.pricePerMonth}
            onChange={(e) =>
              setFormData({ ...formData, pricePerMonth: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({ ...formData, capacity: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Available Spots"
            value={formData.availableSpots}
            onChange={(e) =>
              setFormData({ ...formData, availableSpots: e.target.value })
            }
          />

          <div>
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {AMENITIES.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={() => handleCheckbox(amenity)}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="pictures">Upload Pictures</Label>
            <Input
              id="pictures"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Submit Apartment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddApartmentDirectModal;
