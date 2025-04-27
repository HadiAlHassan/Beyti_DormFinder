"use client";

import React from "react";
import Image from "next/image";
import { FaInstagram, FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { UserProfile } from "@/utils/FetchUserAPI";

interface Props {
  profile: UserProfile;
  onBack: () => void; // for "Back to search" button if needed
}

export default function StudentProfileViewer({ profile, onBack }: Props) {
  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section className="py-10">
      <div className="container mx-auto px-5">
        <button
          onClick={onBack}
          className="text-sm mb-4 underline text-primary font-semibold"
        >
          ← Back to results
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="bg-muted shadow-xl rounded-2xl p-6 text-center">
            <div className="flex justify-center">
              <Image
                src={
                  profile.picture
                    ? `data:${profile.picture.contentType};base64,${profile.picture.data}`
                    : "/images/default-avatar.png"
                }
                alt="Profile picture"
                width={150}
                height={150}
                className="rounded-full ring-4 ring-primary"
              />
            </div>
            <p className="text-primary font-bold text-xl mt-4">
              {profile.major}
            </p>
            <div className="text-sm text-foreground mt-2">
              {profile.uni_start_data && (
                <p><strong>Started on:</strong> {formatDate(profile.uni_start_data)}</p>
              )}
              {profile.uni_end_data && (
                <p><strong>Expected End:</strong> {formatDate(profile.uni_end_data)}</p>
              )}
            </div>
            {profile.bio && (
              <div className="bg-muted px-4 py-2 rounded-md mt-3 italic text-sm text-center">
                “{profile.bio}”
              </div>
            )}

            <ul className="mt-6 space-y-3 text-sm text-left">
              {profile.instagram_handle && (
                <li className="flex items-center gap-x-3 border p-2 rounded">
                  <FaInstagram className="text-pink-600 text-xl" />
                  <span>@{profile.instagram_handle}</span>
                </li>
              )}
              {profile.facebook_link && (
                <li className="flex items-center gap-x-3 border p-2 rounded">
                  <FaFacebook className="text-blue-800 text-xl" />
                  <span>{profile.facebook_link}</span>
                </li>
              )}
              {profile.twitter_handle && (
                <li className="flex items-center gap-x-3 border p-2 rounded">
                  <FaTwitter className="text-blue-400 text-xl" />
                  <span>@{profile.twitter_handle}</span>
                </li>
              )}
              {profile.whatsApp_handle && (
                <li className="flex items-center gap-x-3 border p-2 rounded">
                  <FaWhatsapp className="text-green-500 text-xl" />
                  <span>{profile.whatsApp_handle}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Main Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-muted p-6 rounded-2xl shadow-xl">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Student Overview
              </h3>
              <div className="space-y-4 text-foreground">
                {[{
                  label: "Full Name",
                  value: `${profile.first_name} ${profile.middle_name ?? ""} ${profile.last_name}`
                }, {
                  label: "Phone Number",
                  value: profile.phone_number
                }, {
                  label: "Nationality",
                  value: profile.nationality
                }, {
                  label: "Age",
                  value: `${calculateAge(profile.dob)} years`
                }].map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-primary font-bold w-1/3">{item.label}</span>
                    <span className="w-2/3">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid of Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted shadow-md rounded-lg p-4">
    {Array.isArray(profile.hobbies) && profile.hobbies.length > 0 && (
      <div className="mb-2">
        <strong>Hobbies:</strong>{" "}
        {profile.hobbies.map((item, i) => (
          <span
            key={i}
            className="inline-block bg-primary text-white px-2 py-1 text-xs rounded mr-2 mt-1"
          >
            {item}
          </span>
        ))}
      </div>
    )}
    {Array.isArray(profile.interests) && profile.interests.length > 0 && (
      <div>
        <strong>Interests:</strong>{" "}
        {profile.interests.map((item, i) => (
          <span
            key={i}
            className="inline-block bg-primary text-white px-2 py-1 text-xs rounded mr-2 mt-1"
          >
            {item}
          </span>
        ))}
      </div>
    )}
  </div>
              <div className="bg-muted rounded-lg p-4">
                <p><strong>Smoking:</strong> {profile.smoking ? "Yes" : "No"}</p>
                <p><strong>Drinking:</strong> {profile.drinking ? "Yes" : "No"}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p><strong>Sleep Schedule:</strong> {profile.sleep_schedule}</p>
                <p><strong>Cleanliness Level:</strong> {profile.cleanliness_level}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p><strong>Noise Tolerance:</strong> {profile.noise_tolerance}</p>
                <p><strong>Guests Frequency:</strong> {profile.guests_frequency}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
