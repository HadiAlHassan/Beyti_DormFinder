import { getCookie } from "./cookieUtils"; // ✅ Import your cookie reader

export async function updateApartment(apartmentId: string, updateData: unknown) {
  const {token} = getCookie();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/apartments/update/${apartmentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, 
    },
    credentials: "include", 
    body: JSON.stringify(updateData),
  });

  if (!res.ok) {
    throw new Error("Failed to update apartment");
  }

  return res.json();
}
