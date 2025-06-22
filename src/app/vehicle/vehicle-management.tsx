'use client'

import { useState } from 'react';
import { Car, Plus, Search, RefreshCw, Edit, Trash2, Save, X, MapPin, Route, Euro, Navigation } from 'lucide-react';

interface FixedRoute {
  routeId: string;
  start: string;
  destination: string;
  price: number;
  vehicleTypeId: string;
}

interface Vehicle {
  vehicleId: string;
  vehicleType: string;
  price: number;
  pricePerKm: number;
  fixedRoutes: FixedRoute[];
  createdAt?: string;
  updatedAt?: string;
}

interface RouteDto {
  start?: string;
  destination?: string;
  price?: number;
}

interface UpdateVehicleDto {
  vehicleType?: string;
  price?: number;
  pricePerKm?: number;
}

interface VehicleManagementProps {
  vehicles: Vehicle[];
  loading: boolean;
  searchValue: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRefresh: () => void;
  onCreateVehicle: (vehicleData: { vehicleType: string; price: number; pricePerKm: number }) => Promise<any>;
  onUpdateVehicle: (vehicleId: string, vehicleData: UpdateVehicleDto) => Promise<any>;
  onUpdateRoute: (routeId: string, routeData: RouteDto) => Promise<any>;
}

