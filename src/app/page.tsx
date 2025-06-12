'use client'

import { Users, Calendar, LogOut } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import axios from 'axios';

import { TripManagement } from './trips/trips-management';
import UserManagement from './user-management';
import LoginForm from './loginform';
import baseUrl from './baseurl';


export default function AdminPanel() {
  const [token, setToken] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState('users');
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');



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



  // Filter and sort bookings based on search (nearest date first)
 useEffect(() => {
  const search = bookingSearch.trim().toLowerCase();

  let filtered = bookings.filter((booking) => {
    const fullName = `${booking.customer?.firstName ?? ''} ${booking.customer?.lastName ?? ''}`.toLowerCase();
    const email = booking.customer?.email?.toLowerCase() ?? '';
    const phone = booking.customer?.phone ?? '';
    const departure = booking.departureLocation?.toLowerCase() ?? '';
    const destination = booking.destinationLocation?.toLowerCase() ?? '';

    return (
      fullName.includes(search) ||
      email.includes(search) ||
      phone.includes(search) ||
      departure.includes(search) ||
      destination.includes(search)
    );
  });

  // Sort by trip date (nearest first)
  filtered = filtered.sort((a, b) =>
    new Date(a.tripDateTime).getTime() - new Date(b.tripDateTime).getTime()
  );

  setBookings(filtered);

  // If there's a search but no results, and search is now empty, fetch again
  console.log(search.length)
  if (search.length === 0 ) {
    const token = localStorage.getItem('token')?.toString();
    if (token) {
      fetchBookings(token);
    }
  }
}, [bookingSearch]); 


 useEffect(() => {
  const search = userSearch.trim().toLowerCase();

  let filtered = users.filter((user) => {
    const fullName = `${user.firstName?? ''} ${user?.lastName ?? ''}`.toLowerCase();
    const email = user?.email?.toLowerCase() ?? '';
    const phone = user?.phone ?? '';
    return (
      fullName.includes(search) ||
      email.includes(search) ||
      phone.includes(search) 
    );
  });

  setUsers(filtered);

  // If there's a search but no results, and search is now empty, fetch again
  if (search.length === 0) {
    const token = localStorage.getItem('token')?.toString();
    if (token) {
      fetchUsers(token);
    }
  }
}, [userSearch]); 

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
      console.log(err);
      toast.error('Login failed');
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
      console.log('I am calling')
      setLoadingUsers(true);
     const res = await  axios.get(`${baseUrl}/auth/admin/users/all`, {
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    console.log(res.data.data);
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
          toast.success('Operation successfully');
    } catch (error) {
     toast.error('Error suspending user');
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
          toast.success('User deleted successfully');
        
    } catch (error) {
     toast.error('Error deleting user');
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
           Gestion des clients
          </button>
          <button
            onClick={() => setCurrentPage('bookings')}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
              currentPage === 'bookings' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Calendar className="h-5 w-5 mr-3" />
            Gestion des trajets 
          </button>
          <div className="border-t mt-6 pt-6">
            <button
              onClick={logout}
              className="w-full flex items-center px-6 py-3 text-left hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
               Se déconnecter
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
              searchValue={userSearch}
              onSearch={(e)=>setUserSearch(e.target.value)}
              onRefresh={() => fetchUsers()} 
              onSuspendUser={suspendUser} 
              onDeleteUser={deleteUser} 
            />
          ) : (
            <TripManagement 
              booking={bookings} 
              searchValue={bookingSearch}
              onSearch={(e)=>setBookingSearch(e.target.value)}
              loadingBookings={false}
              onRefresh={() => fetchBookings()} 
            />
          )}
        </div>
      </div>
    {/* <Toaster 
  position="top-right" 
  toastOptions={{
    style: {
      zIndex: 9999,
    },
  }}
/> */}
    </div>
  );
}