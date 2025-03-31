"use client";

import { useUser } from "@/context/UserContext";

export default function StudentProfilePage() {
  const { profile } = useUser();

  if (!profile) {
    return <div className="p-6 text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div><strong>Name:</strong> {profile.first_name} {profile.middle_name} {profile.last_name}</div>
        <div><strong>LAU ID:</strong> {profile.lau_id}</div>
        <div><strong>Email:</strong> {profile.lau_email}</div>
        <div><strong>Nationality:</strong> {profile.nationality}</div>
        <div><strong>Gender:</strong> {profile.gender}</div>
        <div><strong>Date of Birth:</strong> {new Date(profile.dob).toLocaleDateString()}</div>
        <div><strong>Phone:</strong> {profile.phone_number}</div>
        {profile.emergency_contact && (
          <div><strong>Emergency Contact:</strong> {profile.emergency_contact}</div>
        )}
        <div><strong>University Start:</strong> {new Date(profile.uni_start_data).toLocaleDateString()}</div>
        <div><strong>University End:</strong> {new Date(profile.uni_end_data).toLocaleDateString()}</div>
        {profile.major && <div><strong>Major:</strong> {profile.major}</div>}
        {profile.bio && <div><strong>Bio:</strong> {profile.bio}</div>}
        {profile.hobbies && <div><strong>Hobbies:</strong> {profile.hobbies.join(", ")}</div>}
        {profile.interests && <div><strong>Interests:</strong> {profile.interests.join(", ")}</div>}
        <div><strong>Smoking:</strong> {profile.smoking ? "Yes" : "No"}</div>
        <div><strong>Drinking:</strong> {profile.drinking ? "Yes" : "No"}</div>
        {profile.pets && profile.pets.length > 0 && (
          <div><strong>Pets:</strong> {profile.pets.join(", ")}</div>
        )}
        {profile.allergies && profile.allergies.length > 0 && (
          <div><strong>Allergies:</strong> {profile.allergies.join(", ")}</div>
        )}
        <div><strong>Sleep Schedule:</strong> {profile.sleep_schedule}</div>
        <div><strong>Cleanliness Level:</strong> {profile.cleanliness_level}</div>
        <div><strong>Noise Tolerance:</strong> {profile.noise_tolerance}</div>
        <div><strong>Guests Frequency:</strong> {profile.guests_frequency}</div>
        {profile.instagram_handle && (
          <div><strong>Instagram:</strong> @{profile.instagram_handle}</div>
        )}
        {profile.facebook_link && (
          <div><strong>Facebook:</strong> {profile.facebook_link}</div>
        )}
        {profile.twitter_handle && (
          <div><strong>Twitter:</strong> @{profile.twitter_handle}</div>
        )}
        {profile.whatsApp_handle && (
          <div><strong>WhatsApp:</strong> {profile.whatsApp_handle}</div>
        )}
      </div>
    </div>
  );
}
