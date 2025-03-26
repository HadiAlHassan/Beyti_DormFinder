"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

type Ticket = {
  _id: string;
  title: string;
  status: "open" | "in progress" | "resolved";
  updatedAt: string;
  dorm: {
    name: string;
  };
};

type TicketCounts = {
  open: number;
  inProgress: number;
  resolved: number;
};

export default function MaintenanceTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [counts, setCounts] = useState<TicketCounts>({
    open: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch("/api/landlord/tickets");
        const data = await res.json();
        setTickets(data.tickets);
        setCounts(data.counts);
      } catch (err) {
        console.error("Failed to fetch tickets", err);
      }
    }

    fetchTickets();
  }, []);


  return (
    <div className="space-y-6">
      {/* 🔹 Ticket Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Open</CardTitle>
            <CardDescription>{counts.open} tickets</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>In Progress</CardTitle>
            <CardDescription>{counts.inProgress} tickets</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resolved</CardTitle>
            <CardDescription>{counts.resolved} tickets</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* 🔹 Recent Tickets Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="px-4 py-2">Issue</th>
              <th className="px-4 py-2">Dorm</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="border-t">
                <td className="px-4 py-2">{ticket.title}</td>
                <td className="px-4 py-2">{ticket.dorm?.name}</td>
                <td className="px-4 py-2 capitalize">{ticket.status}</td>
                <td className="px-4 py-2">
                  {new Date(ticket.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
