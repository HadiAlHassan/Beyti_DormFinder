"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface Props {
  booking: any;
  onCancel: (id: string, message: string) => void;
}

const StudentBookingCard: React.FC<Props> = ({ booking, onCancel }) => {
  const [showCancelMessage, setShowCancelMessage] = useState(false);
  const { toast } = useToast();
  const [showMessage, setShowMessage] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");

  const apartment = booking.apartmentId;
  const building = booking.buildingId;
  const dormOwner = booking.dormOwnerId;

  const images =
    apartment?.pictures?.map((pic: any) => ({
      src: `data:${pic.contentType};base64,${Buffer.from(
        pic.data.data
      ).toString("base64")}`,
    })) ?? [];

  return (
    <Card className="w-full overflow-hidden shadow rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Apartment: {apartment?.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          💰 ${apartment?.pricePerMonth}/month
        </p>
        <div className="text-sm mt-1 text-muted-foreground">
          Status:{" "}
          <Badge
            className={
              booking.status === "pending"
                ? "text-yellow-600 border-yellow-600"
                : booking.status === "approved"
                ? "text-green-600 border-green-600"
                : booking.status === "rejected"
                ? "text-red-600 border-red-600"
                : "text-gray-600 border-gray-600"
            }
            variant="outline"
          >
            {booking.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 text-sm pt-0">
        {/* Building Info */}
        <div className="bg-muted/40 rounded-md p-2">
          <h4 className="text-sm font-medium text-primary">🏢 Building</h4>
          <p><strong>Name:</strong> {building?.name}</p>
          <p><strong>Address:</strong> {building?.address}</p>
        </div>

        {/* Apartment Info */}
        <div className="bg-muted/40 rounded-md p-2">
          <h4 className="text-sm font-medium text-primary">🛏️ Apartment</h4>
          <p><strong>Capacity:</strong> {apartment?.capacity}</p>
          <p><strong>Available:</strong> {apartment?.availableSpots}</p>
          <div className="flex flex-wrap gap-1 pt-1">
            {apartment?.amenities?.map((am: string, idx: number) => (
              <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5">
                {am}
              </Badge>
            ))}
          </div>
        </div>

        {/* Dorm Owner Info */}
        <div className="bg-muted/40 rounded-md p-2">
          <h4 className="text-sm font-medium text-primary">👤 Dorm Owner</h4>
          <p><strong>Name:</strong> {dormOwner?.first_name} {dormOwner?.last_name}</p>
          <p><strong>Phone:</strong> {dormOwner?.phone_number}</p>
        </div>
      </CardContent>

      {(booking.status === "pending" || booking.status === "approved") && (
        <CardFooter className="flex justify-end pt-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setShowCancelModal(true)}
          >
            Cancel
          </Button>
        </CardFooter>
      )}
        {booking.status === "cancelled" && booking.cancellationMessage && (
        <CardFooter className="flex justify-end pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowCancelMessage(true)}
          >
            Show Cancel Message
          </Button>
        </CardFooter>
      )}

      {booking.status === "rejected" && booking.rejectionMessage && (
  <CardFooter className="flex justify-end pt-2">
    <Button
      size="sm"
      variant="outline"
      onClick={() => setShowMessage(true)}
    >
      Show Message
    </Button>
  </CardFooter>
)}
      <Dialog open={showMessage} onOpenChange={() => setShowMessage(false)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Rejection Message</DialogTitle>
      <DialogDescription>
        This is the reason your booking was rejected:
      </DialogDescription>
    </DialogHeader>
    <p className="text-sm text-muted-foreground whitespace-pre-line">
      {booking.rejectionMessage}
    </p>
    <DialogFooter>
      <Button onClick={() => setShowMessage(false)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
<Dialog open={showCancelModal} onOpenChange={() => setShowCancelModal(false)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Cancel Booking</DialogTitle>
      <DialogDescription>
        Please let the landlord know why you're cancelling this booking.
      </DialogDescription>
    </DialogHeader>

    <textarea
      className="w-full rounded-md border border-input p-2 text-sm"
      rows={4}
      placeholder="e.g., I found another place closer to campus."
      value={cancelMessage}
      onChange={(e) => setCancelMessage(e.target.value)}
    />

    <DialogFooter className="pt-4">
      <Button variant="ghost" onClick={() => setShowCancelModal(false)}>
        Back
      </Button>
      <Button
  onClick={() => {
    console.log("🛑 Cancelling booking:", booking._id);
    console.log("📝 Message:", cancelMessage);
    onCancel(booking._id, cancelMessage);
    setShowCancelModal(false);
    setCancelMessage("");
  }}
>
  Confirm Cancel
</Button>

    </DialogFooter>
  </DialogContent>
</Dialog>
<Dialog open={showCancelMessage} onOpenChange={() => setShowCancelMessage(false)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Cancellation Message</DialogTitle>
      <DialogDescription>
        This is the reason you gave when cancelling this booking.
      </DialogDescription>
    </DialogHeader>
    <p className="text-sm text-muted-foreground whitespace-pre-line">
      {booking.cancellationMessage}
    </p>
    <DialogFooter>
      <Button onClick={() => setShowCancelMessage(false)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </Card>
  );
};

export default StudentBookingCard;
