export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Booking {
  bookingId: string;
  customer: Customer;
  tripDateTime: string;
  createdAt: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  cancellationStatus: string | null;
  paymentStatus: 'PAID' | 'UNPAID';
  departureLocation: string;
  destinationLocation: string;
  flightNumber: string;
  driverLanguage: string;
  vehicleType: string;
  distance: number;
  time: number;
  passengers: number;
  bags: number;
  pets: number;
  wheelchair: boolean;
  boosterSeat: boolean;
  childSeat: boolean;
  strollers: number;
  welcomeSign: boolean;
  specificLanguage: boolean;
  specialInstructions: string;
  cancellationReason: string | null;
  totalPrice: number;
  languageFee: number;
  welcomeSignFee: number;
  refundedAmount: number;
  paymentMethod: string;
}
