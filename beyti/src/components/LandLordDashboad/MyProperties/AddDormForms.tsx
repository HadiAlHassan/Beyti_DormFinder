// src/components/LandLordDashboard/MyProperties/AddDormForm.tsx

import React, { useState } from "react";

const AddDormForm = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    pricePerMonth: "",
    capacity: "",
    availableSpots: "",
    rules: {
      smoking: false,
      petsAllowed: false,
      noiseRestrictions: false,
      otherPolicies: "",
    },
    amenities: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (name in form.rules) {
      const checked =
        type === "checkbox" && "checked" in e.target
          ? (e.target as HTMLInputElement).checked
          : undefined;

      setForm({
        ...form,
        rules: {
          ...form.rules,
          [name]: type === "checkbox" ? checked : value,
        },
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      pricePerMonth: Number(form.pricePerMonth),
      capacity: Number(form.capacity),
      availableSpots: Number(form.availableSpots),
      amenities: form.amenities.split(",").map((a) => a.trim()),
    };

    try {
      const res = await fetch("/api/dorms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create dorm");

      alert("Dorm created!");
    } catch (err) {
      alert("Error creating dorm");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border p-4 rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold">Add New Dorm</h2>

      <input
        type="text"
        name="name"
        placeholder="Dorm name"
        className="input"
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        className="textarea"
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="pricePerMonth"
        placeholder="Price per month"
        className="input"
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="capacity"
        placeholder="Capacity"
        className="input"
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="availableSpots"
        placeholder="Available spots"
        className="input"
        onChange={handleChange}
        required
      />

      <label className="block">
        <input type="checkbox" name="smoking" onChange={handleChange} />
        Smoking allowed
      </label>
      <label className="block">
        <input type="checkbox" name="petsAllowed" onChange={handleChange} />
        Pets allowed
      </label>
      <label className="block">
        <input
          type="checkbox"
          name="noiseRestrictions"
          onChange={handleChange}
        />
        Noise restrictions
      </label>
      <textarea
        name="otherPolicies"
        placeholder="Other policies"
        className="textarea"
        onChange={handleChange}
      />

      <input
        type="text"
        name="amenities"
        placeholder="Amenities (comma separated)"
        className="input"
        onChange={handleChange}
      />

      <button type="submit" className="btn">
        Add Dorm
      </button>
    </form>
  );
};

export default AddDormForm;
