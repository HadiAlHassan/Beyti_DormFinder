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
import { useState } from "react";
import { createApartment } from "@/utils/BuildingAPI";

interface AddApartmentModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  buildingId: string;
}

interface ApartmentFormData {
  name: string;
  description: string;
  pricePerMonth: string;
  capacity: string;
  availableSpots: string;
  pictures: File[];
}

const AddApartmentModal: React.FC<AddApartmentModalProps> = ({
  isOpen,
  setIsOpen,
  buildingId,
}) => {
  const [formData, setFormData] = useState<ApartmentFormData>({
    name: "",
    description: "",
    pricePerMonth: "",
    capacity: "",
    availableSpots: "",
    pictures: [],
  });

  const resetModal = () => {
    setFormData({
      name: "",
      description: "",
      pricePerMonth: "",
      capacity: "",
      availableSpots: "",
      pictures: [],
    });
    setIsOpen(false);
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
        pictures: formData.pictures,
      });

      resetModal();
    } catch (err) {
      console.error("❌ Failed to create apartment:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
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
