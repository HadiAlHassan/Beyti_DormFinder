import { getCookie } from "./cookieUtils";

export async function getTicketsByLandlord(landlordId: string, token: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets/by-dormowner/${landlordId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include", // Because you're using cookies
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tickets");
  }

  return await response.json();
}
export async function updateTicketStatus(id: string, status: string) {
  const { token } = getCookie();
  const res = await fetch(`http://localhost:5000/api/tickets/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("Failed to update status");
}

export async function addTicketReply(id: string, message: string) {
  const { token } = getCookie();
  const res = await fetch(`http://localhost:5000/api/tickets/${id}/reply`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) throw new Error("Failed to add reply");
}
