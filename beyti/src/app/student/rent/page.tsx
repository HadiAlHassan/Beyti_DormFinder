"use client";

import { useEffect, useState } from "react";
import { getStudentRentPayments, RentPayment } from "@/utils/rentAPI";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RentPage = () => {
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getStudentRentPayments();
        setPayments(data);
      } catch (err) {
        console.error("Failed to fetch rent payments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const getStatusColor = (status: RentPayment["status"]) => {
    return {
      unpaid: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
    }[status];
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">📅 Rent Payments</h1>

      {loading ? (
        <p>Loading...</p>
      ) : payments.length === 0 ? (
        <p className="text-muted-foreground">No rent payments found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {payments.map((payment) => (
            <Card key={payment._id}>
              <CardHeader>
                <CardTitle>{payment.month}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-lg font-medium">
                  💰 ${payment.amount.toFixed(2)}
                </div>

                <Badge className={getStatusColor(payment.status)}>
                  {payment.status.toUpperCase()}
                </Badge>

                <div className="text-sm text-muted-foreground">
                  Method: {payment.paymentMethod}
                </div>

                {payment.paymentMethod === "cash" && (
                  <div className="text-sm text-muted-foreground">
                    Landlord Confirmed:{" "}
                    {payment.landlordConfirmed ? "✅ Yes" : "❌ No"}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RentPage;
