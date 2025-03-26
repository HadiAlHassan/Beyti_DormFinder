"use client";

import MaintenanceTickets from "./DashBoardBody/MaintenanceTickets";
import { DashBoardHeader } from "./DashBoardHeader/DashBoardHeader";

export function LandLordDashBoard() {
  return (
    <>
      <div className="p-4  m-2 text-primary  text-2xl"> Monthly Dashboard</div>

      <div className="m-4">
        <DashBoardHeader />
      </div>

      <div className="m-4 p-5">
        <MaintenanceTickets />
      </div>
    </>
  );
}
