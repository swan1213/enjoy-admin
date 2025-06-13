import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Booking } from "@/types";
import { useState } from "react";

interface ApprovalProps {
  selectedBooking: Booking | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (refundAmount: number, comment: string) => void;
  onReject?: (comment: string) => void; // Optional reject handler
}

export default function ApprovalDialog({
  open,
  onClose,
  selectedBooking,
  onConfirm,
  onReject,
}: ApprovalProps) {
  const [refundedAmount, setRefundedAmount] = useState("");
  const [comment, setComment] = useState("");

  const handleCancel = () => {
    setRefundedAmount("");
    setComment("");
    onClose();
  };

  const handleConfirm = () => {
    if (refundedAmount && Number(refundedAmount) >= 0 && comment.trim()) {
      onConfirm(Number(refundedAmount), comment.trim());
      setRefundedAmount("");
      setComment("");
    }
  };

  const handleReject = () => {
    if (comment.trim() && onReject) {
      onReject(comment.trim());
      setComment("");
    }
  };

  const isPendingCancellation = selectedBooking?.cancellationStatus === "PENDING";
  const isFormValid = comment.trim() && (isPendingCancellation ? refundedAmount && Number(refundedAmount) >= 0 : true);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isPendingCancellation ? "Review Cancellation Request" : "Cancel Trip"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 p-4">
          {isPendingCancellation && (
            <>
              <p className="text-sm text-gray-600">
                Enter the refund amount and provide a reason for your decision:
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
            </>
          )}

          {!isPendingCancellation && (
            <p className="text-sm text-gray-600">
              Enter the refund amount and reason for canceling this trip:
            </p>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {isPendingCancellation ? "Decision Reason" : "Cancellation Reason"}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Textarea
              placeholder={isPendingCancellation 
                ? "Explain why you're approving or rejecting this request..." 
                : "Explain the reason for cancellation..."
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full min-h-[80px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500">
              {comment.length}/500 characters
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          
          {isPendingCancellation && onReject && (
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!comment.trim()}
            >
              Reject Request
            </Button>
          )}
          
          <Button
            onClick={isPendingCancellation ? handleConfirm : handleConfirm}
            className={isPendingCancellation
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
            }
            disabled={!isFormValid}
          >
            {isPendingCancellation ? "Approve Request" : "Confirm Cancellation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}