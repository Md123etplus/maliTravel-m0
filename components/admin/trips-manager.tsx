"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, CalendarIcon, Clock, MapPin } from "lucide-react"
import {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  getRoutes,
  getVehicles,
  getDestinations,
} from "@/lib/appwrite/admin"
import { useToast } from "@/components/ui/use-toast"

export default function TripsManager() {
  const [trips, setTrips] = useState<any[]>([])
  const [routes, setRoutes] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [destinations, setDestinations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTrip, setEditingTrip] = useState<any>(null)
  const [formData, setFormData] = useState({
    route_id: "",
    vehicle_id: "",
    departure_time: "",
    arrival_time: "",
    price: "",
    available_seats: "",
    status: "planifié" as const,
  })
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [tripsData, routesData, vehiclesData, destinationsData] = await Promise.all([
        getTrips(),
        getRoutes(),
        getVehicles(),
        getDestinations(),
      ])
      setTrips(tripsData)
      setRoutes(routesData)
      setVehicles(vehiclesData)
      setDestinations(destinationsData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const tripData = {
        route_id: formData.route_id,
        vehicle_id: formData.vehicle_id,
        departure_time: formData.departure_time,
        arrival_time: formData.arrival_time,
        price: Number.parseFloat(formData.price),
        available_seats: Number.parseInt(formData.available_seats),
        status: formData.status,
      }

      if (editingTrip) {
        await updateTrip(editingTrip.$id, tripData)
        toast({
          title: "Success",
          description: "Trip updated successfully",
        })
      } else {
        await createTrip(tripData)
        toast({
          title: "Success",
          description: "Trip created successfully",
        })
      }

      setShowAddForm(false)
      setEditingTrip(null)
      resetForm()
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save trip",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      route_id: "",
      vehicle_id: "",
      departure_time: "",
      arrival_time: "",
      price: "",
      available_seats: "",
      status: "planifié",
    })
  }

  const handleEdit = (trip: any) => {
    setEditingTrip(trip)
    // Format datetime for input (remove Z and milliseconds)
    const formatDateTime = (dateTime: string) => {
      if (!dateTime) return ""
      return new Date(dateTime).toISOString().slice(0, 16)
    }

    setFormData({
      route_id: trip.route_id,
      vehicle_id: trip.vehicle_id,
      departure_time: formatDateTime(trip.departure_time),
      arrival_time: formatDateTime(trip.arrival_time),
      price: trip.price.toString(),
      available_seats: trip.available_seats.toString(),
      status: trip.status,
    })
    setShowAddForm(true)
  }

  const handleDelete = async (tripId: string) => {
    if (confirm("Are you sure you want to delete this trip?")) {
      try {
        await deleteTrip(tripId)
        toast({
          title: "Success",
          description: "Trip deleted successfully",
        })
        loadData()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete trip",
          variant: "destructive",
        })
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      planifié: { color: "bg-blue-100 text-blue-800", label: "Planifié" },
      "en cours": { color: "bg-yellow-100 text-yellow-800", label: "En cours" },
      terminé: { color: "bg-green-100 text-green-800", label: "Terminé" },
      annulé: { color: "bg-red-100 text-red-800", label: "Annulé" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.planifié
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getRouteById = (routeId: string) => {
    return routes.find((route) => route.$id === routeId)
  }

  const getVehicleById = (vehicleId: string) => {
    return vehicles.find((vehicle) => vehicle.$id === vehicleId)
  }

  const getDestinationById = (destinationId: string) => {
    return destinations.find((dest) => dest.$id === destinationId)
  }

  const getRouteDisplay = (route: any) => {
    if (!route) return "Route not found"
    const origin = getDestinationById(route.origin_id)
    const destination = getDestinationById(route.destination_id)
    return `${origin?.name || "Unknown"} → ${destination?.name || "Unknown"}`
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#23282d]">Trips Management</h1>
        </div>
        <div className="text-center py-8">Loading trips...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#23282d]">Trips Management</h1>
        <Button onClick={() => setShowAddForm(true)} className="bg-[#0073aa] hover:bg-[#005a87] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add New Trip
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingTrip ? "Edit Trip" : "Add New Trip"}</CardTitle>
            <CardDescription>{editingTrip ? "Update trip information" : "Create a new trip schedule"}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="route">Route</Label>
                  <Select
                    value={formData.route_id}
                    onValueChange={(value) => setFormData({ ...formData, route_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      {routes.map((route) => (
                        <SelectItem key={route.$id} value={route.$id}>
                          {getRouteDisplay(route)} - {route.price?.toLocaleString()} FCFA
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle">Vehicle</Label>
                  <Select
                    value={formData.vehicle_id}
                    onValueChange={(value) => setFormData({ ...formData, vehicle_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles
                        .filter((vehicle) => vehicle.active)
                        .map((vehicle) => (
                          <SelectItem key={vehicle.$id} value={vehicle.$id}>
                            {vehicle.name} ({vehicle.registration}) - {vehicle.capacity} seats
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departure_time">Departure Time</Label>
                  <Input
                    id="departure_time"
                    type="datetime-local"
                    value={formData.departure_time}
                    onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arrival_time">Arrival Time</Label>
                  <Input
                    id="arrival_time"
                    type="datetime-local"
                    value={formData.arrival_time}
                    onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (FCFA)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="15000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="available_seats">Available Seats</Label>
                  <Input
                    id="available_seats"
                    type="number"
                    placeholder="45"
                    value={formData.available_seats}
                    onChange={(e) => setFormData({ ...formData, available_seats: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planifié">Planifié</SelectItem>
                      <SelectItem value="en cours">En cours</SelectItem>
                      <SelectItem value="terminé">Terminé</SelectItem>
                      <SelectItem value="annulé">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-[#0073aa] hover:bg-[#005a87]">
                  {editingTrip ? "Update Trip" : "Create Trip"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingTrip(null)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Trips List */}
      <Card>
        <CardHeader>
          <CardTitle>All Trips ({trips.length})</CardTitle>
          <CardDescription>Manage your scheduled trips</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trips.map((trip) => {
              const route = getRouteById(trip.route_id)
              const vehicle = getVehicleById(trip.vehicle_id)

              return (
                <div key={trip.$id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-[#666]" />
                        <span className="font-medium">{getRouteDisplay(route)}</span>
                        {getStatusBadge(trip.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[#666]">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{new Date(trip.departure_time).toLocaleDateString("fr-FR")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(trip.departure_time).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {new Date(trip.arrival_time).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">{trip.price.toLocaleString()} FCFA</span>
                          <span className="ml-2">({trip.available_seats} seats available)</span>
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-[#666]">
                        Vehicle: {vehicle ? `${vehicle.name} (${vehicle.registration})` : "Vehicle not found"}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(trip)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(trip.$id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
