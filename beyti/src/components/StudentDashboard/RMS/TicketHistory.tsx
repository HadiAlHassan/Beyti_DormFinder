"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/utils/cookieUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: "open" | "in progress" | "resolved";
  dorm: { name: string };
  updatedAt: string;
}

export default function TicketHistory() {
  const { userId, token } = getCookie();
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/student/tickets/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error("❌ Failed to load tickets:", err);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, [userId, token]);

  const statusColor = (status: string) => {
    if (status === "resolved") return "bg-green-500 text-white";
    if (status === "in progress") return "bg-yellow-500 text-white";
    return "bg-red-500 text-white";
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-xl font-semibold">My Submitted Tickets</h3>
      {loading ? (
        <p className="text-sm text-muted">Loading tickets...</p>
      ) : tickets?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.map((ticket) => (
            <Card key={ticket._id}>
              <CardContent className="p-4 space-y-1">
                <div className="text-lg font-medium">{ticket.title}</div>

                <Badge className={statusColor(ticket.status)}>
                  {ticket.status.toUpperCase()}
                </Badge>
                <div className="text-xs text-right text-muted-foreground">
                  Updated: {new Date(ticket.updatedAt).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">No tickets submitted yet.</p>
      )}
    </div>
  );
}
