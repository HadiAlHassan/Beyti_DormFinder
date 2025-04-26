"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/utils/cookieUtils";
import { getTicketsByLandlord } from "@/utils/ticketAPI"; // 🆕 import correct API function
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MaintenanceTicket } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function MaintenanceTickets() {
  const { token, userId: landlordId } = getCookie();
  const [tickets, setTickets] = useState<MaintenanceTicket[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!landlordId || !token) return;

    const fetchTickets = async () => {
      try {
        const fetchedTickets = await getTicketsByLandlord(landlordId, token); // ✅ use API function
        setTickets(fetchedTickets);
      } catch (err) {
        console.error("❌ Failed to fetch tickets:", err);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [landlordId, token]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-semibold">Maintenance Tickets</h2>

      {tickets && tickets.length > 0 ? (
        tickets.map((ticket) => (
          <Card key={ticket._id} className="shadow-sm">
            <CardHeader className="space-y-2">
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

            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>Description:</strong> {ticket.description}
              </p>
              {ticket.studentId && (
                <p>
                  <strong>Student:</strong> {ticket.studentId.first_name}{" "}
                  {ticket.studentId.last_name}
                </p>
              )}
              {ticket.building && (
                <p>
                  <strong>Building:</strong> {ticket.building.name}
                </p>
              )}
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
        <p className="text-gray-500">No maintenance tickets found.</p>
      )}
    </div>
  );
}
