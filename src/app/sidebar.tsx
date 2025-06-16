'use client'
import { Users, Calendar, LogOut } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ currentPage, onPageChange, onLogout }: SidebarProps) {
  return (
    <div className="w-64 bg-white shadow-lg border-r">
      <div className="p-6 border-b">
      
        {/* <h1 className="text-xl font-bold text-gray-800">Panneau d'administration </h1> */}
      </div>
      <nav className="mt-6">
        <button
          onClick={() => onPageChange('users')}
          className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
            currentPage === 'users' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Users className="h-5 w-5 mr-3" />
        Gestion des clients 
        </button>
        <button
          onClick={() => onPageChange('bookings')}
          className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
            currentPage === 'bookings' ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Calendar className="h-5 w-5 mr-3" />
         Gestion des trajetss
        </button>
        <div className="border-t mt-6 pt-6">
          <button
            onClick={onLogout}
            className="w-full flex items-center px-6 py-3 text-left hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Se déconnecter 
          </button>
        </div>
      </nav>
    </div>
  );
}