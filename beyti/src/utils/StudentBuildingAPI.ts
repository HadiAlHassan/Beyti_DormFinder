import { getCookie } from "@/utils/cookieUtils";

export async function getStudentBuildingById(id: string) {
  const { token } = getCookie();
  if (!token) throw new Error("Missing token");

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/buildings/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store", // prevents Next.js from caching this
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch student building");
  }

  return await response.json();
}
