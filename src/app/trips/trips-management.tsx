'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Booking } from "@/types";
import { Eye, Loader2, Search } from "lucide-react";
import { useState } from "react";
import BookingDetailsModal from "./tripdetails";
import TripTable from "../trip-table";
interface TripManagementProps {
  booking: Booking[];
  loadingBookings: boolean;
  onRefresh: () => void;
}
  export function TripManagement({
    loadingBookings,
    onRefresh,
    booking,
  }:TripManagementProps){
   const [tripSearch, setTripSearch] = useState('');
     const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
       const [showTripDetails, setShowTripDetails] = useState(false);
         const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
       
         const handleViewDetails = (booking:Booking) => {
            setSelectedBooking(booking);
            console.log('called');
           setShowTripDetails(true);
         };
    return (
     <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <Button onClick={onRefresh} disabled={loadingBookings} className="flex items-center gap-2">
          {loadingBookings ? <Loader2 className="animate-spin h-4 w-4" /> : null}
          Refresh bookings
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search trips by customer, location..."
                value={tripSearch}
                onChange={(e) => setTripSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-500">
              {filteredBookings.length} of {booking.length} trips
            </div>
          </div>
          
           <TripTable bookings={booking} onViewDetails={handleViewDetails}/>
        </CardContent>
      </Card>

      <BookingDetailsModal 
      selectedBooking={selectedBooking} 
      open={showTripDetails} onClose={()=>setShowTripDetails(false)} 
      onApproved={function (id: string): void {
            } } onReject={function (id: string): void {
 
            } }/>
    </div>
    );
  };