// utils/bookingAPI.ts
import { getCookie } from "@/utils/cookieUtils";

export async function getBookingsByDormOwner() {
  const { token, userId: dormOwnerId } = getCookie(); // ✅ get userId from cookie

  if (!token || !dormOwnerId) throw new Error("Missing token or userId");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/by-dorm-owner/${dormOwnerId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // still needed if your backend checks it
      },
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch bookings");
  }

  return await res.json();
}

export async function updateBookingStatus(bookingId: string, status: string) {
    const { token } = getCookie();
    if (!token) throw new Error("Missing token");
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/${status}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Status update failed");
    }
  
    return await res.json();
  }
  