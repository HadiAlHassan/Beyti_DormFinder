"use client";

import { useEffect, useState } from "react";
import { getBookingsByDormOwner, updateBookingStatus } from "@/utils/bookingAPILandlordView";
import StudentProfileCard from "@/components/StudentDashboard/StudentProfileCard";
import StudentProfileViewer from "@/components/StudentDashboard/RoomateViewer";
import { UserProfile } from "@/utils/FetchUserAPI";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const statusOrder = ["pending", "approved", "rejected", "cancelled"];

export default function LandlordBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [viewingStudent, setViewingStudent] = useState<UserProfile | null>(null);

  useEffect(() => {
    getBookingsByDormOwner()
      .then((bookings) => {
        console.log("📦 bookings fetched:", bookings);
        if (Array.isArray(bookings)) {
          setBookings(bookings);
        } else {
          console.warn("⚠️ No valid bookings array in response");
          setBookings([]);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch bookings:", err);
        setBookings([]);
      });
  }, []);

  const handleStatusUpdate = async (
    id: string,
    newStatus: "approved" | "rejected" | "cancelled"
  ) => {
    try {
      const updatedBooking = await updateBookingStatus(id, newStatus);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id
            ? {
                ...b,
                status: updatedBooking.status,
                apartmentId: updatedBooking.apartmentId,
              }
            : b
        )
      );
    } catch (err) {
      console.error(`Failed to ${newStatus} booking:`, err);
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
      {viewingStudent ? (
        <StudentProfileViewer
          profile={viewingStudent}
          onBack={() => setViewingStudent(null)}
        />
      ) : (
        statusOrder.map((status) => (
          <div key={status}>
            <h2 className="text-xl font-bold capitalize mb-4">{status} Bookings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {grouped[status]?.map((booking: any) => {
                const student = { ...booking.studentId };

                if (
                  student.picture?.data?.data &&
                  Array.isArray(student.picture.data.data)
                ) {
                  const binary = String.fromCharCode(...student.picture.data.data);
                  student.picture.data = btoa(binary);
                }

                return (
                  <Card key={booking._id} className="p-4 space-y-3">
                    <div className="text-sm text-muted-foreground">
                      <strong>Building:</strong> {booking.buildingId?.name}
                      <br />
                      <strong>Address:</strong> {booking.buildingId?.address}
                      <br />
                      <strong>Description:</strong> {booking.buildingId?.description}
                    </div>

                    <div className="text-sm">
                      <strong>Apartment:</strong> {booking.apartmentId?.name}
                      <br />
                      <strong>Capacity:</strong> {booking.apartmentId?.capacity}
                      <br />
                      <strong>Available Spots:</strong> {booking.apartmentId?.availableSpots}
                    </div>

                    <StudentProfileCard
                      profile={student}
                      onView={() => setViewingStudent(student)}
                    />

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      {status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(booking._id, "approved")}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusUpdate(booking._id, "rejected")}
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {status === "approved" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusUpdate(booking._id, "rejected")}
                        >
                          Reject
                        </Button>
                      )}

                      {status === "rejected" && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(booking._id, "approved")}
                        >
                          Approve
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
