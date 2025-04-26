"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  message,
}: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 space-y-4 flex flex-col items-center">
        <CheckCircle2 size={48} className="text-green-500" />
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl">{message}</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
