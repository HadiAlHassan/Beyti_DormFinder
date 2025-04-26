"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/utils/cookieUtils";
import { getStudentRentPayments, RentPayment } from "@/utils/rentAPI";
import SubmitTicketModal from "@/components/StudentDashboard/RMS/SubmitTicketModal";
import TicketHistory from "@/components/StudentDashboard/RMS/TicketHistory";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function RentPage() {
  const { userId, token } = getCookie();

  const [payments, setPayments] = useState<RentPayment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [dormId, setDormId] = useState<string>("");
  const [landlordId, setLandlordId] = useState<string | null>(null);
  const [infoLoading, setInfoLoading] = useState(true);

  // Fetch rent payments
  useEffect(() => {
    const fetchRent = async () => {
      try {
        const data = await getStudentRentPayments();
        setPayments(data);
      } catch (error) {
        console.error("Failed to fetch rent payments:", error);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRent();
  }, []);

  // Fetch dormId and landlordId
  useEffect(() => {
    const fetchBookingInfo = async () => {
      try {
        const resDorm = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/active/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (resDorm.ok) {
          const result = await resDorm.json();
          setDormId(result.apartment._id);
        } else {
          console.error("Failed to fetch dorm ID");
        }

        const resLandlord = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/rms/get-my-landlord`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (resLandlord.ok) {
          const result = await resLandlord.json();
          setLandlordId(result.landlordId);
        } else {
          console.error("Failed to fetch landlord info");
        }
      } catch (error) {
        console.error("Error fetching booking info:", error);
      } finally {
        setInfoLoading(false);
      }
    };

    if (userId && token) {
      fetchBookingInfo();
    }
  }, [userId, token]);

  const getStatusColor = (status: string) => {
    if (status === "paid") return "bg-green-500 text-white";
    if (status === "pending") return "bg-yellow-500 text-white";
    return "bg-red-500 text-white";
  };

  const handlePayNow = async (paymentId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/pay-online/${paymentId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Payment failed");
      alert("✅ Payment successful!");

      const updated = await getStudentRentPayments();
      setPayments(updated);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("❌ Failed to process payment.");
    }
  };

  if (infoLoading) {
    return <div>Loading rent information...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Rent Payments</h2>

      {/* 🔹 Ticket submission modal */}
      <SubmitTicketModal
        landlordId={landlordId ?? ""}
        dormId={dormId}
        studentId={userId || ""}
      />

      {/* 🔹 Rent Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : payments?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {payments.map((payment) => (
            <Card key={payment._id}>
              <CardContent className="p-4 space-y-2">
                <div className="text-lg font-semibold">{payment.month}</div>
                <div className="text-sm text-gray-600">
                  ${payment.amount.toFixed(2)}
                </div>
                <Badge className={getStatusColor(payment.status)}>
                  {payment.status.toUpperCase()}
                </Badge>

                {payment.paymentMethod === "cash" && (
                  <div className="text-xs mt-2">
                    Landlord Confirmed:{" "}
                    <span className="font-medium">
                      {payment.landlordConfirmed ? "Yes" : "No"}
                    </span>
                  </div>
                )}

                {payment.status === "unpaid" &&
                  payment.paymentMethod === "online" && (
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => handlePayNow(payment._id)}
                    >
                      Pay Now
                    </Button>
                  )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No rent payments found.</div>
      )}

      {/* Ticket history */}
      <TicketHistory />
    </div>
  );
}
