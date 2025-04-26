"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PayRentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayWithWallet: () => void;
  onPayWithCard: () => void;
}

export default function PayRentModal({
  isOpen,
  onClose,
  onPayWithWallet,
  onPayWithCard,
}: PayRentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 space-y-4">
        <DialogHeader>
          <DialogTitle>Choose Payment Method</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4">
          <Button variant="default" onClick={onPayWithWallet}>
            Pay with Wallet
          </Button>
          <Button variant="outline" onClick={onPayWithCard}>
            Pay with Card
          </Button>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
