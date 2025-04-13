"use client";

import { useEffect, useState } from "react";
import { getBookingsByDormOwner, updateBookingStatus } from "@/utils/bookingAPILandlordView";
import StudentProfileCardBooking from "@/components/StudentDashboard/StudentProfileCardBooking";
import StudentProfileViewer from "@/components/StudentDashboard/RoomateViewer";
import { UserProfile } from "@/utils/FetchUserAPI";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusOrder = ["pending", "approved", "rejected", "cancelled"];

export default function LandlordBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [viewingStudent, setViewingStudent] = useState<UserProfile | null>(null);

  useEffect(() => {
    getBookingsByDormOwner()
      .then((bookings) => {
        console.log("📦 bookings fetched:", bookings);
        if (Array.isArray(bookings)) setBookings(bookings);
        else setBookings([]);
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
      await updateBookingStatus(id, newStatus);
  
      const refreshed = await getBookingsByDormOwner();
      setBookings(refreshed);
    } catch (err) {
      console.error(`❌ Failed to ${newStatus} booking:`, err);
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
        <StudentProfileViewer profile={viewingStudent} onBack={() => setViewingStudent(null)} />
      ) : (
        statusOrder.map((status) => (
          <div key={status}>
            <h2 className="text-2xl font-semibold text-primary mb-4">
              {status.charAt(0).toUpperCase() + status.slice(1)} Bookings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {grouped[status]?.map((booking: any) => {
                const student = { ...booking.studentId };

                if (student.picture?.data?.data && Array.isArray(student.picture.data.data)) {
                  const binary = String.fromCharCode(...student.picture.data.data);
                  student.picture.data = btoa(binary);
                }

                return (
                  <Card key={booking._id} className="rounded-2xl shadow border border-muted">
                    <CardHeader>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="text-base font-medium text-primary">🏢 {booking.buildingId?.name}</div>
                        <div><strong>Address:</strong> {booking.buildingId?.address}</div>
                        <div><strong>Description:</strong> {booking.buildingId?.description}</div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-2 text-sm">
                      <div className="bg-muted/40 p-2 rounded-md space-y-1">
                        <p><strong>Apartment:</strong> {booking.apartmentId?.name}</p>
                        <p><strong>Price:</strong> ${booking.apartmentId?.pricePerMonth}</p>
                        <p><strong>Capacity:</strong> {booking.apartmentId?.capacity}</p>
                        <p><strong>Available Spots:</strong> {booking.apartmentId?.availableSpots}</p>
                        <div>
                          <strong>Status:</strong>{" "}
                          <Badge
                            className={
                              status === "pending"
                                ? "text-yellow-600 border-yellow-600"
                                : status === "approved"
                                ? "text-green-600 border-green-600"
                                : status === "rejected"
                                ? "text-red-600 border-red-600"
                                : "text-gray-600 border-gray-600"
                            }
                            variant="outline"
                          >
                            {status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>

                    <CardContent className="pt-2">
                      <StudentProfileCardBooking
                        profile={student}
                        onView={() => setViewingStudent(student)}
                      />
                    </CardContent>

                    {(status === "pending" || status === "approved" || status === "rejected") && (
                      <CardFooter className="flex justify-end gap-2">
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
                      </CardFooter>
                    )}
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
