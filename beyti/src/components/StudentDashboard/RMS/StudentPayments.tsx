"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/utils/cookieUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Payment {
  _id: string;
  month: number;
  year: number;
  amount: number;
  status: "paid" | "pending" | "unpaid";
  paymentMethod: "cash" | "online";
  landlordConfirmed: boolean;
}

interface StudentPaymentsProps {
  onPayNowClick: (paymentId: string) => void; // 🆕 accept this prop
}

export default function StudentPayments({
  onPayNowClick,
}: StudentPaymentsProps) {
  const { userId, token } = getCookie();
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/rent-payments/student/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setPayments(data);
      } catch (err) {
        console.error("Failed to fetch student payments:", err);
      }
    };

    fetchPayments();
  }, [userId, token]);

  const getStatusColor = (status: string) => {
    if (status === "paid") return "bg-green-500 text-white";
    if (status === "pending") return "bg-yellow-500 text-white";
    return "bg-red-500 text-white";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Rent Payments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {payments.map((p) => (
          <Card key={p._id}>
            <CardContent className="p-4 space-y-2">
              <div className="font-semibold text-lg">
                {`${p.month}/${p.year}`}
              </div>
              <div className="text-sm">Amount: ${p.amount.toFixed(2)}</div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(p.status)}>
                  {p.status.toUpperCase()}
                </Badge>
                <Badge variant="outline">{p.paymentMethod.toUpperCase()}</Badge>
              </div>

              {/* Show Pay Now button if unpaid */}
              {(p.status === "unpaid" || p.status === "pending") && (
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => onPayNowClick(p._id)}
                >
                  Pay Now
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
