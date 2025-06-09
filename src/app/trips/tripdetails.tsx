import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { Booking } from "@/types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import ApprovalDialog from "./approval-dialog";
import axios from "axios";
import baseUrl from "../baseurl";

interface BookingDetailsModalProps {
  selectedBooking: Booking | null;
  open: boolean;
  onClose: () => void;
  onApproved: (id: string) => void;
  onReject: (id: string) => void;
}

export default function BookingDetailsModal({
  selectedBooking,
  open,
  onClose,
  onApproved,
  onReject,

}: BookingDetailsModalProps) {
  const [approval, setApproval] = useState(false);

  const handleApprovalClose = () => {
    setApproval(false);
  };

  const handleApprovalConfirm =async (refundAmount: number) => {
    if (selectedBooking) {
        console.log(refundAmount)
      const action = selectedBooking.cancellationStatus === "PENDING" ? 'APPROVE' : 'CANCEL';
     await axios.post(`${baseUrl}/bookings/admin/${selectedBooking.bookingId}/handle-cancellation`,{
        action,
        refundAmount
      },{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
      alert('Refund successfully processed')
      setApproval(false);
    }
  };

  const handleRejectionConfirm =async () => {
    if (selectedBooking) {
      const action ='REJECT';
     await axios.post(`${baseUrl}/bookings/admin/${selectedBooking.bookingId}/handle-cancellation`,{
        action,
        refundAmount:0
      },{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
      alert('Refund successfully processed')
      setApproval(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Trip Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6 p-4">
              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p><strong>Name:</strong> {selectedBooking.customer?.firstName} {selectedBooking.customer?.lastName}</p>
                    <p><strong>Email:</strong> {selectedBooking.customer?.email}</p>
                    <p><strong>Phone:</strong> {selectedBooking.customer?.phone}</p>
                  </div>
                </div>
              </div>

              {/* Trip Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Trip Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><strong>From:</strong> {selectedBooking.departureLocation}</p>
                    <p><strong>To:</strong> {selectedBooking.destinationLocation}</p>
                    <p><strong>Flight Number:</strong> {selectedBooking.flightNumber}</p>
                    <p><strong>Distance:</strong> {selectedBooking.distance} km</p>
                    <p><strong>Estimated Time:</strong> {selectedBooking.time} minutes</p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Vehicle Type:</strong> {selectedBooking.vehicleType}</p>
                    <p><strong>Driver Language:</strong> {selectedBooking.driverLanguage}</p>
                    <p><strong>Passengers:</strong> {selectedBooking.passengers}</p>
                    <p><strong>Bags:</strong> {selectedBooking.bags}</p>
                    <p><strong>Pets:</strong> {selectedBooking.pets}</p>
                  </div>
                </div>
              </div>

              {/* Additional Services */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Additional Services</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p><strong>Wheelchair:</strong> {selectedBooking.wheelchair ? 'Yes' : 'No'}</p>
                    <p><strong>Booster Seat:</strong> {selectedBooking.boosterSeat ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="space-y-1">
                    <p><strong>Child Seat:</strong> {selectedBooking.childSeat ? 'Yes' : 'No'}</p>
                    <p><strong>Strollers:</strong> {selectedBooking.strollers}</p>
                  </div>
                  <div className="space-y-1">
                    <p><strong>Welcome Sign:</strong> {selectedBooking.welcomeSign ? 'Yes' : 'No'}</p>
                    <p><strong>Specific Language:</strong> {selectedBooking.specificLanguage ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {/* Status and Payment */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Status & Payment</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        selectedBooking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                        selectedBooking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedBooking.status}
                      </span>
                    </p>
                    <p><strong>Payment Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        selectedBooking.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedBooking.paymentStatus}
                      </span>
                    </p>
                    <p><strong>Cancellation Status:</strong> {selectedBooking.cancellationStatus || 'None'}</p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Total Price:</strong> €{selectedBooking.totalPrice}</p>
                    <p><strong>Language Fee:</strong> €{selectedBooking.languageFee}</p>
                    <p><strong>Welcome Sign Fee:</strong> €{selectedBooking.welcomeSignFee}</p>
                    <p><strong>Payment Method:</strong> {selectedBooking.paymentMethod}</p>
                    <p><strong>Refunded Amount:</strong> €{selectedBooking.refundedAmount}</p>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              {selectedBooking.specialInstructions && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-lg">Special Instructions</h4>
                  <p className="text-gray-700">{selectedBooking.specialInstructions}</p>
                </div>
              )}

              {/* Cancellation Reason */}
              {selectedBooking.cancellationReason && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-lg">Cancellation Reason</h4>
                  <p className="text-red-700">{selectedBooking.cancellationReason}</p>
                </div>
              )}

              {/* Action Buttons */}
              {selectedBooking.cancellationStatus === "PENDING" && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    onClick={() => {
                      setApproval(true);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve Cancellation
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (selectedBooking.bookingId) {
                       handleRejectionConfirm()
                      }
                    }}
                  >
                    Reject Cancellation
                  </Button>
                </div>
              )}

              {/* Cancel Trip Button - when cancellation status is not pending */}
              {(!selectedBooking.cancellationStatus?.toUpperCase() || selectedBooking.cancellationStatus.toUpperCase() !== "PENDING") && 
              selectedBooking.status.toUpperCase() !== "CANCELLED" && selectedBooking.status.toUpperCase() !== "COMPLETED" && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    onClick={() => {
                      setApproval(true);
                    }}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Cancel Trip
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ApprovalDialog 
        selectedBooking={selectedBooking} 
        open={approval} 
        onClose={handleApprovalClose}
        onConfirm={handleApprovalConfirm}
      />
    </>
  );
}