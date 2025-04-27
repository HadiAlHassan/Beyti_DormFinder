"use client";

import MaintenanceTickets from "./DashBoardBody/MaintenanceTickets";
// import { DashBoardHeader } from "./DashBoardHeader/DashBoardHeader";
import LandlordPayments from "./DashBoardBody/LandlordPayments";
import { BuildingsProvider } from "@/context/BuildingsContext"; // ✅ Add this

export function LandLordDashBoard() {
  return (
    <BuildingsProvider>
      <div className="p-4 m-2 text-primary text-2xl">Monthly Dashboard</div>

      <div className="m-4 p-5">
        <LandlordPayments />
      </div>

      
      <div className="m-4 p-5">
        <MaintenanceTickets />
      </div>


    </BuildingsProvider>
  );
}
