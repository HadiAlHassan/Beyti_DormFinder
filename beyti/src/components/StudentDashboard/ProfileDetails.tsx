"use client";

import React from "react";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { FaInstagram, FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";

export default function ProfileDetails() {
  const { profile } = useUser();

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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  if (!profile) {
    return <div className="p-6 text-gray-500">Loading profile...</div>;
  }

  return (
    <section className="py-10">
      <div className="container mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar Profile */}
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
                <p><strong>Expected End on:</strong> {formatDate(profile.uni_end_data)}</p>
              )}
            </div>
            {profile.bio && (
              <div className="bg-muted px-4 py-2 rounded-md mt-3 italic text-sm text-center">
                “{profile.bio}”
              </div>
            )}

            <ul className="mt-6 space-y-3 text-sm text-left">
              {profile.instagram_handle && (
                <li className="flex items-center gap-x-3 border p-2 rounded transition hover:bg-muted/70">
                  <FaInstagram className="text-pink-600 text-xl" />
                  <span className="text-foreground">@{profile.instagram_handle}</span>
                </li>
              )}
              {profile.facebook_link && (
                <li className="flex items-center gap-x-3 border p-2 rounded transition hover:bg-muted/70">
                  <FaFacebook className="text-blue-800 text-xl" />
                  <span className="text-foreground">{profile.facebook_link}</span>
                </li>
              )}
              {profile.twitter_handle && (
                <li className="flex items-center gap-x-3 border p-2 rounded transition hover:bg-muted/70">
                  <FaTwitter className="text-blue-400 text-xl" />
                  <span className="text-foreground">@{profile.twitter_handle}</span>
                </li>
              )}
              {profile.whatsApp_handle && (
                <li className="flex items-center gap-x-3 border p-2 rounded transition hover:bg-muted/70">
                  <FaWhatsapp className="text-green-500 text-xl" />
                  <span className="text-foreground">{profile.whatsApp_handle}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Main Info + Progress */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-muted p-6 rounded-2xl shadow-xl">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Student Information</h3>
              <div className="space-y-4 text-foreground">
                {[
                  {
                    label: "Full Name",
                    value: `${profile.first_name} ${profile.middle_name} ${profile.last_name}`,
                  },
                  { label: "Lau Email", value: `${profile.lau_email}` },
                  { label: "Lau Id", value: `${profile.lau_id}` },
                  { label: "Phone", value: `${profile.phone_number}` },
                  ...(profile.emergency_contact
                    ? [
                        {
                          label: "Emergency Contact",
                          value: profile.emergency_contact,
                        },
                      ]
                    : []),
                  { label: "Nationality", value: `${profile.nationality}` },
                  { label: "Address", value: `${profile.home_address}` },
                  { label: "Age", value: `${calculateAge(profile.dob)} years` },
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

            {/* Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 🧑‍🎨 Hobbies & Interests */}
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

              {/* 💬 Lifestyle & Pets */}
              <div className="bg-muted shadow-md rounded-lg p-4">
                <div className="mb-2"><strong>Smoking:</strong> {profile.smoking ? "Yes" : "No"}</div>
                <div className="mb-2"><strong>Drinking:</strong> {profile.drinking ? "Yes" : "No"}</div>
                {Array.isArray(profile.pets) && profile.pets.length > 0 && (
                  <div>
                    <strong>Pets:</strong>{" "}
                    {profile.pets.map((item, i) => (
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

              {/* ⚠️ Allergies & Sleep */}
              <div className="bg-muted shadow-md rounded-lg p-4">
                {Array.isArray(profile.allergies) && profile.allergies.length > 0 && (
                  <div className="mb-2">
                    <strong>Allergies:</strong>{" "}
                    {profile.allergies.map((item, i) => (
                      <span
                        key={i}
                        className="inline-block bg-primary text-white px-2 py-1 text-xs rounded mr-2 mt-1"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mb-2">
                  <strong>Sleep Schedule:</strong> {profile.sleep_schedule}
                </div>
                <div>
                  <strong>Cleanliness Level:</strong> {profile.cleanliness_level}
                </div>
              </div>

              {/* 🔈 Noise & Guests */}
              <div className="bg-muted shadow-md rounded-lg p-4">
                <div className="mb-2">
                  <strong>Noise Tolerance:</strong> {profile.noise_tolerance}
                </div>
                <div>
                  <strong>Guests Frequency:</strong> {profile.guests_frequency}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}