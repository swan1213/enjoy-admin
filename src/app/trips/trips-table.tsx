'use client'
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Booking } from '@/types';

interface TripTableProps {
  bookings: Booking[];
  isLoading: boolean;
  onViewDetails: (booking: Booking) => void;
}

export default function TripTable({ bookings, isLoading, onViewDetails }: TripTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No trips found matching your search criteria.</p>
      </div>
    );
  }

  const getStatusDisplay = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return 'Terminné';
      case 'PENDING':
        return 'En attente';
      case 'CANCELLED':
        return 'Annulé';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="text-left p-4 font-semibold text-gray-700">Customer</th>
            <th className="text-left p-4 font-semibold text-gray-700">Phone</th>
            <th className="text-left p-4 font-semibold text-gray-700">Email</th>
            <th className="text-left p-4 font-semibold text-gray-700">Trip Date</th>
            <th className="text-left p-4 font-semibold text-gray-700">Route</th>
            <th className="text-left p-4 font-semibold text-gray-700">Status</th>
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
                {new Date(booking.tripDateTime).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })} <br />
                <span className="text-sm text-gray-500">
                  {new Date(booking.tripDateTime).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </td>
              <td className="p-4 text-gray-600">
                <div className="text-sm">
                  <div className="font-medium">{booking.departureLocation}</div>
                  <div className="text-gray-500">→ {booking.destinationLocation}</div>
                </div>
              </td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                  {getStatusDisplay(booking.status)}
                </span>
                {booking.cancellationStatus === 'PENDING' && (
                  <div className="mt-1">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Annulation en attente
                    </span>
                  </div>
                )}
              </td>
              <td className="p-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDetails(booking)}
                  className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200"
                >
                  <Eye className="h-4 w-4" />
                  Voir détails
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}