export default function VehicleManagement({
  vehicles,
  loading,
  searchValue,
  onSearch,
  onRefresh,
  onCreateVehicle,
  onUpdateVehicle,
  onUpdateRoute
}: VehicleManagementProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<string | null>(null);
  const [editingRoute, setEditingRoute] = useState<string | null>(null);
  const [expandedVehicles, setExpandedVehicles] = useState<Set<string>>(new Set());
  const [creatingVehicle, setCreatingVehicle] = useState(false);
  const [updatingVehicle, setUpdatingVehicle] = useState(false);
  const [updatingRoute, setUpdatingRoute] = useState(false);
  
  // Form states
  const [newVehicle, setNewVehicle] = useState({
    vehicleType: '',
    price: '',
    pricePerKm: ''
  });
  
  const [editVehicle, setEditVehicle] = useState({
    vehicleType: '',
    price: '',
    pricePerKm: ''
  });

  const [editRoute, setEditRoute] = useState({
    start: '',
    destination: '',
    price: ''
  });

  const toggleVehicleExpansion = (vehicleId: string) => {
    const newExpanded = new Set(expandedVehicles);
    if (newExpanded.has(vehicleId)) {
      newExpanded.delete(vehicleId);
    } else {
      newExpanded.add(vehicleId);
    }
    setExpandedVehicles(newExpanded);
  };

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.vehicleType || !newVehicle.price || !newVehicle.pricePerKm) {
      return;
    }

    try {
      setCreatingVehicle(true);
      await onCreateVehicle({
        vehicleType: newVehicle.vehicleType,
        price: parseFloat(newVehicle.price),
        pricePerKm: parseFloat(newVehicle.pricePerKm)
      });
      setNewVehicle({ vehicleType: '', price: '', pricePerKm: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating vehicle:', error);
    } finally {
      setCreatingVehicle(false);
    }
  };

  const handleEditVehicleClick = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle.vehicleId);
    setEditVehicle({
      vehicleType: vehicle.vehicleType,
      price: vehicle.price.toString(),
      pricePerKm: vehicle.pricePerKm.toString()
    });
  };

  const handleUpdateVehicle = async (vehicleId: string) => {
    if (!editVehicle.vehicleType || !editVehicle.price || !editVehicle.pricePerKm) {
      return;
    }

    try {
      setUpdatingVehicle(true);
      await onUpdateVehicle(vehicleId, {
        price: parseFloat(editVehicle.pricePerKm),
      });
      setEditingVehicle(null);
    } catch (error) {
      console.error('Error updating vehicle:', error);
    } finally {
      setUpdatingVehicle(false);
    }
  };

  const handleEditRouteClick = (route: FixedRoute) => {
    setEditingRoute(route.routeId);
    setEditRoute({
      start: route.start,
      destination: route.destination,
      price: route.price.toString()
    });
  };

  const handleUpdateRoute = async (routeId: string) => {
    if (!editRoute.start || !editRoute.destination || !editRoute.price) {
      return;
    }
   
    try {
      setUpdatingRoute(true);
      await onUpdateRoute(routeId, {
        price: parseFloat(editRoute.price)
      });
      setEditingRoute(null);
    } catch (error) {
      console.error('Error updating route:', error);
      
    } finally {
      setUpdatingRoute(false);
    }
  };

  const cancelVehicleEdit = () => {
    setEditingVehicle(null);
    setEditVehicle({ vehicleType: '', price: '', pricePerKm: '' });
  };

  const cancelRouteEdit = () => {
    setEditingRoute(null);
    setEditRoute({ start: '', destination: '', price: '' });
  };



  const totalRoutes = vehicles.reduce((sum, vehicle) => sum + vehicle.fixedRoutes.length, 0);
  const avgPricePerKm = vehicles.length > 0 
    ? vehicles.reduce((sum, v) => sum + v.pricePerKm, 0) / vehicles.length 
    : 0;

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
            Gérez les types de véhicules, leurs tarifs et itinéraires fixes
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
          {/* <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau véhicule
          </button> */}
        </div>
      </div>

     

      {/* Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher par type de véhicule, prix ou itinéraire..."
            value={searchValue}
            onChange={onSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <Route className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total itinéraires</p>
              <p className="text-2xl font-bold text-gray-900">{totalRoutes}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Euro className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Prix/km moyen</p>
              <p className="text-2xl font-bold text-gray-900">
                {avgPricePerKm.toFixed(2)} €
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Navigation className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Prix base max</p>
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

      {/* Vehicles List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Liste des véhicules et itinéraires ({vehicles.length})
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
          <div className="divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <div key={vehicle.vehicleId} className="p-6">
                {/* Vehicle Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Car className="h-5 w-5 text-gray-400 mr-2" />
                      {editingVehicle === vehicle.vehicleId ? (
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={editVehicle.vehicleType}
                            onChange={(e) => setEditVehicle({ ...editVehicle, vehicleType: e.target.value })}
                            className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Type"
                          />
                       
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editVehicle.pricePerKm}
                            onChange={(e) => setEditVehicle({ ...editVehicle, pricePerKm: e.target.value })}
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="€/km"
                          />
                        </div>
                      ) : (
                        <div>
                          <span className="text-lg font-semibold text-gray-900">
                            {vehicle.vehicleType}
                          </span>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          
                            <span>Prix/km: {vehicle.pricePerKm} €</span>
                            <span className="text-blue-600">
                              {vehicle.fixedRoutes.length} itinéraire{vehicle.fixedRoutes.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {editingVehicle === vehicle.vehicleId ? (
                      <>
                        <button
                          onClick={() => handleUpdateVehicle(vehicle.vehicleId)}
                          disabled={updatingVehicle}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={cancelVehicleEdit}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditVehicleClick(vehicle)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => toggleVehicleExpansion(vehicle.vehicleId)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {expandedVehicles.has(vehicle.vehicleId) ? '−' : '+'}
                    </button>
                  </div>
                </div>

                {/* Routes Section */}
                {expandedVehicles.has(vehicle.vehicleId) && (
                  <div className="ml-7 border-l-2 border-gray-200 pl-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <Route className="h-4 w-4 mr-1" />
                      Itinéraires fixes ({vehicle.fixedRoutes.length})
                    </h4>
                    {vehicle.fixedRoutes.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">Aucun itinéraire fixe défini</p>
                    ) : (
                      <div className="space-y-3">
                        {vehicle.fixedRoutes.map((route) => (
                          <div key={route.routeId} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            {editingRoute === route.routeId ? (
                              <div className="flex space-x-2 flex-1">
                                <input
                                  type="text"
                                  value={editRoute.start}
                                  onChange={(e) => setEditRoute({ ...editRoute, start: e.target.value })}
                                  className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                  placeholder="Départ"
                                />
                                <span className="self-center text-gray-400">→</span>
                                <input
                                  type="text"
                                  value={editRoute.destination}
                                  onChange={(e) => setEditRoute({ ...editRoute, destination: e.target.value })}
                                  className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                  placeholder="Destination"
                                />
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={editRoute.price}
                                  onChange={(e) => setEditRoute({ ...editRoute, price: e.target.value })}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                  placeholder="Prix"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center space-x-3 flex-1">
                                <MapPin className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium">{route.start}</span>
                                <span className="text-gray-400">→</span>
                                <span className="text-sm font-medium">{route.destination}</span>
                                <span className="ml-auto text-sm font-semibold text-blue-600">
                                  {route.price} €
                                </span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1 ml-2">
                              {editingRoute === route.routeId ? (
                                <>
                                  <button
                                    onClick={() => handleUpdateRoute(route.routeId)}
                                    disabled={updatingRoute}
                                    className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                  >
                                    <Save className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={cancelRouteEdit}
                                    className="text-gray-600 hover:text-gray-900"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleEditRouteClick(route)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Edit className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}