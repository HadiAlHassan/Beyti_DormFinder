import { getCookie } from "./cookieUtils";

export interface RentPayment {
  _id: string;
  month: string;
  amount: number;
  status: "unpaid" | "pending" | "paid";
  paymentMethod: "cash" | "online";
  landlordConfirmed: boolean;
}

export async function getStudentRentPayments(): Promise<RentPayment[]> {
  const { token, userId } = getCookie();
  if (!token || !userId) throw new Error("Missing token or student ID");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/rent-payments/student/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch rent payments.");
  }

  return await res.json();
}

export const payRentWithWallet = async (paymentId: string) => {
  const { token, role } = getCookie();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/pay/${paymentId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(role ? { "x-user-role": role } : {}),
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to pay rent with wallet");
  }

  return res.json();
};
