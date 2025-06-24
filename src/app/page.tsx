'use client'

import { Users, Calendar, LogOut, Car, FileText } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import axios from 'axios';

import { TripManagement } from './trips/trips-management';
import UserManagement from './user-management';
import LoginForm from './loginform';
import baseUrl from './baseurl';
import LegalContentManagement from './legal/legal-management';
import VehicleManagement from './vehicle/vehicle-management';

export default function AdminPanel() {
  const [token, setToken] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [legalContent, setLegalContent] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState('users');
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [loadingLegalContent, setLoadingLegalContent] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  const [vehicleSearch, setVehicleSearch] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      if (currentPage === 'users') {
        fetchUsers(savedToken);
      } else if (currentPage === 'bookings') {
        fetchBookings(savedToken);
      } else if (currentPage === 'vehicles') {
        fetchVehicles(savedToken);
      } else if (currentPage === 'legal') {
        fetchLegalContent(savedToken);
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
    if (search.length === 0) {
      const token = localStorage.getItem('token')?.toString();
      if (token) {
        fetchBookings(token);
      }
    }
  }, [bookingSearch]);

  useEffect(() => {
    const search = userSearch.trim().toLowerCase();
    let filtered = users.filter((user) => {
      const fullName = `${user.firstName ?? ''} ${user?.lastName ?? ''}`.toLowerCase();
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

  useEffect(() => {
    const search = vehicleSearch.trim().toLowerCase();
    let filtered = vehicles.filter((vehicle) => {
      const vehicleType = vehicle?.vehicleType?.toLowerCase() ?? '';
      const price = vehicle?.price?.toString() ?? '';
      return (
        vehicleType.includes(search) ||
        price.includes(search)
      );
    });

    setVehicles(filtered);

    // If there's a search but no results, and search is now empty, fetch again
    if (search.length === 0) {
      const token = localStorage.getItem('token')?.toString();
      if (token) {
        fetchVehicles(token);
      }
    }
  }, [vehicleSearch]);

  const login = async (email: string, password: string) => {
    console.log(email);
    try {
      setLoading(true);
      
      const res = await axios.post(`${baseUrl}/auth/signin`, {
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
      const res = await axios.get(`${baseUrl}/auth/admin/users/all`, {
        headers: {
          Authorization: `Bearer ${authToken}`
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

  const suspendUser = async (id: string) => {
    console.log(id);
    try {
      await axios.patch(`${baseUrl}/auth/admin/${id}/suspend`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      fetchUsers(localStorage.getItem('token')?.toString())
      toast.success('Operation successfully');
    } catch (error) {
      toast.error('Error suspending user');
    }
  }

  const deleteUser = async (id: string) => {
    console.log(id);
    try {
      await axios.delete(`${baseUrl}/auth/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      fetchUsers(localStorage.getItem('token')?.toString())
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Error deleting user');
    }
  }

  const fetchBookings = async (authToken = token) => {
    try {
      setLoadingBookings(true);
      const res = await axios.get(`${baseUrl}/bookings/admin/all?page=${1}&limit=${500}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
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

  const fetchVehicles = async (authToken = token) => {
    try {
      setLoadingVehicles(true);
      const res = await axios.get(`${baseUrl}/vehicles`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      console.log('Vehicles:', res.data);
      setVehicles(res.data);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      toast.error('Error fetching vehicles');
    } finally {
      setLoadingVehicles(false);
    }
  };

  const createVehicle = async (vehicleData: { vehicleType: string; price: number }) => {
    try {
      const res = await axios.post(`${baseUrl}/vehicles`, vehicleData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchVehicles();
      toast.success('Vehicle created successfully');
      return res.data;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      toast.error('Error creating vehicle');
      throw error;
    }
  };

    const createLegal = async (legalData: { title: string; content: string, type:string, language:string }) => {
    try {
      const res = await axios.post(`${baseUrl}/legal`, {
        title:legalData.title,
        content:legalData.content,
        language:legalData.language,
        pageTitle:legalData.type
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchLegalContent();
      toast.success('Vehicle created successfully');
      return res.data;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      toast.error('Error creating vehicle');
      throw error;
    }
  };

  const updateVehicle = async (vehicleId: string, vehicleData: {  price?: number, pricePerKm:number }) => {
    try {
      const res = await axios.patch(`${baseUrl}/vehicles/${vehicleId}/edit`, {
        price:vehicleData.price,
        pricePerKm:vehicleData.pricePerKm
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchVehicles();
      toast.success('Vehicle updated successfully');
      return res.data;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error('Error updating vehicle');
      throw error;
    }
  };

   const updateRoute = async (routeId: string, routeData: { price?: number }) => {
    try {

      const res = await axios.patch(`${baseUrl}/vehicles/${routeId}/route/edit`, routeData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchVehicles();
      toast.success('Route updated successfully');
      return res.data;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error('Error updating route');
      throw error;
    }
  };

  const fetchLegalContent = async (authToken = token) => {
    try {
      setLoadingLegalContent(true);
      const res = await axios.get(`${baseUrl}/legal`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      console.log('Legal Content:', res.data);
      setLegalContent(res.data);
    } catch (err) {
      console.error('Error fetching legal content:', err);
      toast.error('Error fetching legal content');
    } finally {
      setLoadingLegalContent(false);
    }
  };

  const updateLegalContent = async (id:string,pageData:{type: string, content: string, title?:string, language:string}) => {
    try {
      const {content, title, type}= pageData;
      const res = await axios.patch(`${baseUrl}/legal/${id}`, 
        { content , title, pageTitle:type, language:pageData.language}, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchLegalContent();
      toast.success('Legal content updated successfully');
      return res.data;
    } catch (error) {
      console.error('Error updating legal content:', error);
      toast.error('Error updating legal content');
      throw error;
    }
  };

  if (!token) {
    return <LoginForm onLogin={login} loading={loading} />
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r">
        <div className="p-6 border-b">
          <div className="flex justify-right mb-4">
            <img 
              src="/logo_enjoy.svg" 
              alt="Admin Panel Logo" 
              className="w-18 h-18"
            />
          </div>
          <h1 className="text-sm font-bold text-gray-800">Panneau d'administration</h1>
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
          <button
            onClick={() => setCurrentPage('vehicles')}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
              currentPage === 'vehicles' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Car className="h-5 w-5 mr-3" />
            Gestion des véhicules
          </button>
          <button
            onClick={() => setCurrentPage('legal')}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
              currentPage === 'legal' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FileText className="h-5 w-5 mr-3" />
            Contenu légal
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
              loading={loadingUsers}
              searchValue={userSearch}
              onSearch={(e) => setUserSearch(e.target.value)}
              onRefresh={() => fetchUsers()} 
              onSuspendUser={suspendUser} 
              onDeleteUser={deleteUser} 
            />
          ) : currentPage === 'bookings' ? (
            <TripManagement 
              booking={bookings} 
              searchValue={bookingSearch}
              onSearch={(e) => setBookingSearch(e.target.value)}
              loadingBookings={loadingBookings}
              onRefresh={() => fetchBookings()} 
            />
          ) : currentPage === 'vehicles' ? (
            <VehicleManagement 
              vehicles={vehicles} 
              loading={loadingVehicles}
              searchValue={vehicleSearch}
              onUpdateRoute={updateRoute}
              onSearch={(e) => setVehicleSearch(e.target.value)}
              onRefresh={() => fetchVehicles()}
              onCreateVehicle={createVehicle}
              onUpdateVehicle={updateVehicle}
            />
          ) : (
            <LegalContentManagement 
              legalPages={legalContent}
              loading={loadingLegalContent}
              onCreatePage={createLegal}
              onDeletePage={()=>{}}
              onRefresh={() => fetchLegalContent()}
              onUpdatePage={updateLegalContent}
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