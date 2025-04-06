import { getCookie } from "./cookieUtils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// ---------- TYPES ----------

export interface ApartmentPayload {
  buildingId: string;
  name: string;
  description?: string;
  pricePerMonth: number;
  capacity: number;
  availableSpots: number;
}

export interface BuildingPayload {
  name: string;
  address: string;
  description: string;
  lat: number;
  lon: number;
  rules: {
    smoking: boolean;
    petsAllowed: boolean;
    noiseRestrictions: boolean;
    otherPolicies: string;
  };
  amenities: string[];
}

// ---------- API FUNCTIONS ----------

// GET all buildings with apartments for current landlord
export const getMyBuildings = async () => {
  const token = getCookie().token;

  const res = await fetch(`${API_BASE}/api/buildings/my-properties`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch buildings");

  return await res.json();
};

// POST: create a building
export const createBuilding = async (buildingData: BuildingPayload) => {
  const token = getCookie().token;

  const res = await fetch(`${API_BASE}/api/buildings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(buildingData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to create building: ${error}`);
  }

  return await res.json();
};

// POST: create an apartment linked to a building
export const createApartment = async (apartmentData: ApartmentPayload) => {
  const token = getCookie().token;

  const res = await fetch(`${API_BASE}/api/apartments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(apartmentData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to create apartment: ${error}`);
  }

  return await res.json();
};
