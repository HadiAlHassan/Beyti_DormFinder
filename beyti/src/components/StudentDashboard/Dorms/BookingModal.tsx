"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getCookie } from "@/utils/cookieUtils";
import { useToast } from "@/components/ui/use-toast";
const { toast } = useToast();

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  apartment: {
    _id: string;
    pricePerMonth: number;
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
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleApply = async () => {
    if (!checkIn || !checkOut) {
      toast(
        "Missing Dates",{
        description: "Please fill in both check-in and check-out dates.",
      });
      return;
    }
  
    const { token } = getCookie();
    if (!token) {
      toast(
        "Not Authenticated",{
        description: "You must be logged in to book.",
      });
      return;
    }
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/book`, {
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
          note,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Booking failed.");
      }
  
      setSubmitted(true);
  
      toast(
        "✅ Booking Submitted",{
        description: "Your request has been sent for approval.",
      });
    } catch (error: any) {
      toast(
        "Booking Failed",{
        description: error.message || "An unexpected error occurred.",
      });
    }
  };
  
  return (
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
              <p>📅 <strong>Start Date:</strong> {checkIn}</p>
              <p>📅 <strong>End Date:</strong> {checkOut}</p>
              <Button className="w-full mt-4" onClick={onClose}>
                Close
              </Button>
            </>
          ) : (
            <>
  <div className="space-y-4">
    <div className="space-y-1">
      <label htmlFor="checkin" className="text-sm font-medium text-foreground">
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
      <label htmlFor="checkout" className="text-sm font-medium text-foreground">
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
      <label htmlFor="note" className="text-sm font-medium text-foreground">
        Note (optional)
      </label>
      <Textarea
        id="note"
        placeholder="Optional note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
    </div>

    <Button className="w-full" onClick={handleApply}>
      Apply
    </Button>
  </div>
</>

          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
