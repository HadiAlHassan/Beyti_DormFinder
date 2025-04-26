"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/utils/cookieUtils";
import { useBuildings } from "@/context/BuildingsContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MaintenanceTicket } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function MaintenanceTickets() {
  const { buildings } = useBuildings();
  const { token } = getCookie();
  const [tickets, setTickets] = useState<MaintenanceTicket[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!buildings?.length) return;

    const buildingIds = buildings.map((b) => b._id);

    const fetchTickets = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/tickets/by-buildings",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ buildingIds }),
          }
        );

        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error("❌ Failed to fetch tickets:", err);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [buildings, token]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Maintenance Tickets</h2>

      {loading ? (
        <LoadingSpinner />
      ) : tickets && tickets.length > 0 ? (
        tickets.map((ticket) => (
          <Card key={ticket._id} className="shadow-sm">
            <CardHeader>
              <h3 className="text-lg font-medium">{ticket.title}</h3>
              <Badge
                className={
                  ticket.status === "open"
                    ? "bg-yellow-500"
                    : ticket.status === "in progress"
                    ? "bg-blue-500"
                    : "bg-green-600"
                }
              >
                {ticket.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <p>{ticket.description}</p>
              {ticket.picture && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`data:${ticket.picture.contentType};base64,${ticket.picture.data}`}
                  alt="Ticket"
                  className="mt-3 rounded max-w-xs"
                />
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-gray-500">No tickets found for your properties.</p>
      )}
    </div>
  );
}
