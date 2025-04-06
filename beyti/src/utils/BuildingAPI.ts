import { getCookie } from "@/utils/cookieUtils";

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
  picture?: File | null;
}

export async function createBuilding(data: BuildingPayload) {
  const { token } = getCookie();
  if (!token) {
    throw new Error("Missing token.");
  }

  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("address", data.address);
  formData.append("description", data.description);
  formData.append("lat", String(data.lat));
  formData.append("lon", String(data.lon));
  formData.append("rules", JSON.stringify(data.rules));
  formData.append("amenities", JSON.stringify(data.amenities));

  if (data.picture) {
    formData.append("picture", data.picture);
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/buildings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to create building");
  }

  return await response.json();
}


export interface ApartmentPayload {
  buildingId: string;
  name: string;
  description: string;
  pricePerMonth: number;
  capacity: number;
  availableSpots: number;
  pictures?: File[];
}

export async function createApartment(data: ApartmentPayload) {
  const { token } = getCookie();
  if (!token) {
    throw new Error("Missing token.");
  }

  const formData = new FormData();
  formData.append("buildingId", data.buildingId);
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("pricePerMonth", String(data.pricePerMonth));
  formData.append("capacity", String(data.capacity));
  formData.append("availableSpots", String(data.availableSpots));

  if (data.pictures) {
    data.pictures.forEach((file) => {
      formData.append("pictures", file); // keep name "pictures" for .array()
    });
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/apartments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to create apartment");
  }

  return await response.json();
}

export async function getMyBuildings() {
  const { token } = getCookie();
  if (!token) {
    throw new Error("Missing token.");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/buildings/my-properties`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to fetch buildings");
  }

  return await response.json();
}
