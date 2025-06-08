'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "sonner";
import { Loader2, Users, Calendar, LogOut } from 'lucide-react';

export default function AdminPanel() {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState('users'); // 'users' or 'bookings'
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [refundedAmount, setRefundedAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      if (currentPage === 'users') {
        fetchUsers(savedToken);
      } else {
        fetchBookings(savedToken);
      }
    }
  }, [currentPage]);

  const baseUrl: string = `https://enjoy-mobile-api.onrender.com`;

  const login = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${baseUrl}/auth/signin`, { email, password });
      localStorage.setItem('token', res.data.accessToken);
      setToken(res.data.accessToken);
      fetchUsers(res.data.accessToken);
    } catch (err) {
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setCurrentPage('users');
  };

  const fetchUsers = async (authToken = token) => {
    try {
      setLoadingUsers(true);
      const res = await axios.get(`${baseUrl}/auth/admin/users/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUsers(res.data.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const suspendUser = async (id: string) => {
    try {
      await axios.patch(`${baseUrl}/admin/${id}/suspend`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast('User suspended successfully');
      fetchUsers();
    } catch (err) {
      toast('Error suspending user');
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`${baseUrl}/auth/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast('User successfully deleted');
      fetchUsers();
    } catch (err) {
      toast('Error deleting user');
    }
  };

  const fetchBookings = async (authToken = token) => {
    try {
      setLoadingBookings(true);
      const page = 1;
      const limit = 100;
      const res = await axios.get(`${baseUrl}/bookings/admin/all?limit=${Number(limit)}&page=${Number(page)}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setBookings(res.data.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleCancellation = async (bookingId: string, action: string, refundAmount: number) => {
    try {
      await axios.post(`${baseUrl}/bookings/admin/${bookingId}/handle-cancellation`, {
        action,
        refundAmount,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast(`Cancellation ${action.toLowerCase()}d successfully`);
      fetchBookings();
    } catch (err) {
      toast('Error handling cancellation');
    }
  };

  // Categorize bookings
  const categorizeBookings = () => {
    const pending = bookings.filter(booking => 
      booking.status === 'PENDING' || 
      booking.cancellationStatus === 'PENDING' ||
      (booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && !booking.refundedAmount)
    );
    
    const completed = bookings.filter(booking => 
      booking.status === 'COMPLETED' && 
      booking.cancellationStatus !== 'PENDING' && 
      !booking.refundedAmount
    );
    
    const refunded = bookings.filter(booking => 
      booking.refundedAmount > 0 || 
      booking.cancellationStatus === 'APPROVED' ||
      booking.status === 'CANCELLED'
    );

    return { pending, completed, refunded };
  };

  // Booking card component
  const BookingCard = ({ booking }: { booking: any }) => (
    <div key={booking.bookingId} className="border p-4 rounded-md space-y-2">
      <div className="text-sm mt-4 p-3 border rounded-md bg-muted">
        <h4 className="font-semibold mb-2">Customer Info</h4>
        <p><strong>Name:</strong> {booking.customer?.firstName} {booking.customer?.lastName}</p>
        <p><strong>Email:</strong> {booking.customer?.email}</p>
        <p><strong>Phone:</strong> {booking.customer?.phone}</p>
      </div>
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Trip Date: {new Date(booking.tripDateTime).toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Created: {new Date(booking.createdAt).toLocaleString()}</p>
        </div>
        <div className="text-right space-y-1 text-sm">
          <p><strong>Status:</strong> {booking.status}</p>
          <p><strong>Cancellation:</strong> {booking.cancellationStatus || '—'}</p>
          <p><strong>Payment:</strong> {booking.paymentStatus}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
        <div><strong>From:</strong> {booking.departureLocation}</div>
        <div><strong>To:</strong> {booking.destinationLocation}</div>
        <div><strong>Flight:</strong> {booking.flightNumber}</div>
        <div><strong>Driver Language:</strong> {booking.driverLanguage}</div>
        <div><strong>Vehicle Type:</strong> {booking.vehicleType}</div>
        <div><strong>Distance:</strong> {booking.distance} km</div>
        <div><strong>Estimated Time:</strong> {booking.time} min</div>
        <div><strong>Passengers:</strong> {booking.passengers}</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-2">
        <div><strong>Bags:</strong> {booking.bags}</div>
        <div><strong>Pets:</strong> {booking.pets}</div>
        <div><strong>Wheelchair:</strong> {booking.wheelchair}</div>
        <div><strong>Booster Seat:</strong> {booking.boosterSeat}</div>
        <div><strong>Child Seat:</strong> {booking.childSeat}</div>
        <div><strong>Strollers:</strong> {booking.strollers}</div>
        <div><strong>Welcome Sign:</strong> {booking.welcomeSign ? 'Yes' : 'No'}</div>
        <div><strong>Specific Language:</strong> {booking.specificLanguage ? 'Yes' : 'No'}</div>
      </div>

      <div className="text-sm mt-2 space-y-1">
        <p><strong>Special Instructions:</strong> {booking.specialInstructions || 'None'}</p>
        <p><strong>Cancellation Reason:</strong> {booking.cancellationReason || '—'}</p>
        <p><strong>Total Price:</strong> €{booking.totalPrice}</p>
        <p><strong>Language Fee:</strong> €{booking.languageFee}</p>
        <p><strong>Welcome Sign Fee:</strong>€{booking.welcomeSignFee}</p>
        <p><strong>Refunded Amount:</strong> €{booking.refundedAmount}</p>
        <p><strong>Payment Method:</strong> {booking.paymentMethod}</p>
      </div>

      {booking.cancellationStatus === "PENDING" && (
        <div className="flex gap-2 mt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setSelectedBooking(booking)}>Approve</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>Approve Cancellation</DialogHeader>
              <div className="space-y-2">
                <p>Enter refunded amount </p>
                <Input
                  type="number"
                  placeholder="Refunded amount"
                  value={refundedAmount}
                  onChange={(e) => setRefundedAmount(e.target.value)}
                />
              </div>
              <DialogFooter className="mt-4">
                <Button
                  onClick={() => {
                    handleCancellation(booking.bookingId, 'APPROVE', Number(refundedAmount));
                    setRefundedAmount("");
                  }}
                >
                  Confirm Approval
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleCancellation(booking.bookingId, 'REJECT', 0)}
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  );

  // Users page component
  const UsersPage = () => (
    <Card>
      <CardContent className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Users Management</h2>
          <Button onClick={() => fetchUsers()} disabled={loadingUsers}>
            {loadingUsers ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
            Refresh
          </Button>
        </div>
        
        {loadingUsers ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin h-8 w-8" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Phone</th>
                  <th className="p-2 border">Active</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-2 border">{user.firstName} {user.lastName}</td>
                    <td className="p-2 border">{user.email}</td>
                    <td className="p-2 border">{user.phone}</td>
                    <td className="p-2 border">{user.isActive ? 'Yes' : 'No'}</td>
                    <td className="p-2 border space-x-2">
                      <Button size="sm" onClick={() => suspendUser(user.id)}>
                        {user.isActive ? 'Suspend' : 'Activate'}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteUser(user.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Bookings page component
  const BookingsPage = () => {
    const { pending, completed, refunded } = categorizeBookings();

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Bookings Management</h2>
          <Button onClick={() => fetchBookings()} disabled={loadingBookings}>
            {loadingBookings ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
            Refresh
          </Button>
        </div>

        {loadingBookings ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin h-8 w-8" />
          </div>
        ) : (
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
              <TabsTrigger value="refunded">Refunded ({refunded.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <Card>
                <CardContent className="pt-4">
                  <h3 className="text-lg font-semibold mb-4">Pending Bookings ({pending.length})</h3>
                  <div className="space-y-4">
                    {pending.length === 0 ? (
                      <p className="text-muted-foreground">No pending bookings</p>
                    ) : (
                      pending.map((booking) => <BookingCard key={booking.bookingId} booking={booking} />)
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed">
              <Card>
                <CardContent className="pt-4">
                  <h3 className="text-lg font-semibold mb-4">Completed Bookings ({completed.length})</h3>
                  <div className="space-y-4">
                    {completed.length === 0 ? (
                      <p className="text-muted-foreground">No completed bookings</p>
                    ) : (
                      completed.map((booking) => <BookingCard key={booking.bookingId} booking={booking} />)
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="refunded">
              <Card>
                <CardContent className="pt-4">
                  <h3 className="text-lg font-semibold mb-4">Refunded Bookings ({refunded.length})</h3>
                  <div className="space-y-4">
                    {refunded.length === 0 ? (
                      <p className="text-muted-foreground">No refunded bookings</p>
                    ) : (
                      refunded.map((booking) => <BookingCard key={booking.bookingId} booking={booking} />)
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    );
  };

  if (!token) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="p-6 max-w-sm w-full bg-white rounded shadow space-y-4">
          <h1 className="text-xl font-bold text-center">Admin Login</h1>
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button className="w-full" onClick={login} disabled={loading}>
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Login'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="mt-4">
          <button
            onClick={() => setCurrentPage('users')}
            className={`w-full flex items-center px-4 py-2 text-left hover:bg-gray-100 ${
              currentPage === 'users' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600'
            }`}
          >
            <Users className="h-5 w-5 mr-3" />
            Users
          </button>
          <button
            onClick={() => setCurrentPage('bookings')}
            className={`w-full flex items-center px-4 py-2 text-left hover:bg-gray-100 ${
              currentPage === 'bookings' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600'
            }`}
          >
            <Calendar className="h-5 w-5 mr-3" />
            Bookings
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-2 text-left hover:bg-red-50 text-red-600 mt-4 border-t pt-4"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {currentPage === 'users' ? <UsersPage /> : <BookingsPage />}
      </div>
    </div>
  );
}