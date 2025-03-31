"use client";

import React, { useState } from "react";
import { getCookie } from "@/utils/cookieUtils";
import { useUser } from "@/context/UserContext";

export default function ProfileForm() {
  const { profile } = useUser();
  const [showWelcome, setShowWelcome] = useState(true);
  const [formData, setFormData] = useState({
    bio: "",
    major: "",
    hobbies: [],
    interests: [],
    smoking: false,
    drinking: false,
    pets: [],
    allergies: [],
    sleep_schedule: "Flexible",
    cleanliness_level: "Open to Discussion",
    noise_tolerance: "Medium",
    guests_frequency: "Flexible",
    instagram_handle: "",
    facebook_link: "",
    twitter_handle: "",
    whatsApp_handle: "",
    isCustomized: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value.split(",").map(item => item.trim()),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { token } = getCookie();

    const res = await fetch("http://localhost:5000/api/student/customize", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      console.error("Failed to update profile");
    } else {
      console.log("Profile updated successfully");
      window.location.reload(); // Reload to show profile details
    }
  };

  if (showWelcome) {
    return (
      <section className="py-20 text-center">
        <h1 className="text-3xl font-bold text-primary mb-6">Welcome, sailor!</h1>
        <p className="mb-8">It's your first time here. Let's help you set up your profile.</p>
        <button
          onClick={() => setShowWelcome(false)}
          className="bg-primary text-white px-6 py-3 rounded-lg shadow-md hover:opacity-90 transition"
        >
          Next
        </button>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="container mx-auto px-5">
        <form onSubmit={handleSubmit} className="bg-muted p-6 shadow-lg rounded-lg space-y-4">
          <h2 className="text-xl font-bold text-primary">Customize Your Profile</h2>

          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium">Bio</label>
            <input
              type="text"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Major</label>
            <input
              type="text"
              name="major"
              value={formData.major}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {[
            { label: "Hobbies", name: "hobbies" },
            { label: "Interests", name: "interests" },
            { label: "Pets", name: "pets" },
            { label: "Allergies", name: "allergies" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block text-sm font-medium">{label} (comma-separated)</label>
              <input
                type="text"
                onChange={e => handleArrayInputChange(name, e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
          ))}

          <div className="flex items-center gap-4">
            <label><input type="checkbox" name="smoking" checked={formData.smoking} onChange={handleInputChange} /> Smoking</label>
            <label><input type="checkbox" name="drinking" checked={formData.drinking} onChange={handleInputChange} /> Drinking</label>
          </div>

          {/* Selects */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "sleep_schedule", label: "Sleep Schedule", options: ["Early Bird", "Night Owl", "Flexible"] },
              { name: "cleanliness_level", label: "Cleanliness Level", options: ["Highly Organized", "Reasonably Tidy", "Casually Clean", "Laid Back", "Open to Discussion"] },
              { name: "noise_tolerance", label: "Noise Tolerance", options: ["Low", "Medium", "High"] },
              { name: "guests_frequency", label: "Guests Frequency", options: ["Rarely", "Occasionally", "Frequently", "Flexible"] },
            ].map(({ name, label, options }) => (
              <div key={name}>
                <label className="block text-sm font-medium">{label}</label>
                <select name={name} value={(formData as any)[name]} onChange={handleInputChange} className="w-full border p-2 rounded">
                  {options.map(option => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Socials */}
          <div className="grid grid-cols-2 gap-4">
            {["instagram_handle", "facebook_link", "twitter_handle", "whatsApp_handle"].map(field => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field.replace("_", " ")}
                value={(formData as any)[field]}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
            ))}
          </div>

          <button type="submit" className="bg-primary text-white px-4 py-2 rounded mt-4">
            Save Preferences
          </button>
        </form>
      </div>
    </section>
  );
}
