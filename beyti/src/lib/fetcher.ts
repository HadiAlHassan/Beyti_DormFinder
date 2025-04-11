import { getCookie } from "@/utils/cookieUtils";

export const fetcherWithAuth = async (url: string) => {
  const { token } = getCookie();
  if (!token) throw new Error("Missing token");

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }

  return res.json();
};
