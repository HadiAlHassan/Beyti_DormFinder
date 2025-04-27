"use client";

import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center space-y-3">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-opacity-70"></div>
        <p className="text-sm text-gray-500">Loading, please wait...</p>
      </div>
    </div>
  );
}
