// utils/walletAPI.ts (or wherever you want)

import { getCookie } from "./cookieUtils";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function payDeposit(apartmentId: string) {
    const {token,userId} = getCookie(); 

  try {
    const res = await fetch(`${BASE_URL}/api/wallet/pay-deposit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ apartmentId,userId }),
      credentials: "include", // if you are using cookies/session (important!)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to pay deposit");
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error("❌ Error paying deposit:", error);
    throw new Error(error.message || "Something went wrong while paying deposit.");
  }
}
