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
                {new Date(booking.tripDateTime).toLocaleDateString()} <br />
                <span className="text-sm text-gray-500">
                  {new Date(booking.tripDateTime).toLocaleTimeString()}
                </span>
              </td>
              <td className="p-4 text-gray-600">
                <div className="text-sm">
                  <div className="font-medium">{booking.departureLocation}</div>
                  <div className="text-gray-500">→ {booking.destinationLocation}</div>
                </div>
              </td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                  booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {booking.status}
                </span>
                {booking.cancellationStatus === 'PENDING' && (
                  <div className="mt-1">
                    <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                      Cancellation Pending
                    </span>
                  </div>
                )}
              </td>
              <td className="p-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDetails(booking)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}