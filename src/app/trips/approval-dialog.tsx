import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Booking } from "@/types";
import { useState } from "react";

interface ApprovalProps {
  selectedBooking: Booking | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (refundAmount: number) => void;
}

export default function ApprovalDialog({
  open,
  onClose,
  selectedBooking,
  onConfirm,
}: ApprovalProps) {
  const [refundedAmount, setRefundedAmount] = useState("");

  const handleCancel = () => {
    setRefundedAmount("");
    onClose();
  };

  const handleConfirm = () => {
    if (refundedAmount && Number(refundedAmount) >= 0) {
      onConfirm(Number(refundedAmount));
      setRefundedAmount("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedBooking?.cancellationStatus === "PENDING" ? "Approve Cancellation" : "Cancel Trip"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-4">
          <p>
            {selectedBooking?.cancellationStatus === "PENDING"
              ? "Enter the refund amount for this cancellation:"
              : "Enter the refund amount for canceling this trip:"
            }
          </p>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Refund Amount (€)
            </label>
            <Input
              type="number"
              placeholder="0.00"
              value={refundedAmount}
              onChange={(e) => setRefundedAmount(e.target.value)}
              min="0"
              step="0.01"
              className="w-full"
            />
            {selectedBooking && (
              <p className="text-sm text-gray-500">
                Original amount: €{selectedBooking.totalPrice}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className={selectedBooking?.cancellationStatus === "PENDING"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
            }
            disabled={!refundedAmount || Number(refundedAmount) < 0}
          >
            {selectedBooking?.cancellationStatus === "PENDING" ? "Confirm Approval" : "Confirm Cancellation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}