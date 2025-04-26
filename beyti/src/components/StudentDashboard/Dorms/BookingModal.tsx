"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getCookie } from "@/utils/cookieUtils";
import { useToast } from "@/components/ui/use-toast";

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  apartment: {
    _id: string;
    pricePerMonth: number;
    depositAmount: number;
    dormOwnerId: string;
    buildingId: string;
  };
  studentId: string;
}

export const BookingDialog: React.FC<BookingDialogProps> = ({
  open,
  onClose,
  apartment,
  studentId,
}) => {
  const { toast } = useToast(); // ✅ correct placement inside component

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [confirmPaymentOpen, setConfirmPaymentOpen] = useState(false);

  const handleApplyClick = () => {
    if (!checkIn || !checkOut) {
      toast("Missing Dates", {
        description: "Please fill in both check-in and check-out dates.",
      });
      return;
    }
    setConfirmPaymentOpen(true); // open deposit confirmation popup
  };

  const handleConfirmPayment = async () => {
    setConfirmPaymentOpen(false);

    const { token } = getCookie();
    if (!token) {
      toast("Not Authenticated", {
        description: "You must be logged in to book.",
      });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/student/book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            studentId,
            apartmentId: apartment._id,
            dormOwnerId: apartment.dormOwnerId,
            buildingId: apartment.buildingId,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            monthlyPayment: apartment.pricePerMonth,
            depositAmount: apartment.depositAmount,
            note,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking failed.");
      }

      setSubmitted(true);

      toast("✅ Booking Submitted", {
        description: "Your request has been sent for approval.",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast("Booking Failed", {
          description: error.message,
        });
      } else {
        toast("Booking Failed", {
          description: "An unexpected error occurred.",
        });
      }
    }
  };

  return (
    <>
      {/* Main Booking Form Dialog */}
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book This Apartment</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {submitted ? (
              <>
                <p className="text-green-700 font-medium">
                  ✅ Booking submitted!
                </p>
                <p>
                  📅 <strong>Start Date:</strong> {checkIn}
                </p>
                <p>
                  📅 <strong>End Date:</strong> {checkOut}
                </p>
                <Button className="w-full mt-4" onClick={onClose}>
                  Close
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label
                      htmlFor="checkin"
                      className="text-sm font-medium text-foreground"
                    >
                      Check-in Date
                    </label>
                    <Input
                      id="checkin"
                      type="date"
                      placeholder="Check-in Date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="checkout"
                      className="text-sm font-medium text-foreground"
                    >
                      Check-out Date
                    </label>
                    <Input
                      id="checkout"
                      type="date"
                      placeholder="Check-out Date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="note"
                      className="text-sm font-medium text-foreground"
                    >
                      Note (optional)
                    </label>
                    <Textarea
                      id="note"
                      placeholder="Optional note..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>

                  <Button className="w-full" onClick={handleApplyClick}>
                    Apply
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Deposit Payment Popup */}
      <Dialog open={confirmPaymentOpen} onOpenChange={setConfirmPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deposit Payment</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-center text-lg">
              You must pay a deposit of <strong>${apartment.depositAmount}</strong> to book.
            </p>

            <div className="flex justify-center gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setConfirmPaymentOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmPayment}>Confirm Payment</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
