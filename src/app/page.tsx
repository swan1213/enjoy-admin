'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
// import { useRouter } from 'next/router';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "sonner";

export default function AdminPanel() {
  // const router = useRouter();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
const [selectedBooking, setSelectedBooking] = useState(null);
const [refundedAmount, setRefundedAmount] = useState("");

  useEffect(() => {
    const savedToken =    localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchUsers(savedToken);
      fetchBookings(savedToken);
    }
  }, [page, limit]);
   const baseUrl:string =`https://enjoy-mobile-api.onrender.com`;
  const login = async () => {
    try {
      const res = await axios.post(`${baseUrl}/auth/signin`, { email, password });
      localStorage.setItem('token', res.data.accessToken);
      setToken(res.data.accessToken);
      fetchUsers(res.data.accessToken);
      fetchBookings(res.data.accessToken);
      // router.push('/admin');
    } catch (err) {
      alert('Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    // router.push('/');
  };

  const fetchUsers = async (authToken = token) => {
    const res = await axios.get(`${baseUrl}/auth/admin/users/all`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    setUsers(res.data.data);
  };

  const suspendUser = async (id:string) => {
    await axios.patch(`${baseUrl}/admin/${id}/suspend`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  const deleteUser = async (id:string) => {
    await axios.delete(`${baseUrl}/auth/admin/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast('User successfully deleted')
    fetchUsers();
  };

  const fetchBookings = async (authToken = token) => {
    const page =1;
    const limit=100
    const res = await axios.get(`http://localhost:8000/bookings/admin/all?limit=${Number(limit)}&page=${Number(page)}`, {
      // params: { search },
      headers: { Authorization: `Bearer ${authToken}` },

    });
    console.log(res.data.data)
    setBookings(res.data.data);
  };

  const handleCancellation = async (bookingId:string, action:string, refundAmount:number) => {
    await axios.post(`${baseUrl}/bookings/admin/${bookingId}/handle-cancellation`, {
      action,
      refundAmount,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBookings();
  };

if (!token) {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 max-w-sm w-full bg-white rounded shadow space-y-4">
        <h1 className="text-xl font-bold text-center">Admin Login</h1>
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button className="w-full" onClick={login}>Login</Button>
      </div>
    </div>
  );
}

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Button variant="destructive" onClick={logout}>Logout</Button>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

       <TabsContent value="users">
  <Card>
    <CardContent className="pt-4">
      <h2 className="text-xl font-bold mb-4">Users</h2>
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
                  <Button size="sm" onClick={() => suspendUser(user.id)}>Suspend</Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteUser(user.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
</TabsContent>


        <TabsContent value="bookings">
          <Card>
            <CardContent className="pt-4">
              <h2 className="text-xl font-bold mb-2">Bookings</h2>
             {bookings.map((booking) => (
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
      <div><strong>Flight #:</strong> {booking.flightNumber}</div>
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
      <p><strong>Total Price:</strong> ₦{booking.totalPrice}</p>
      <p><strong>Language Fee:</strong> ₦{booking.languageFee}</p>
      <p><strong>Welcome Sign Fee:</strong> ₦{booking.welcomeSignFee}</p>
      <p><strong>Refunded Amount:</strong> ₦{booking.refundedAmount}</p>
      <p><strong>Payment Method:</strong> {booking.paymentMethod}</p>
    </div>

    <p><strong>Cancellation:</strong> {booking.cancellationStatus || '—'}</p>

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
              handleCancellation(booking.bookingId, 'APPROVE',Number(refundedAmount));
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
))}

            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
