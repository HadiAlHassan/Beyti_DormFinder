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
import { createBuilding } from "@/utils/BuildingAPI";

type Step = 0 | 1 | 2 | 3;

interface Rules {
  smoking: boolean;
  petsAllowed: boolean;
  noiseRestrictions: boolean;
  otherPolicies: string;
}

interface BuildingFormData {
  name: string;
  address: string;
  description: string;
  lat: number;
  lon: number;
  rules: Rules;
  amenities: string[];
}

interface AddBuildingModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const AddBuildingModal: React.FC<AddBuildingModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [step, setStep] = useState<Step>(0);

  const [formData, setFormData] = useState<BuildingFormData>({
    name: "",
    address: "",
    description: "",
    lat: 0,
    lon: 0,
    rules: {
      smoking: false,
      petsAllowed: false,
      noiseRestrictions: false,
      otherPolicies: "",
    },
    amenities: [],
  });

  const goNext = () =>
    setStep((prev) => (prev < 3 ? ((prev + 1) as Step) : prev));
  const goBack = () =>
    setStep((prev) => (prev > 0 ? ((prev - 1) as Step) : prev));
  const closeModal = () => {
    setStep(0);
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const result = await createBuilding(formData);
      console.log("Building created:", result);
      closeModal();
    } catch (err) {
      console.error("Error submitting building:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Building</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6 max-w-xl mx-auto w-full">
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Basic Info</h3>

              <Input
                placeholder="Building Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <Input
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />

              <Input
                placeholder="Short Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
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
              <p className="text-sm text-muted-foreground">
                Selected: {formData.lat}, {formData.lon}
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Rules</h3>

              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={formData.rules.smoking}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rules: {
                        ...formData.rules,
                        smoking: e.target.checked,
                      },
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
                    rules: {
                      ...formData.rules,
                      otherPolicies: e.target.value,
                    },
                  })
                }
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Amenities</h3>
              <Input
                placeholder="Comma separated list (e.g. WiFi, Kitchen)"
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
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="ghost" onClick={goBack} disabled={step === 0}>
            Back
          </Button>

          {step < 3 ? (
            <Button onClick={goNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>Submit Building</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBuildingModal;
