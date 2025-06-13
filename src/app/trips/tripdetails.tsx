import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Booking } from "@/types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import ApprovalDialog from "./approval-dialog";
import axios from "axios";
import baseUrl from "../baseurl";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import RejectionDialog from "./rejection-dialog";
import toast from "react-hot-toast";

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
}: BookingDetailsModalProps) {
  const [approval, setApproval] = useState(false);
    const [rejected, setRejected] = useState(false);
  const [emailModal, setEmailModal] = useState<{ open: boolean; booking: Booking | null }>({
    open: false,
    booking: null
  });
  const [emailData, setEmailData] = useState({ subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);

const handleOpenEmailModal = (booking: Booking) => {
    setEmailModal({ open: true, booking });
    // Pre-fill subject with booking info
    setEmailData({
      subject: `Trip Update - ${booking.departureLocation} to ${booking.destinationLocation}`,
      message: `Dear ${booking.customer?.firstName} ${booking.customer?.lastName},\n\nWe hope this message finds you well. We wanted to reach out regarding your upcoming trip scheduled for ${new Date(booking.tripDateTime).toLocaleDateString()}.\n\nBest regards,\nYour Travel Team`
    });
  };

  const handleCloseEmailModal = () => {
    setEmailModal({ open: false, booking: null });
    setEmailData({ subject: '', message: '' });
    setIsSending(false);
  };
  const handleApprovalClose = () => {
    setApproval(false);
  };

   const handleRejectionClose = () => {
    setRejected(false);
  };

  const handleApprovalConfirm =async (refundAmount: number, comment:string) => {
      try {
           if (selectedBooking) {
        console.log(comment)
      const action = 'APPROVE';
     await axios.post(`${baseUrl}/bookings/admin/${selectedBooking.bookingId}/handle-cancellation`,{
        action,
        refundAmount,
        rejectionOrApprovalComments:comment
      },{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
      toast.success('Remboursement traité avec succès')

    }
      } catch (error) {
        toast.error('error occured')   
      }finally{
      setApproval(false);
      }
  };

 
  const handleSendEmail = async () => {
   
    if (!emailModal.booking) return;
    
    setIsSending(true);
    try {
      await axios.post(`${baseUrl}/bookings/admin/send-email`,{
        subject: emailData.subject,
        message:emailData.message,
        email: emailModal.booking.customer.email
      },{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
      handleCloseEmailModal();
      alert('Email sent');
    } catch (error) {
      console.error('Failed to send email:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Détails du trajet</DialogTitle>
    </DialogHeader>
    {selectedBooking && (
      <div className="space-y-6 p-4">
        {/* Customer Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-3 text-lg">Client</h4>
          <div className="space-y-1">
            <p><strong>Nom :</strong> {selectedBooking.customer?.firstName} {selectedBooking.customer?.lastName}</p>
            <p><strong>E-mail :</strong> {selectedBooking.customer?.email}</p>
            <p><strong>Téléphone :</strong> {selectedBooking.customer?.phone}</p>
          </div>
        </div>

        {/* Trip Information */}
        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-semibold text-lg mb-4">
    Trajet - {
      new Date(selectedBooking.tripDateTime || Date.now()).toLocaleDateString('fr-FR', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      })
    } - {
      new Date(selectedBooking.tripDateTime || Date.now())
        .toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        .replace(':', 'h')
    }
  </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p><strong>Départ :</strong></p>
              <p className="text-gray-600">{selectedBooking.departureLocation}</p>
            </div>
            <div>
              <p><strong>Destination :</strong></p>
              <p className="text-gray-600">{selectedBooking.destinationLocation}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p><strong>Numéro de vol :</strong></p>
              <p className="text-gray-600">{selectedBooking.flightNumber}</p>
            </div>
            <div>
              <p><strong>Distance :</strong></p>
              <p className="text-gray-600">{selectedBooking.distance} KM - {selectedBooking.time} min</p>
            </div>
          </div>

          <div>
            <p><strong>Véhicule :</strong> {selectedBooking.vehicleType}</p>
          </div>
        </div>

        {/* Passengers and Baggage */}
        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-semibold text-lg mb-3">Passagers et bagages</h4>
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Passagers :</strong> {selectedBooking.passengers}</p>
            <p><strong>Bagages :</strong> {selectedBooking.bags}</p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-lg mb-3">Informations complémentaires</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <p><strong>Poussettes :</strong> {selectedBooking.strollers}</p>
            <p><strong>Animaux :</strong> {selectedBooking.pets}</p>
            <p><strong>Fauteuil roulant :</strong> {selectedBooking.wheelchair}</p>
            <p><strong>Siège auto :</strong> {selectedBooking.childSeat }</p>
            <p><strong>Rehausseur :</strong> {selectedBooking.boosterSeat }</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Langue du chauffeur :</strong> {selectedBooking.driverLanguage=='fr'?'Français':'Espagnol' }</p>
            <p><strong>Réception avec pancarte:</strong> {selectedBooking.welcomeSign?'Oui':'Non' }</p>
          </div>
        </div>

        {/* Special Instructions */}
        {selectedBooking.specialInstructions && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-lg mb-3">D'autres précisions</h4>
            <p className="text-gray-700">{selectedBooking.specialInstructions}</p>
          </div>
        )}

        {/* Payment Information */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-lg mb-3">Payement</h4>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p><strong>Statut :</strong></p>
              <span className={`px-2 py-1 rounded text-xs ${
                selectedBooking.status.toUpperCase() === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                selectedBooking.status.toUpperCase() === 'PENDING' ? 'bg-orange-100 text-orange-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {selectedBooking.status.toUpperCase() === 'COMPLETED' ? 'Terminé' : 
                 selectedBooking.status.toUpperCase() === 'PENDING' ? 'En attente' : 
                 selectedBooking.status.toUpperCase() === 'CANCELLED' ? 'Annulé' : selectedBooking.status}
              </span>
            </div>
            <div>
              <p><strong>Statut du paiement :</strong></p>
              <span className={`px-2 py-1 rounded text-xs ${
                selectedBooking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {selectedBooking.paymentStatus === 'paid' ? 'Payé' : 'En attente'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <p><strong>Statut d'annulation :</strong> {selectedBooking.cancellationStatus === 'PENDING' ? 'En attente' : selectedBooking.cancellationStatus || 'Aucun'}</p>
            <div>
              <p><strong>Moyen de paiement :</strong></p>
              <p className="text-gray-600">{selectedBooking.paymentMethod=='card'? 'Carte bancaire':'Paiement en espèces'}</p>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span><strong>SubTotal :</strong></span>
              <span>{selectedBooking.totalPrice - (selectedBooking.languageFee || 0) - (selectedBooking.welcomeSignFee || 0)} €</span>
            </div>
            <div className="flex justify-between">
              <span><strong>Langue du chauffeur :</strong></span>
              <span>{selectedBooking.languageFee} €</span>
            </div>
            <div className="flex justify-between">
              <span><strong>Accueil avec pancarte :</strong></span>
              <span>{selectedBooking.welcomeSignFee } €</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span><strong>Total :</strong></span>
              <span>{selectedBooking.totalPrice} €</span>
            </div>
          </div>
        </div>

        {/* Cancellation Reason */}
        {selectedBooking.cancellationReason && (
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-lg">Raison de l'annulation</h4>
            <p className="text-red-700">{selectedBooking.cancellationReason}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
  {selectedBooking.cancellationStatus === "PENDING" && (
    <>
      <Button 
        onClick={() => setApproval(true)} 
        className="bg-green-600 hover:bg-green-700 mt-2"
      >
        Approuver l'annulation
      </Button>
      <Button
        variant="destructive"
        onClick={() => {
          setRejected(true);
        }}
        className="mt-2"
      >
        Rejeter l'annulation
      </Button>
    </>
  )}

  {/* {(!selectedBooking.cancellationStatus?.toUpperCase() || selectedBooking.cancellationStatus.toUpperCase() !== "PENDING") &&
    selectedBooking.status.toUpperCase() !== "CANCELLED" &&
    selectedBooking.status.toUpperCase() !== "COMPLETED" && (
      <Button 
        onClick={() => setApproval(true)} 
        variant="destructive" 
        className="bg-red-600 hover:bg-red-700 mt-2"
      >
        Annuler le trajet
      </Button>
  )} */}

  <Button
    variant="outline"
    onClick={() => handleOpenEmailModal(selectedBooking)}
    className="bg-gray-800 text-white hover:bg-gray-700 flex items-center gap-2 mt-2"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
    Envoyer informations du trajet
  </Button>
</div>

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
       <RejectionDialog 
        selectedBooking={selectedBooking} 
        open={rejected} 
        onClose={handleRejectionClose}
      />
       <Dialog open={emailModal.open && emailModal.booking?.bookingId === selectedBooking?.bookingId} onOpenChange={(open) => !open && handleCloseEmailModal()}>
                    <DialogTrigger asChild>
                      {/* <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEmailModal(selectedBooking!)}
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        Envoyer un e-mail 
                      </Button> */}
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>Envoyer un e-mail au client </DialogTitle>
                        <DialogDescription>
                          Envoyer un e-mail  à {selectedBooking?.customer?.firstName} {selectedBooking?.customer?.lastName} ({selectedBooking?.customer?.email})
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="subject">Objet</Label>
                          <Input
                            id="subject"
                            value={emailData.subject}
                            onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                            placeholder="Objet de l’e-mail "
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            value={emailData.message}
                            onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                            placeholder="Message de l’e-mail "
                            className="min-h-[120px]"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={handleCloseEmailModal} disabled={isSending}>
                          Annuler
                        </Button>
                        <Button 
                          onClick={handleSendEmail} 
                          disabled={!emailData.subject.trim() || !emailData.message.trim() || isSending}
                        >
                          {isSending ? 'Envoi en cours ...' : 'Envoyer informations du trajet'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
         </Dialog>
    </>

    
  );
}