"use client";

import MyProperties from "@/components/LandLordDashboad/MyProperties/MyProperties";
import { BuildingsProvider } from "@/context/BuildingsContext";

export default function Page() {

  return (
    <>
      <br />
      <BuildingsProvider>
        <MyProperties />
      </BuildingsProvider>
    </>
  );
}
