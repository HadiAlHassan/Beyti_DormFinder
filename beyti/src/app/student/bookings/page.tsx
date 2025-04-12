"use client";

import { useEffect, useState } from "react";
import { getStudentBookings, cancelStudentBooking } from "@/utils/bookingAPIStudentView";
import StudentBookingCard from "@/components/StudentDashboard/Dorms/StudentBookingCard";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const statusOrder = ["pending", "approved", "rejected", "cancelled"];

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    getStudentBookings()
      .then((bookings) => {
        console.log("📦 student bookings fetched:", bookings);
        if (Array.isArray(bookings)) {
          setBookings(bookings);
        } else {
          console.warn("⚠️ No valid bookings array in response");
          setBookings([]);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch student bookings:", err);
        setBookings([]);
      });
  }, []);

  const handleCancel = async (id: string) => {
    try {
      const updated = await cancelStudentBooking(id);
      toast("Booking Cancelled", {
        description: "Your booking was successfully cancelled.",
      });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: updated.status } : b))
      );
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      toast("Error", {
        description: "Failed to cancel the booking. Please try again.",
      });
    }
  };

  const grouped = bookings.reduce((acc, booking) => {
    const status = booking.status || "unknown";
    if (!acc[status]) acc[status] = [];
    acc[status].push(booking);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="p-6 space-y-8">
      {statusOrder.map((status) => (
        <div key={status}>
          <h2 className="text-xl font-bold capitalize mb-4">{status} Bookings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {grouped[status]?.map((booking: any) => (
              <StudentBookingCard
                key={booking._id}
                booking={booking}
                onCancel={() => handleCancel(booking._id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
