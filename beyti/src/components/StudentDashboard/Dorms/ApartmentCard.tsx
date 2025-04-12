"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useToast } from "@/components/ui/use-toast";
import { getCookie } from "@/utils/cookieUtils";
interface Apartment {
  _id: string;
  name: string;
  pricePerMonth: number;
  capacity: number;
  availableSpots: number;
  isBooked: boolean;
  amenities: string[];
  pictures?: {
    data: { type: "Buffer"; data: number[] };
    contentType: string;
  }[];
}

interface Props {
  apartment: Apartment;
  onView: () => void;
  onEdit: () => void;
}

const ApartmentCard: React.FC<Props> = ({ apartment, onView, onEdit }) => {
  const { toast } = useToast();

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
      onView(); // proceed to open booking dialog
    }
  } catch (error) {
    console.error("Error checking booking:", error);
    toast(
      "Error",{
      description: "Could not check booking status.",
    });
  }
};



  const images =
    apartment.pictures?.map((pic) => ({
      src: `data:${pic.contentType};base64,${Buffer.from(
        pic.data.data
      ).toString("base64")}`,
    })) ?? [];

  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!hovering || images.length < 2) return;

    const interval = setInterval(() => {
    }, 2000);

    return () => clearInterval(interval);
  }, [hovering, images.length]);

  const handleMouseEnter = () => setHovering(true);
  const handleMouseLeave = () => {
    setHovering(false);
  };

  return (
    <Card
      className="w-full overflow-hidden shadow"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel Wrapper */}
      <Carousel className="relative w-full h-60 bg-muted">
        <CarouselContent>
          {images.length > 0 ? (
            images.map((img, idx) => (
              <CarouselItem key={idx}>
                <div className="relative w-full h-60">
                  <Image
                    src={img.src}
                    alt={`Image ${idx}`}
                    fill
                    className="object-cover"
                    priority={idx === 0}
                  />
                </div>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem>
              <div className="flex items-center justify-center h-60 text-muted-foreground">
                No Image
              </div>
            </CarouselItem>
          )}
        </CarouselContent>

        {images.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
          </>
        )}
      </Carousel>

      {/* Info */}
      <CardHeader>
        <CardTitle>{apartment.name}</CardTitle>
        <p className="text-sm text-muted-foreground">
          💰 ${apartment.pricePerMonth}/month
        </p>
        <p className="text-sm text-muted-foreground">
          👥 {apartment.availableSpots} of {apartment.capacity} spots available
        </p>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {apartment.amenities.map((am, idx) => (
            <Badge key={idx} variant="secondary">
              {am}
            </Badge>
          ))}
        </div>
        <Badge
          className={
            apartment.isBooked
              ? "text-red-500 border-red-500"
              : "text-green-600 border-green-600"
          }
          variant="outline"
        >
          {apartment.isBooked ? "Booked" : "Available"}
        </Badge>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Button size="sm" onClick={handleBookClick}>
          Book
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApartmentCard;
