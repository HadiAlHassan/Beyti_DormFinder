"use client";

import { getCookie } from "@/utils/cookieUtils";
import SubmitTicketModal from "@/components/StudentDashboard/RMS/SubmitTicketModal";
import TicketHistory from "@/components/StudentDashboard/RMS/TicketHistory";
import StudentPayments from "@/components/StudentDashboard/RMS/StudentPayments";
import { useEffect, useState } from "react";
import PayRentModal from "@/components/StudentDashboard/RMS/PayRentModal";
import { payRentWithWallet } from "@/utils/rentAPI";
import SuccessModal from "@/components/StudentDashboard/RMS/SuccessModal";
import { getFromDB, saveToDB } from "@/lib/indexedDB"; // 🆕 Import indexedDB helpers

export default function RentPage() {
  const { userId, token } = getCookie();
  
  const [dormId, setDormId] = useState<string>("");
  const [landlordId, setLandlordId] = useState<string | null>(null);
  const [infoLoading, setInfoLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null
  );
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const fetchBookingInfo = async () => {
    try {
      if (!userId) {
        console.error("❌ No userId found, cannot fetch booking info.");
        return;
      }
      // 🆕 Try IndexedDB first
      const cachedBooking = await getFromDB("booking", userId);
      const cachedLandlord = await getFromDB("landlord", userId);

      if (cachedBooking) {
        setDormId(cachedBooking.apartmentId);
      }
      if (cachedLandlord) {
        setLandlordId(cachedLandlord.landlordId);
      }

      // 🛠 In background, fetch real fresh data
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

        // ✅ Save to cache
        await saveToDB("booking", userId, {
          apartmentId: result.apartment._id,
        });
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

        // ✅ Save to cache
        await saveToDB("landlord", userId, { landlordId: result.landlordId });
      } else {
        console.error("Failed to fetch landlord info");
      }
    } catch (error) {
      console.error("Error fetching booking info:", error);
    } finally {
      setInfoLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) {
      fetchBookingInfo();
    }
  }, [userId, token]);

  if (infoLoading) {
    return <div className="p-6">Loading rent information...</div>;
  }

  const handlePayWithWallet = async () => {
    if (!selectedPaymentId) return;

    try {
      await payRentWithWallet(selectedPaymentId);
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);

      setTimeout(() => {
        setIsSuccessModalOpen(false);
      }, 2500);

      // Optionally: refresh wallet or rent payments list
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("❌ Failed to pay rent with wallet.");
    }
  };

  return (
    <div className="p-6 space-y-10">
      {/* Rent Payments Section */}
      <section className="space-y-6">
        <StudentPayments
          onPayNowClick={(paymentId: string) => {
            setSelectedPaymentId(paymentId);
            setIsModalOpen(true);
          }}
        />
      </section>

      {/* Ticket Management Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Maintenance Tickets</h2>

        <SubmitTicketModal
          landlordId={landlordId ?? ""}
          dormId={dormId}
          studentId={userId || ""}
        />

        <TicketHistory />
      </section>

      <PayRentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPayWithWallet={handlePayWithWallet}
        onPayWithCard={() => {
          alert("💳 Dummy card payment not implemented yet.");
          setIsModalOpen(false);
        }}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message="Rent Paid Successfully!"
      />
    </div>
  );
}
