"use client";

import { useEffect, useState } from "react";
import {
  getTicketsByLandlord,
  updateTicketStatus,
  addTicketReply,
} from "@/utils/ticketAPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MaintenanceTicket } from "@/types";
import { getCookie } from "@/utils/cookieUtils";

export default function MaintenanceTickets() {
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTicket, setReplyingTicket] =
    useState<MaintenanceTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  const fetchTickets = async () => {
    try {
      const { userId, token } = getCookie();
      if (!userId || !token) {
        console.error("Missing user or token");
        return;
      }

      const data = await getTicketsByLandlord(userId, token);
      setTickets(data);
    } catch (err) {
      console.error("❌ Failed to fetch tickets:", err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      await updateTicketStatus(ticketId, newStatus);
      fetchTickets(); // ✅ Just refresh tickets
    } catch (err) {
      console.error("❌ Failed to update status:", err);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyingTicket || !replyMessage.trim()) return;

    try {
      await addTicketReply(replyingTicket._id, replyMessage);
      setReplyingTicket(null);
      setReplyMessage("");
      fetchTickets();
    } catch (err) {
      console.error("❌ Failed to send reply:", err);
    }
  };

  if (loading) {
    return <p>Loading tickets...</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Maintenance Tickets</h2>

      {tickets.length === 0 ? (
        <p className="text-gray-500">No tickets found.</p>
      ) : (
        tickets.map((ticket) => (
          <Card key={ticket._id} className="shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {ticket.title}
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
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>{ticket.description}</p>

              {ticket.student && (
                <p>
                  <strong>Student:</strong> {ticket.student.first_name}{" "}
                  {ticket.student.last_name}
                </p>
              )}
              {ticket.dorm && (
                <p>
                  <strong>Building:</strong> {ticket.dorm.name}
                </p>
              )}

              {/* Status change */}
              <div className="flex items-center gap-4 pt-4">
                <Select
                  value={ticket.status}
                  onValueChange={(value) =>
                    handleStatusChange(ticket._id, value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Change Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setReplyingTicket(ticket)}
                >
                  Reply
                </Button>
              </div>

              {/* Replies */}
              {ticket.replies && ticket.replies.length > 0 && (
                <div className="pt-4 space-y-2">
                  <h4 className="font-semibold">Replies:</h4>
                  {ticket.replies.map((r, idx) => (
                    <div key={idx} className="bg-muted p-2 rounded-md">
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                       <strong>{r.message}</strong> 
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}

      {/* Reply Modal */}
      <Dialog
        open={!!replyingTicket}
        onOpenChange={() => setReplyingTicket(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Ticket</DialogTitle>
          </DialogHeader>

          <Textarea
            placeholder="Enter your reply..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
          />

          <DialogFooter className="pt-4">
            <Button variant="ghost" onClick={() => setReplyingTicket(null)}>
              Cancel
            </Button>
            <Button onClick={handleReplySubmit}>Send Reply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
