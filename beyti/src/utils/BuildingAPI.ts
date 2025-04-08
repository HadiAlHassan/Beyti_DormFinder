import { getCookie } from "@/utils/cookieUtils";

// 🔄 Updated to remove amenities + add ispublic
export interface BuildingPayload {
  name: string;
  address: string;
  description: string;
  lat: number;
  lon: number;
  ispublic: boolean;
  rules: {
    smoking: boolean;
    petsAllowed: boolean;
    noiseRestrictions: boolean;
    otherPolicies: string;
  };
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
  formData.append("ispublic", String(data.ispublic));

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

export async function createApartment(data: {
  buildingId: string;
  name: string;
  description: string;
  pricePerMonth: number;
  capacity: number;
  availableSpots: number;
  amenities: string[]; // ✅ Added this
  pictures: File[];
}) {
  const { token } = getCookie();
  if (!token) throw new Error("Missing token.");

  const fd = new FormData();
  fd.append("buildingId", data.buildingId);
  fd.append("name", data.name);
  fd.append("description", data.description);
  fd.append("pricePerMonth", data.pricePerMonth.toString());
  fd.append("capacity", data.capacity.toString());
  fd.append("availableSpots", data.availableSpots.toString());
  fd.append("amenities", JSON.stringify(data.amenities));

  data.pictures.forEach((file) => fd.append("pictures", file));

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/apartments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: fd,
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

// ✅ Add public building fetcher for dropdown
export async function getPublicBuildings() {
  const { token } = getCookie();
  if (!token) throw new Error("Missing token.");

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/buildings/public`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to fetch public buildings");
  }

  return await response.json();
}

export async function getBuildingById(id: string) {
  const { token } = getCookie();
  if (!token) throw new Error("Missing token.");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/buildings/${id}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  if (!response.ok) return null;
  return await response.json();
}
