'use client'
import { Eye, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Booking } from '@/types';
import { useState } from 'react';
import axios from 'axios';
import baseUrl from './baseurl';

interface TripTableProps {
  bookings: Booking[];
  onViewDetails: (booking: Booking) => void;
  onSendEmail?: (booking: Booking, subject: string, message: string) => void;
}

export default function TripTable({ bookings, onViewDetails, onSendEmail }: TripTableProps) {
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

  const handleSendEmail = async () => {
    console.log(onSendEmail)
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

if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun voyage trouvé correspondant à vos critères de recherche.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="text-left p-4 font-semibold text-gray-700">Client</th>
            <th className="text-left p-4 font-semibold text-gray-700">Téléphone</th>
            <th className="text-left p-4 font-semibold text-gray-700">Email</th>
            <th className="text-left p-4 font-semibold text-gray-700">Date du voyage</th>
            <th className="text-left p-4 font-semibold text-gray-700">Itinéraire</th>
            <th className="text-left p-4 font-semibold text-gray-700">Statut</th>
            <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.bookingId} className="border-b hover:bg-gray-50 transition-colors">
              <td className="p-4 font-medium">
                {booking.customer?.firstName} {booking.customer?.lastName}
              </td>
              <td className="p-4 text-gray-600">{booking.customer?.phone}</td>
              <td className="p-4 text-gray-600">{booking.customer?.email}</td>
              <td className="p-4 text-gray-600">
                {new Date(booking.tripDateTime).toLocaleDateString('fr-FR')} <br />
                <span className="text-sm text-gray-500">
                  {new Date(booking.tripDateTime).toLocaleTimeString('fr-FR')}
                </span>
              </td>
              <td className="p-4 text-gray-600 max-w-48">
                <div className="text-sm">
                  <div className="font-medium truncate" title={booking.departureLocation}>
                    {booking.departureLocation}
                  </div>
                  <div className="text-gray-500 truncate" title={`→ ${booking.destinationLocation}`}>
                    → {booking.destinationLocation}
                  </div>
                </div>
              </td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                   booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                   'bg-red-100 text-red-800'
                }`}>
                  {booking.status === 'COMPLETED' ? 'Terminé' : 
                   booking.status === 'PENDING' ? 'En attente' : 
                   booking.status === 'CANCELLED' ? 'Annulé' : booking.status}
                </span>
                {booking.cancellationStatus === 'PENDING' && (
                  <div className="mt-1">
                    <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                      Annulation en attente
                    </span>
                  </div>
                )}
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Dialog open={emailModal.open && emailModal.booking?.bookingId === booking.bookingId} onOpenChange={(open) => !open && handleCloseEmailModal()}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEmailModal(booking)}
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        Envoyer un email
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>Envoyer un email au client</DialogTitle>
                        <DialogDescription>
                          Envoyer un email à {booking.customer?.firstName} {booking.customer?.lastName} ({booking.customer?.email})
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="subject">Objet</Label>
                          <Input
                            id="subject"
                            value={emailData.subject}
                            onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                            placeholder="Objet de l'email"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            value={emailData.message}
                            onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                            placeholder="Message de l'email"
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
                          {isSending ? 'Envoi en cours...' : 'Envoyer l\'email'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetails(booking)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Voir les détails
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}