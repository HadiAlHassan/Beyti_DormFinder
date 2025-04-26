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
