"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/utils/cookieUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBuildings } from "@/context/BuildingsContext";

interface Payment {
  _id: string;
  student: {
    first_name: string;
    last_name: string;
    lau_id: number;
  };
  apartment: {
    _id: string;
    name: string;
  };
  month: string;
  amount: number;
  status: "paid" | "pending" | "unpaid";
  paymentMethod: "cash" | "online";
  landlordConfirmed: boolean;
}

export default function LandlordPayments() {
  const { buildings, isLoading: buildingsLoading } = useBuildings();
  const { token } = getCookie();
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    if (!buildings || buildings.length === 0) return;

    const apartmentIds = buildings.flatMap((b) =>
      b.apartments.map((apt) => apt._id)
    );

    const fetchPayments = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/rent-payments/by-apartments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ apartmentIds }),
          }
        );
        const data = await res.json();
        setPayments(data);
      } catch (err) {
        console.error("Failed to fetch landlord payments:", err);
      }
    };

    fetchPayments();
  }, [buildings, token]);

  const confirmPayment = async (id: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/rent-payments/${id}/confirm`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to confirm payment");
      alert("✅ Payment confirmed");

      setPayments((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, status: "paid", landlordConfirmed: true } : p
        )
      );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("❌ Failed to confirm cash payment");
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "paid") return "bg-green-500 text-white";
    if (status === "pending") return "bg-yellow-500 text-white";
    return "bg-red-500 text-white";
  };

  if (buildingsLoading || !buildings) {
    return <p className="p-4">Loading payments...</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Rent Payments Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {payments.map((p) => (
          <Card key={p._id}>
            <CardContent className="p-4 space-y-2">
              <div className="font-semibold text-lg">{p.month}</div>
              <div className="text-sm">
                Tenant: {p.student.first_name} {p.student.last_name} (
                {p.student.lau_id})
              </div>
              <div className="text-sm">Apartment: {p.apartment.name}</div>
              <div className="text-sm">Amount: ${p.amount.toFixed(2)}</div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(p.status)}>
                  {p.status.toUpperCase()}
                </Badge>
                <Badge variant="outline">{p.paymentMethod.toUpperCase()}</Badge>
              </div>
              {p.paymentMethod === "cash" &&
                p.status !== "paid" &&
                !p.landlordConfirmed && (
                  <Button size="sm" onClick={() => confirmPayment(p._id)}>
                    Confirm Cash Payment
                  </Button>
                )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
