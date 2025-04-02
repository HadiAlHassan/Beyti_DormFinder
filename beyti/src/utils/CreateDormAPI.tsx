import { getCookie } from "@/utils/cookieUtils";
import type { DormFormData } from "@/components/LandLordDashboad/MyProperties/AddDormModal";

export async function createDormListing(data: DormFormData) {
  const { token } = getCookie();

  if (!token) {
    throw new Error("Missing token.");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dorms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ✅ send custom token
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to create dorm");
  }

  return await response.json();
}
