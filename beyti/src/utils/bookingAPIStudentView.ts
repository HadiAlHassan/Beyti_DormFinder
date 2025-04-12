import { getCookie } from "@/utils/cookieUtils";

export async function getStudentBookings() {
  const { token } = getCookie();
  if (!token) throw new Error("Missing token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/my-bookings`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch bookings");
  return await res.json();
}

export async function cancelStudentBooking(id: string) {
  const { token } = getCookie();
  if (!token) throw new Error("Missing token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}/cancel`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to cancel booking");
  }

  return await res.json();
}
