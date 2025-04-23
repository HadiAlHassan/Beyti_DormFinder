"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (message: string) => void;
}

const RejectWithMessageModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [message, setMessage] = useState("");

  const handleConfirm = () => {
    onSubmit(message);
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rejection Message</DialogTitle>
          <DialogDescription>
            Let the student know why you're rejecting this booking.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g., Sorry, the last spot was taken just now."
          rows={4}
        />

        <DialogFooter className="pt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectWithMessageModal;
