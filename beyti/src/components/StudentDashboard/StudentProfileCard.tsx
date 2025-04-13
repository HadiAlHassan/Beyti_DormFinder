"use client";

import React, { useState } from "react";
import { UserProfile } from "@/utils/FetchUserAPI";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCookie } from "@/utils/cookieUtils";
import RoommateBookingModal from "@/components/StudentDashboard/RoomateBookingModal";

interface Props {
  profile: UserProfile & { matchScore?: number };
  onView?: () => void;
}

const StudentProfileCard: React.FC<Props> = ({ profile, onView }) => {
  const [booking, setBooking] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [showBookingInfo, setShowBookingInfo] = useState(false);
  const fetchAndShowModal = async () => {
    setLoadingBooking(true);
    try {
      const { token } = getCookie();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/active/${profile.lau_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data?.apartment) {
        setBooking(data);
        setShowModal(true);
      } else {
        alert("No active booking found.");
      }
    } catch (err) {
      console.error("Error fetching booking:", err);
    } finally {
      setLoadingBooking(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-sm rounded-2xl">
      <CardContent className="p-4 flex flex-col gap-3">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-xl font-semibold">
            {profile.picture ? (
              <img
                src={`data:${profile.picture.contentType};base64,${profile.picture.data}`}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              `${profile.first_name[0]}${profile.last_name[0]}`
            )}
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">
                  {profile.first_name} {profile.last_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {profile.major} | {getYearFromStartDate(profile.uni_start_data)}
                </p>
              </div>
              {profile.matchScore !== undefined && (
                <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-xl">
                  {profile.matchScore} match{profile.matchScore !== 1 && "es"}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-2 text-xs">
              {profile.sleep_schedule && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {profile.sleep_schedule}
                </span>
              )}
              {profile.cleanliness_level && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {profile.cleanliness_level}
                </span>
              )}
              {profile.noise_tolerance && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  Noise: {profile.noise_tolerance}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <Button onClick={onView} size="sm">View</Button>
          <Button onClick={fetchAndShowModal} size="sm" variant="secondary">
            {loadingBooking ? "Loading..." : "View Active Booking"}
          </Button>

          <RoommateBookingModal
  open={showModal}
  onClose={() => setShowModal(false)}
  booking={booking}
/>
        </div>

        {/* Booking Info */}
        {showBookingInfo && (
          <div className="bg-muted/30 p-3 rounded mt-2 text-sm space-y-2">
            {booking ? (
              <>
                <h4 className="font-semibold text-primary">
                  🏢 {booking.building?.name}
                </h4>
                <p><strong>Address:</strong> {booking.building?.address}</p>
                <p><strong>Apartment:</strong> {booking.apartment?.name}</p>
                <p><strong>Status:</strong> {booking.status}</p>
                <p><strong>Price:</strong> ${booking.apartment?.pricePerMonth}</p>
                <p><strong>Available Spots:</strong> {booking.apartment?.availableSpots}</p>
                <div className="flex flex-wrap gap-1">
                  {booking.apartment?.amenities?.map((am: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {am}
                    </Badge>
                  ))}
                </div>

                {booking.apartment?.availableSpots > 0 ? (
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={() => window.location.href = `/book/${booking.apartment._id}`}
                  >
                    Book This Apartment
                  </Button>
                ) : (
                  <p className="text-red-500 font-medium mt-1">
                    No available spots.
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                No current active booking found for this student.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

function getYearFromStartDate(startDate: string): string {
    const start = new Date(startDate);
    const now = new Date();
    let year = now.getFullYear() - start.getFullYear();
  
    const monthDiff = now.getMonth() - start.getMonth();
    const dayDiff = now.getDate() - start.getDate();
  
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      year--;
    }
  
    if (year <= 0) return '1st Year';
    if (year === 1) return '2nd Year';
    if (year === 2) return '3rd Year';
    return '4+ Year';
  }
  

export default StudentProfileCard;
