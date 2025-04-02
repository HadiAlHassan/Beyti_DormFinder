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
import MapPicker from "./MapPicker";

type Step = 0 | 1 | 2 | 3 | 4;

interface Rules {
  smoking: boolean;
  petsAllowed: boolean;
  noiseRestrictions: boolean;
  otherPolicies: string;
}

interface Apartment {
  name: string;
  description: string;
  pricePerMonth: number | string;
  capacity: number | string;
  availableSpots: number | string;
  isBooked: boolean;
}

interface DormFormData {
  name: string;
  description: string;
  lat: number | string;
  lon: number | string;
  isBooked: boolean;
  pricePerMonth: number | string;
  capacity: number | string;
  apartments: Apartment[];
  rules: Rules;
  amenities: string[];
}

interface AddDormModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const AddDormModal: React.FC<AddDormModalProps> = ({ isOpen, setIsOpen }) => {
  const [step, setStep] = useState<Step>(0);

  const [formData, setFormData] = useState<DormFormData>({
    name: "",
    description: "",
    lat: "",
    lon: "",
    isBooked: false,
    pricePerMonth: "",
    capacity: "",
    apartments: [],
    rules: {
      smoking: false,
      petsAllowed: false,
      noiseRestrictions: false,
      otherPolicies: "",
    },
    amenities: [],
  });

  const goNext = () =>
    setStep((prev) => (prev < 4 ? ((prev + 1) as Step) : prev));
  const goBack = () =>
    setStep((prev) => (prev > 0 ? ((prev - 1) as Step) : prev));
  const closeModal = () => {
    setStep(0);
    setIsOpen(false);
  };

  const handleSubmit = () => {
    console.log("Submitted form data:", formData);
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Dorm</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6 max-w-xl mx-auto w-full">
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Basic Info</h3>
              <Input
                placeholder="Dorm or Building Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <Input
                placeholder="Short Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Location</h3>
              <MapPicker
                onLocationSet={(lat, lng) => {
                  setFormData({ ...formData, lat, lon: lng });
                }}
              />
              <div className="text-sm text-muted-foreground">
                Selected: {formData.lat}, {formData.lon}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Rules & Amenities</h3>

              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={formData.rules.smoking}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rules: { ...formData.rules, smoking: e.target.checked },
                    })
                  }
                />
                Smoking Allowed
              </label>

              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={formData.rules.petsAllowed}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rules: {
                        ...formData.rules,
                        petsAllowed: e.target.checked,
                      },
                    })
                  }
                />
                Pets Allowed
              </label>

              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={formData.rules.noiseRestrictions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rules: {
                        ...formData.rules,
                        noiseRestrictions: e.target.checked,
                      },
                    })
                  }
                />
                Noise Restrictions
              </label>

              <Input
                placeholder="Other Policies"
                value={formData.rules.otherPolicies}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rules: { ...formData.rules, otherPolicies: e.target.value },
                  })
                }
              />

              <Input
                placeholder="Amenities (comma separated)"
                value={formData.amenities.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amenities: e.target.value
                      .split(",")
                      .map((item) => item.trim()),
                  })
                }
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Apartments Info</h3>
              <p className="text-sm text-muted-foreground">
                This will be a dynamic input list (coming soon).
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Review & Submit</h3>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="ghost" onClick={goBack} disabled={step === 0}>
            Back
          </Button>

          {step < 4 ? (
            <Button onClick={goNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} className="btn-primary">
              Submit Dorm
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDormModal;
