'use client'
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@/types';


interface UserTableProps {
  users: User[];
  onViewDetails: (user: User) => void;
}

export default function UserTable({ users, onViewDetails }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun client ne correspond à vos
critères de recherche.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="text-left p-4 font-semibold text-gray-700">Nom</th>
            <th className="text-left p-4 font-semibold text-gray-700">E-mail</th>
            <th className="text-left p-4 font-semibold text-gray-700">Téléphone</th>
            <th className="text-left p-4 font-semibold text-gray-700">Statut</th>
            <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="p-4 font-medium">{user.firstName} {user.lastName}</td>
              <td className="p-4 text-gray-600">{user.email}</td>
              <td className="p-4 text-gray-600">{user.phone}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Actif' : 'Suspendu'}
                </span>
              </td>
              <td className="p-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDetails(user)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Voir les détails
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}