import { getCookie } from "./cookieUtils";
import { UserProfile } from "./FetchUserAPI";

export async function searchStudents(criteria: Record<string, any>): Promise<{ students: UserProfile[]; totalPages: number }> {
    const { token } = getCookie();
  
    const queryParams = new URLSearchParams();
    Object.keys(criteria).forEach((key) => {
      const value = criteria[key];
      if (key === "ageRange") {
        if (value.min !== '' && value.min !== undefined) queryParams.append("minAge", value.min.toString());
        if (value.max !== '' && value.max !== undefined) queryParams.append("maxAge", value.max.toString());
      } else if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
  
    const url = `http://localhost:5000/api/students?${queryParams.toString()}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch students.");
    }
  
    const data = await res.json();
    return data;
  }
  