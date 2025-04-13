"use client";

import { useEffect, useState } from "react";
import { getStudentBookings, cancelStudentBooking } from "@/utils/bookingAPIStudentView";
import StudentBookingCard from "@/components/StudentDashboard/Dorms/StudentBookingCard";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

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
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary">
          🧳 My Dorm Bookings
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Review your current and past booking requests.
        </p>
      </div>

      {statusOrder.map((status) =>
        grouped[status]?.length > 0 ? (
          <section key={status}>
            <h2 className="text-2xl font-semibold text-primary mb-4 capitalize">
              {status} Bookings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {grouped[status].map((booking: any) => (
                <StudentBookingCard
                  key={booking._id}
                  booking={booking}
                  onCancel={() => handleCancel(booking._id)}
                />
              ))}
            </div>
            <Separator className="my-10" />
          </section>
        ) : null
      )}

      {Object.values(grouped).flat().length === 0 && (
        <div className="text-center text-muted-foreground mt-12">
          <p className="text-lg">You have no bookings yet.</p>
        </div>
      )}
    </div>
  );
}
