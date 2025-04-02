// src/pages/LandLordDashboard/MyProperties.tsx

import React from "react";
import MyPropertiesList from "./MyProperties/MyPropertiesList";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import AddDormModal from "./MyProperties/AddDormModal";

const MyProperties = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-end">
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2" /> Add Dorm
        </Button>
      </div>

      <MyPropertiesList />

      {/* Modal controlled by state */}
      <AddDormModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
};

export default MyProperties;
