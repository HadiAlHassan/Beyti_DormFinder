// src/components/LandLordDashboard/MyProperties/MyPropertiesList.tsx

import React, { useEffect, useState } from "react";

type Dorm = {
  _id: string;
  name: string;
  description: string;
  pricePerMonth: number;
  capacity: number;
  availableSpots: number;
  isBooked: boolean;
  isVisible: boolean;
  amenities: string[];
  rules: {
    smoking: boolean;
    petsAllowed: boolean;
    noiseRestrictions: boolean;
    otherPolicies?: string;
  };
};

const MyPropertiesList = () => {
  const [dorms, setDorms] = useState<Dorm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDorms = async () => {
      try {
        const res = await fetch("/api/dorms/my-properties");
        const data = await res.json();
        setDorms(data);
      } catch (err) {
        console.error("Error fetching properties", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDorms();
  }, []);

  if (loading) return <p>Loading your properties...</p>;
  if (dorms.length === 0) return <p>You haven&apos;t listed any properties yet.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {dorms.map((dorm) => (
        <div key={dorm._id} className="border rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-bold">{dorm.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{dorm.description}</p>
          <p className="text-sm">💰 ${dorm.pricePerMonth}/month</p>
          <p className="text-sm">
            🛏️ Capacity: {dorm.capacity} | Available: {dorm.availableSpots}
          </p>
          <p className="text-sm">🔒 {dorm.isBooked ? "Booked" : "Available"}</p>
          <p className="text-sm">
            👁️ Visibility: {dorm.isVisible ? "Visible" : "Hidden"}
          </p>
          <p className="text-sm mt-2">
            🏷️ Amenities: {dorm.amenities.join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyPropertiesList;
