'use client'

import { useState } from 'react';
import { Car, Plus, Search, RefreshCw, Edit, Trash2, Save, X } from 'lucide-react';

interface Vehicle {
  vehicleId: string;
  vehicleType: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

interface VehicleManagementProps {
  vehicles: Vehicle[];
  loading: boolean;
  searchValue: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRefresh: () => void;
  onCreateVehicle: (vehicleData: { vehicleType: string; price: number }) => Promise<any>;
  onUpdateVehicle: (vehicleId: string, vehicleData: { vehicleType?: string; price?: number }) => Promise<any>;
}

export default function VehicleManagement({
  vehicles,
  loading,
  searchValue,
  onSearch,
  onRefresh,
  onCreateVehicle,
  onUpdateVehicle
}: VehicleManagementProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<string | null>(null);
  const [creatingVehicle, setCreatingVehicle] = useState(false);
  const [updatingVehicle, setUpdatingVehicle] = useState(false);
  
  // Form states
  const [newVehicle, setNewVehicle] = useState({
    vehicleType: '',
    price: ''
  });
  
  const [editVehicle, setEditVehicle] = useState({
    vehicleType: '',
    price: ''
  });

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.vehicleType || !newVehicle.price) {
      return;
    }

    try {
      setCreatingVehicle(true);
      await onCreateVehicle({
        vehicleType: newVehicle.vehicleType,
        price: parseFloat(newVehicle.price)
      });
      setNewVehicle({ vehicleType: '', price: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating vehicle:', error);
    } finally {
      setCreatingVehicle(false);
    }
  };

  const handleEditClick = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle.vehicleId);
    setEditVehicle({
      vehicleType: vehicle.vehicleType,
      price: vehicle.price.toString()
    });
  };

  const handleUpdateVehicle = async (vehicleId: string) => {
    if (!editVehicle.vehicleType || !editVehicle.price) {
      return;
    }

    try {
      setUpdatingVehicle(true);
      await onUpdateVehicle(vehicleId, {
        vehicleType: editVehicle.vehicleType,
        price: parseFloat(editVehicle.price)
      });
      setEditingVehicle(null);
    } catch (error) {
      console.error('Error updating vehicle:', error);
    } finally {
      setUpdatingVehicle(false);
    }
  };

  const cancelEdit = () => {
    setEditingVehicle(null);
    setEditVehicle({ vehicleType: '', price: '' });
  };

  const cancelCreate = () => {
    setShowCreateForm(false);
    setNewVehicle({ vehicleType: '', price: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Car className="h-8 w-8 mr-3 text-blue-600" />
            Gestion des véhicules
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez les types de véhicules et leurs tarifs
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau véhicule
          </button>
        </div>
      </div>

      {/* Create Vehicle Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">Créer un nouveau véhicule</h3>
          <form onSubmit={handleCreateVehicle} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de véhicule
                </label>
                <input
                  type="text"
                  value={newVehicle.vehicleType}
                  onChange={(e) => setNewVehicle({ ...newVehicle, vehicleType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Sedan, SUV, Minibus..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newVehicle.price}
                  onChange={(e) => setNewVehicle({ ...newVehicle, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelCreate}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <X className="h-4 w-4 mr-2 inline" />
                Annuler
              </button>
              <button
                type="submit"
                disabled={creatingVehicle}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2 inline" />
                {creatingVehicle ? 'Création...' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher par type de véhicule ou prix..."
            value={searchValue}
            onChange={onSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Vehicle Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total véhicules</p>
              <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Car className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Prix moyen</p>
              <p className="text-2xl font-bold text-gray-900">
                {vehicles.length > 0 
                  ? Math.round(vehicles.reduce((sum, v) => sum + v.price, 0) / vehicles.length).toLocaleString()
                  : 0
                } €
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Car className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Prix maximum</p>
              <p className="text-2xl font-bold text-gray-900">
                {vehicles.length > 0 
                  ? Math.max(...vehicles.map(v => v.price)).toLocaleString()
                  : 0
                } €
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Liste des véhicules ({vehicles.length})
          </h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Chargement des véhicules...</span>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-12">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun véhicule trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type de véhicule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix (€)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de création
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.vehicleId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingVehicle === vehicle.vehicleId ? (
                        <input
                          type="text"
                          value={editVehicle.vehicleType}
                          onChange={(e) => setEditVehicle({ ...editVehicle, vehicleType: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="flex items-center">
                          <Car className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {vehicle.vehicleType}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingVehicle === vehicle.vehicleId ? (
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editVehicle.price}
                          onChange={(e) => setEditVehicle({ ...editVehicle, price: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-sm text-gray-900 font-semibold">
                          {vehicle.price.toLocaleString()} €
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.createdAt 
                        ? new Date(vehicle.createdAt).toLocaleDateString('fr-FR')
                        : 'N/A'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingVehicle === vehicle.vehicleId ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleUpdateVehicle(vehicle.vehicleId)}
                            disabled={updatingVehicle}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick(vehicle)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}