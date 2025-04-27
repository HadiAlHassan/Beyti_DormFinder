import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getMyBuildings } from "@/utils/BuildingAPI"; // new API you'll create

interface AddListingModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  openBuildingModal: () => void;
  openApartmentModal: () => void;
}

const AddListingModal: React.FC<AddListingModalProps> = ({
  isOpen,
  setIsOpen,
  openBuildingModal,
  openApartmentModal,
}) => {
  const [hasBuildings, setHasBuildings] = useState(false);

  useEffect(() => {
    const checkBuildings = async () => {
      try {
        const buildings = await getMyBuildings();
        setHasBuildings(buildings.length > 0);
      } catch (err) {
        console.error("Error fetching buildings:", err);
      }
    };

    if (isOpen) checkBuildings();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Listing</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Button
            className="w-full"
            onClick={() => {
              setIsOpen(false);
              openBuildingModal();
            }}
          >
            🏢 Add Building
          </Button>

          <Button
            className="w-full"
            onClick={() => {
              if (hasBuildings) {
                setIsOpen(false);
                openApartmentModal();
              } else {
                alert("You must add a building before adding an apartment.");
              }
            }}
            variant={hasBuildings ? "default" : "outline"}
            disabled={!hasBuildings}
          >
            🚪 Add Apartment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddListingModal;