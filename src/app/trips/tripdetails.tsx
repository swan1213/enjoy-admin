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
      alert('Remboursement traité avec succès')
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
      alert('Remboursement traité avec succès')
      setApproval(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du voyage</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6 p-4">
              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Informations client</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p><strong>Nom :</strong> {selectedBooking.customer?.firstName} {selectedBooking.customer?.lastName}</p>
                    <p><strong>Email :</strong> {selectedBooking.customer?.email}</p>
                    <p><strong>Téléphone :</strong> {selectedBooking.customer?.phone}</p>
                  </div>
                </div>
              </div>

              {/* Trip Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Informations du voyage</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><strong>De :</strong> {selectedBooking.departureLocation}</p>
                    <p><strong>À :</strong> {selectedBooking.destinationLocation}</p>
                    <p><strong>Numéro de vol :</strong> {selectedBooking.flightNumber}</p>
                    <p><strong>Distance :</strong> {selectedBooking.distance} km</p>
                    <p><strong>Temps estimé :</strong> {selectedBooking.time} minutes</p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Type de véhicule :</strong> {selectedBooking.vehicleType}</p>
                    <p><strong>Langue du chauffeur :</strong> {selectedBooking.driverLanguage}</p>
                    <p><strong>Passagers :</strong> {selectedBooking.passengers}</p>
                    <p><strong>Bagages :</strong> {selectedBooking.bags}</p>
                    <p><strong>Animaux :</strong> {selectedBooking.pets}</p>
                  </div>
                </div>
              </div>

              {/* Additional Services */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Services supplémentaires</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p><strong>Fauteuil roulant :</strong> {selectedBooking.wheelchair ? 'Oui' : 'Non'}</p>
                    <p><strong>Siège rehausseur :</strong> {selectedBooking.boosterSeat ? 'Oui' : 'Non'}</p>
                  </div>
                  <div className="space-y-1">
                    <p><strong>Siège enfant :</strong> {selectedBooking.childSeat ? 'Oui' : 'Non'}</p>
                    <p><strong>Poussettes :</strong> {selectedBooking.strollers}</p>
                  </div>
                  <div className="space-y-1">
                    <p><strong>Panneau de bienvenue :</strong> {selectedBooking.welcomeSign ? 'Oui' : 'Non'}</p>
                    <p><strong>Langue spécifique :</strong> {selectedBooking.specificLanguage ? 'Oui' : 'Non'}</p>
                  </div>
                </div>
              </div>

              {/* Status and Payment */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Statut et paiement</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><strong>Statut :</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        selectedBooking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                        selectedBooking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedBooking.status === 'COMPLETED' ? 'TERMINÉ' : 
                         selectedBooking.status === 'PENDING' ? 'EN ATTENTE' : 
                         selectedBooking.status === 'CANCELLED' ? 'ANNULÉ' : selectedBooking.status}
                      </span>
                    </p>
                    <p><strong>Statut du paiement :</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        selectedBooking.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedBooking.paymentStatus === 'PAID' ? 'PAYÉ' : 'NON PAYÉ'}
                      </span>
                    </p>
                    <p><strong>Statut d'annulation :</strong> {selectedBooking.cancellationStatus === 'PENDING' ? 'EN ATTENTE' : selectedBooking.cancellationStatus || 'Aucun'}</p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Prix total :</strong> €{selectedBooking.totalPrice}</p>
                    <p><strong>Frais de langue :</strong> €{selectedBooking.languageFee}</p>
                    <p><strong>Frais panneau de bienvenue :</strong> €{selectedBooking.welcomeSignFee}</p>
                    <p><strong>Méthode de paiement :</strong> {selectedBooking.paymentMethod}</p>
                    <p><strong>Montant remboursé :</strong> €{selectedBooking.refundedAmount}</p>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              {selectedBooking.specialInstructions && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-lg">Instructions spéciales</h4>
                  <p className="text-gray-700">{selectedBooking.specialInstructions}</p>
                </div>
              )}

              {/* Cancellation Reason */}
              {selectedBooking.cancellationReason && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-lg">Raison de l'annulation</h4>
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
                    Approuver l'annulation
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (selectedBooking.bookingId) {
                       handleRejectionConfirm()
                      }
                    }}
                  >
                    Rejeter l'annulation
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
                    Annuler le voyage
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