"use client";

import React from "react";
import { useUser } from "@/context/UserContext";
import ProfileForm from "@/components/StudentDashboard/ProfileForm";
import ProfileDetails from "@/components/StudentDashboard/ProfileDetails";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProfilePage() {
  const { profile } = useUser();

  if (!profile) {
    return <div className="p-6 text-gray-500"><LoadingSpinner/>...</div>;
  }

  return profile.isCustomized ? <ProfileDetails /> : <ProfileForm />;
}