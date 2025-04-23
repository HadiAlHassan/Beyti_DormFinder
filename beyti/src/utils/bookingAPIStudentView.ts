import { getCookie } from "@/utils/cookieUtils";

export async function   getStudentBookings() {
  const { token } = getCookie();
  if (!token) throw new Error("Missing token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/my-bookingsStatus`, {
    headers: { Authorization: `Bearer ${token}` },
  });


  const data = await res.json();
  console.log("📦 Booking API Response:", data);
  
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return data;
}

export async function cancelStudentBooking(id: string, message: string) {
  const { token } = getCookie();
  if (!token) throw new Error("Missing token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}/cancel`, {
    method: "PUT",
    headers: { "Content-Type": "application/json",
      Authorization: `Bearer ${token}` },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to cancel booking");
  }

  return await res.json();
}
