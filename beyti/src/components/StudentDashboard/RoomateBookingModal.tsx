"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BedDouble, Building2, Mail, Phone, User } from "lucide-react";
import { Key, useState } from "react";
import { toast } from "sonner";
import { getCookie } from "@/utils/cookieUtils";
import { BookingDialog } from "./Dorms/BookingModal";
import build from "next/dist/build";

interface Props {
  open: boolean;
  onClose: () => void;
  booking: any;
}

const RoommateBookingModal: React.FC<Props> = ({ open, onClose, booking }) => {
    const [showBookingDialog, setShowBookingDialog] = useState(false);

    
const handleBookClick = async () => {
    const { userId, token } = getCookie();
    if (!userId || !token) {
      toast(
        "Unauthorized",{
        description: "You must be logged in to book.",
      });
      return;
    }
  
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/has-active/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
  
      if (data.hasActive) {
        toast(
          "Booking Blocked",{
          description: "You already have a pending or approved booking.",
        });
      } else {
          setShowBookingDialog(true);
      }
    } catch (error) {
      console.error("Error checking booking:", error);
      toast(
        "Error",{
        description: "Could not check booking status.",
      });
    }
  };

  
    const {userId} = getCookie();
if (!userId) {
    console.warn("User is not logged in.");
    return null; // or fallback UI
  }
  if (!booking) return null;

  const { apartment, building, dormOwner } = booking;

  const apartmentImages = apartment?.pictures?.map((pic: any, i: number) => ({
    src: `data:${pic.contentType};base64,${Buffer.from(
      pic.data.data
    ).toString("base64")}`,
    alt: `Apartment Image ${i + 1}`,
  }));

  return (
<Dialog open={open} onOpenChange={onClose}>
  <DialogContent className="max-w-3xl p-6 space-y-6 rounded-xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="text-xl">
        🏠 Apartment {apartment.name} – {building.name}
      </DialogTitle>
    </DialogHeader>

    {/* ✅ Fixed Carousel Box */}
    {apartmentImages?.length > 0 && (
  <div className="relative w-full max-w-[600px] mx-auto">
    <Carousel>
      <CarouselContent>
        {apartmentImages.map((img: { src: string | undefined; alt: string | undefined; }, idx: Key | null | undefined) => (
          <CarouselItem key={idx} className="flex justify-center">
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-auto rounded-lg object-contain"
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Arrows properly centered relative to image height */}
      <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white z-10" />
      <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white z-10" />
    </Carousel>
  </div>
)}
        {/* Apartment + Building Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 text-sm">
          <div className="space-y-1">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <BedDouble className="w-4 h-4" />
              Apartment Info
            </h3>
            <p><strong>Name:</strong> {apartment.name}</p>
            <p><strong>Price:</strong> ${apartment.pricePerMonth}</p>
            <p><strong>Capacity:</strong> {apartment.capacity}</p>
            <p><strong>Available Spots:</strong> {apartment.availableSpots}</p>
            <p><strong>Status:</strong> {booking.status}</p>
            <p><strong>Amenities:</strong></p>
            <div className="flex flex-wrap gap-2 mt-1">
              {apartment.amenities.map((a: string, i: number) => (
                <Badge key={i} className="text-xs px-2 py-1">{a}</Badge>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Building Info
            </h3>
            <p><strong>Name:</strong> {building.name}</p>
            <p><strong>Address:</strong> {building.address}</p>
            <p><strong>Description:</strong> {building.description}</p>
            <p><strong>Policies:</strong></p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              <li>Smoking: {building.rules.smoking ? "Allowed" : "Not allowed"}</li>
              <li>Pets: {building.rules.petsAllowed ? "Allowed" : "Not allowed"}</li>
              <li>Noise Restrictions: {building.rules.noiseRestrictions ? "Yes" : "No"}</li>
              {building.rules.otherPolicies && (
                <li>Other: {building.rules.otherPolicies}</li>
              )}
            </ul>
          </div>

          <BookingDialog
  open={showBookingDialog}
  onClose={() => setShowBookingDialog(false)}
  apartment={{
    _id: apartment._id,
    pricePerMonth: apartment.pricePerMonth,
    dormOwnerId: dormOwner._id,
    buildingId: building._id,
  }}
  studentId={userId}
/>


        </div>

        {/* Dorm Owner */}
        <div className="pt-4 border-t">
          <h3 className="text-base font-semibold flex items-center gap-2 mb-2">
            <User className="w-4 h-4" />
            Dorm Owner
          </h3>
          <p>{dormOwner.first_name} {dormOwner.last_name} ({dormOwner.gender})</p>
          <p className="flex items-center gap-1 text-sm">
            <Mail className="w-4 h-4" /> {dormOwner.email}
          </p>
          <p className="flex items-center gap-1 text-sm">
            <Phone className="w-4 h-4" /> {dormOwner.phone_number}
          </p>
        </div>
    {/* ✅ Buttons at the end */}
    <div className="flex justify-end gap-3 pt-4">
      <Button variant="outline" onClick={onClose}>Close</Button>
      <Button onClick={handleBookClick}>
        Book This Apartment
      </Button>
    </div>
  </DialogContent>
</Dialog>

  );
};

export default RoommateBookingModal;
