"use client";

import { getCookie } from "@/utils/cookieUtils";
import SubmitTicketModal from "@/components/StudentDashboard/RMS/SubmitTicketModal";
import TicketHistory from "@/components/StudentDashboard/RMS/TicketHistory";
import StudentPayments from "@/components/StudentDashboard/RMS/StudentPayments"; // 🆕 import the one you already have
import { useEffect, useState } from "react";

export default function RentPage() {
  const { userId, token } = getCookie();
  const [dormId, setDormId] = useState<string>("");
  const [landlordId, setLandlordId] = useState<string | null>(null);
  const [infoLoading, setInfoLoading] = useState(true);

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

  if (infoLoading) {
    return <div className="p-6">Loading rent information...</div>;
  }

  return (
    <div className="p-6 space-y-10">
      {/* Rent Payments Section */}
      <section className="space-y-6">
        <StudentPayments />
      </section>

      {/* Ticket Management Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Maintenance Tickets</h2>

        {/* Ticket Submission */}
        <SubmitTicketModal
          landlordId={landlordId ?? ""}
          dormId={dormId}
          studentId={userId || ""}
        />

        {/* Ticket History */}
        <TicketHistory />
      </section>
    </div>
  );
}
