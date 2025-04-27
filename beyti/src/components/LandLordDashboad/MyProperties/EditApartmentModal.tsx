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

interface Apartment {
  _id: string;
  name: string;
  pricePerMonth: number;
  depositAmount: number;
  capacity: number;
  availableSpots: number;
  isBooked: boolean;
  amenities: string[];
}

interface Props {
  apartment: Apartment;
  onClose: () => void;
  onSave: (updatedApartment: Apartment) => void;
}

export default function EditApartmentModal({
  apartment,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState(apartment.name);
  const [pricePerMonth, setPricePerMonth] = useState(apartment.pricePerMonth);
  const [depositAmount, setDepositAmount] = useState(apartment.depositAmount);
  const [capacity, setCapacity] = useState(apartment.capacity);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Edit Apartment</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />

          <label className="block text-sm font-medium">Price Per Month</label>
          <Input
            type="number"
            value={pricePerMonth}
            onChange={(e) => setPricePerMonth(+e.target.value)}
          />

          <label className="block text-sm font-medium">Deposit Amount</label>
          <Input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(+e.target.value)}
          />

          <label className="block text-sm font-medium">Capacity</label>
          <Input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(+e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave({
                ...apartment,
                name,
                pricePerMonth,
                depositAmount,
                capacity,
                // (Optional: add handling for amenities and availableSpots if you want)
              });
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
