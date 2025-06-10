'use client'
import { useEffect, useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Users, Calendar, LogOut, Search, Eye, UserX, Trash2 } from 'lucide-react';
import UserManagement from './user-management';
import LoginForm from './loginform';
import { TripManagement } from './trips/trips-management';
import axios from 'axios';
import baseUrl from './baseurl';

export default function AdminPanel() {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState('users');

  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');

  const [showApprovalDialog, setShowApprovalDialog] = useState(false);

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

  // Filter users based on search
  useEffect(() => {
    if (!userSearch.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.phone.includes(userSearch)
      );
      setFilteredUsers(filtered);
    }
  }, [users, userSearch]);

  // Filter and sort bookings based on search (nearest date first)
  useEffect(() => {
    let filtered = bookings;
    
    if (bookingSearch.trim()) {
      filtered = bookings.filter(booking => 
        `${booking.customer?.firstName} ${booking.customer?.lastName}`.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        booking.customer?.email.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        booking.customer?.phone.includes(bookingSearch) ||
        booking.departureLocation.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        booking.destinationLocation.toLowerCase().includes(bookingSearch.toLowerCase())
      );
    }
    
    // Sort by trip date (nearest first)
    filtered.sort((a, b) => new Date(a.tripDateTime).getTime() - new Date(b.tripDateTime).getTime());
    
    setFilteredBookings(filtered);
  }, [bookings, bookingSearch]);



  const login = async (email:string, password:string) => {
    console.log(email);
    try {
      setLoading(true);
      
      const res = await axios.post(`${baseUrl}/auth/signin`,{
        email,
        password
      })
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
     const res = await  axios.get(`${baseUrl}/auth/admin/users/all`, {
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
      setUsers(res.data.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };
 const suspendUser =async(id:string)=>{
    console.log(id);
    try {
        // setSuspending(true);
       await axios.patch(`${baseUrl}/auth/admin/${id}/suspend`, {
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })
        fetchUsers(localStorage.getItem('token')?.toString())
          alert('Operation successfully');
    } catch (error) {
     alert('Error suspending user');
    }finally{
        // setSuspending(false);
    }
  }

    const deleteUser =async(id:string)=>{
    console.log(id);
    try {
        // setDeleting(true);
       await axios.delete(`${baseUrl}/auth/admin/${id}`, {
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        })
           fetchUsers(localStorage.getItem('token')?.toString())
          alert('User deleted successfully');
        
    } catch (error) {
     alert('Error deleting user');
    }finally{
        // setDeleting(false);
    }
  }

  const fetchBookings = async (authToken = token) => {
    try {
      setLoadingBookings(true);
      const res = await axios.get(`${baseUrl}/bookings/admin/all?page=${1}&limit=${500}`, {
        headers:{
          Authorization: `Bearer ${token} `
        }
      })
      console.log(res.data.data);
      setBookings(res.data.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };
  

  if (!token) {
  return  < LoginForm onLogin={login} loading={loading}/>
  }

   return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Panneau d'administration</h1>
        </div>
        <nav className="mt-6">
          <button
            onClick={() => setCurrentPage('users')}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
              currentPage === 'users' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Users className="h-5 w-5 mr-3" />
            Gestion des utilisateurs
          </button>
          <button
            onClick={() => setCurrentPage('bookings')}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
              currentPage === 'bookings' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Calendar className="h-5 w-5 mr-3" />
            Gestion des voyages
          </button>
          <div className="border-t mt-6 pt-6">
            <button
              onClick={logout}
              className="w-full flex items-center px-6 py-3 text-left hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Déconnexion
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {currentPage === 'users' ? (
            <UserManagement 
              users={users} 
              loading={loading}
              onRefresh={() => fetchUsers()} 
              onSuspendUser={suspendUser} 
              onDeleteUser={deleteUser} 
            />
          ) : (
            <TripManagement 
              booking={bookings} 
              loadingBookings={false}
              onRefresh={() => fetchBookings()} 
            />
          )}
        </div>
      </div>
    </div>
  );
}