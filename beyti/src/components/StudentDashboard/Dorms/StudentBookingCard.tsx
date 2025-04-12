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
import Image from "next/image";
import { cancelStudentBooking } from "@/utils/bookingAPIStudentView";

interface Props {
  booking: any; // You can replace 'any' with a Booking type if available
  onCancel: (id: string) => void;
}

const StudentBookingCard: React.FC<Props> = ({ booking, onCancel }) => {
  const { toast } = useToast();

  const apartment = booking.apartmentId;
  const images =
    apartment?.pictures?.map((pic: any) => ({
      src: `data:${pic.contentType};base64,${Buffer.from(
        pic.data.data
      ).toString("base64")}`,
    })) ?? [];

  return (
    <Card className="w-full overflow-hidden shadow">
      <CardHeader>
        <CardTitle>{apartment?.name}</CardTitle>
        <p className="text-sm text-muted-foreground">
          💰 ${apartment?.pricePerMonth}/month
        </p>
        <p className="text-sm text-muted-foreground">
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
        </p>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {apartment?.amenities?.map((am: string, idx: number) => (
            <Badge key={idx} variant="secondary">
              {am}
            </Badge>
          ))}
        </div>
      </CardContent>

      {booking.status === "pending" && (
        <CardFooter className="flex justify-end">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onCancel(booking._id)}
          >
            Cancel
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default StudentBookingCard;
