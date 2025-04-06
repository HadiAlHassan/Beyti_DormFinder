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
import { useState } from "react";
import { createApartment } from "@/utils/BuildingAPI";

interface AddApartmentModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  buildingId: string | null;
}

interface ApartmentFormData {
  name: string;
  description: string;
  pricePerMonth: number | string;
  capacity: number | string;
  availableSpots: number | string;
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
  });

  const resetModal = () => {
    setFormData({
      name: "",
      description: "",
      pricePerMonth: "",
      capacity: "",
      availableSpots: "",
    });
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    if (!buildingId) return;

    try {
      const result = await createApartment({
        buildingId,
        name: formData.name,
        description: formData.description,
        pricePerMonth: Number(formData.pricePerMonth),
        capacity: Number(formData.capacity),
        availableSpots: Number(formData.availableSpots),
      });
      console.log("Apartment created:", result);
      resetModal();
    } catch (err) {
      console.error("Error submitting apartment:", err);
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
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Submit Apartment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddApartmentModal;
