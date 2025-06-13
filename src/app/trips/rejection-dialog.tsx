import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Booking } from "@/types";
import axios from "axios";
import { useState } from "react";
import baseUrl from "../baseurl";
import toast from "react-hot-toast";

interface ApprovalProps {
  selectedBooking: Booking | null;
  open: boolean;
  onClose: () => void;
}

export default function RejectionDialog({
  open,
  onClose,
  selectedBooking,
}: ApprovalProps) {
  const [refundedAmount, setRefundedAmount] = useState("");
  const [comment, setComment] = useState("");

  const handleCancel = () => {
    setRefundedAmount("");
    setComment("");
    onClose();
  };

   const handleRejectionConfirm =async () => {
 
     try {
         if (selectedBooking) {
      const action ='REJECT';
     await axios.post(`${baseUrl}/bookings/admin/${selectedBooking.bookingId}/handle-cancellation`,{
        action,
        refundAmount:0,
        rejectionOrApprovalComments:comment
      },{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
 
      toast.success('succès')
    }
     } catch (error) {
        toast.error('Not completed')
     }finally{
      setComment("");
      onClose()
     }
  }; 
  

 

  const isPendingCancellation = selectedBooking?.cancellationStatus === "PENDING";
  const isFormValid = comment.trim()!='';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isPendingCancellation ? "Review Cancellation Request" : "Cancel Trip"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 p-4">
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
              placeholder={ 
                "Explain why you're  rejecting this request..." 
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
          
          <Button
            onClick={handleRejectionConfirm}
            className={
               "bg-red-600 hover:bg-red-700"
            }
            disabled={!isFormValid}
          >
            {"Reject Cancellation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}