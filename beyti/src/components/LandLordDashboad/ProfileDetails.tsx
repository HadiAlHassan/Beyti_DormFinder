"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaInstagram, FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { getCookie } from "@/utils/cookieUtils";
import LoadingSpinner from "../LoadingSpinner";

type Landlord = {
  _id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  nationality: string;
  home_address: string;
  dob: string;
  gender: string;
  phone_number: number;
  email: string;
  picture?: {
    data: string;
    contentType: string;
  };
};

export default function ProfileDetails() {
  const [landlord, setLandlord] = useState<Landlord | null>(null);

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  };

  useEffect(() => {
    const { userId, role } = getCookie();
    if (!userId || role !== "landlord") {
      console.warn("Missing or invalid role/userId in cookie.");
      return;
    }

    const fetchLandlord = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/landlord/${userId}`);
        const data = await res.json();
        setLandlord(data);
      } catch (err) {
        console.error("Failed to fetch landlord", err);
      }
    };

    fetchLandlord();
  }, []);

  if (!landlord) {
    return (
      <div className="p-6 text-center text-muted">
        <LoadingSpinner />
      </div>
    );
  } else {
    const imageSrc =
      landlord.picture?.data && landlord.picture?.contentType
        ? `data:${landlord.picture.contentType};base64,${landlord.picture.data}`
        : "/images/default-avatar.png";

    console.log("Image src:", imageSrc);

    return (
      <section className="py-10">
        <div className="container mx-auto ">
          <div className="">
            {/* Sidebar Profile */}
            <div className="mb-10">
            <p className="text-primary font-bold pb-10 pt-8 text-2xl text-center">
    Welcome {landlord.gender === "male" ? "Mr." : "Ms."} {landlord.first_name}
  </p>
              <div className="flex justify-center">
                <Image
                  src={
                    landlord.picture?.data
                      ? `data:${landlord.picture.contentType};base64,${landlord.picture.data}`
                      : "/images/default-avatar.png"
                  }
                  alt="Profile picture"
                  width={150}
                  height={150}
                  className="rounded-full ring-4 ring-primary"
                />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6 flex justify-center">
              <div className="bg-muted p-6 rounded-2xl shadow-xl w-2/3">
                <h3 className="text-lg font-semibold mb-4 text-foreground">
                  LandLord Information
                </h3>
                <div className="space-y-4 text-foreground">
                  {[
                    {
                      label: "Full Name",
                      value: `${landlord.first_name} ${landlord.middle_name} ${landlord.last_name}`,
                    },
                    { label: "Email", value: `${landlord.email}` },
                    { label: "Phone", value: `${landlord.phone_number}` },
                    { label: "Nationality", value: `${landlord.nationality}` },
                    { label: "Address", value: `${landlord.home_address}` },
                    {
                      label: "Age",
                      value: `${calculateAge(landlord.dob)} years`,
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-primary font-bold w-1/3">
                        {item.label}
                      </span>
                      <span className="w-2/3">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
