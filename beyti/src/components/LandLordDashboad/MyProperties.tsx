// src/pages/LandLordDashboard/MyProperties.tsx

import React from "react";
import AddDormForm from "./MyProperties/AddDormForms";
import MyPropertiesList from "./MyProperties/MyPropertiesList";


const MyProperties = () => {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">My Properties</h1>
      <AddDormForm />
      <MyPropertiesList />
    </div>
  );
};

export default MyProperties;
