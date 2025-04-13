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

interface Props {
  booking: any;
  onCancel: (id: string) => void;
}

const StudentBookingCard: React.FC<Props> = ({ booking, onCancel }) => {
  const { toast } = useToast();

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
