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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getPublicBuildings, createApartment } from "@/utils/BuildingAPI";

const AVAILABLE_AMENITIES = [
  "Wifi",
  "Electricity",
  "Water",
  "Gas",
  "Room Service",
];

interface AddApartmentModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  buildingId?: string; // 🆕 optional buildingId
}

interface ApartmentFormData {
  name: string;
  description: string;
  pricePerMonth: string;
  depositAmount: string;
  capacity: string;
  availableSpots: string;
  amenities: string[];
  pictures: File[];
  buildingId: string;
}

const AddApartmentModal: React.FC<AddApartmentModalProps> = ({
  isOpen,
  setIsOpen,
  buildingId,
}) => {
  const [buildings, setBuildings] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [formData, setFormData] = useState<ApartmentFormData>({
    name: "",
    description: "",
    pricePerMonth: "",
    depositAmount: "",
    capacity: "",
    availableSpots: "",
    amenities: [],
    pictures: [],
    buildingId: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (buildingId) {
        setFormData((prev) => ({ ...prev, buildingId }));
      } else {
        getPublicBuildings()
          .then((data) => setBuildings(data))
          .catch((err) => {
            console.error("Failed to load buildings:", err);
          });
      }
    }
  }, [isOpen, buildingId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, pictures: Array.from(e.target.files) });
    }
  };

  const toggleAmenity = (amenity: string) => {
    const updated = formData.amenities.includes(amenity)
      ? formData.amenities.filter((a) => a !== amenity)
      : [...formData.amenities, amenity];

    setFormData({ ...formData, amenities: updated });
  };

  const handleSubmit = async () => {
    try {
      await createApartment({
        buildingId: formData.buildingId,
        name: formData.name,
        description: formData.description,
        pricePerMonth: Number(formData.pricePerMonth),
        depositAmount: Number(formData.depositAmount),
        capacity: Number(formData.capacity),
        availableSpots: Number(formData.availableSpots),
        amenities: formData.amenities,
        pictures: formData.pictures,
      });

      setIsOpen(false);
      setFormData({
        name: "",
        description: "",
        pricePerMonth: "",
        depositAmount: "",
        capacity: "",
        availableSpots: "",
        amenities: [],
        pictures: [],
        buildingId: "",
      });
    } catch (err) {
      console.error("❌ Failed to create apartment:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Apartment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 🧠 Only show selector if NO buildingId passed */}
          {!buildingId && (
            <div>
              <Label>Select Building</Label>
              <Select
                value={formData.buildingId}
                onValueChange={(value) =>
                  setFormData({ ...formData, buildingId: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a public building..." />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((b) => (
                    <SelectItem key={b._id} value={b._id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
            placeholder="Deposit Amount"
            value={formData.depositAmount}
            onChange={(e) =>
              setFormData({ ...formData, depositAmount: e.target.value })
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
              {AVAILABLE_AMENITIES.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
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

export default AddApartmentModal;
