"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, MapPin, Clock, DollarSign } from "lucide-react"
import { getRoutes, createRoute, updateRoute, deleteRoute, getDestinations } from "@/lib/appwrite/admin"
import { useToast } from "@/components/ui/use-toast"

export default function RoutesManager() {
  const [routes, setRoutes] = useState<any[]>([])
  const [destinations, setDestinations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingRoute, setEditingRoute] = useState<any>(null)
  const [formData, setFormData] = useState({
    origin_id: "",
    destination_id: "",
    distance: "",
    duration: "",
    price: "",
    active: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [routesData, destinationsData] = await Promise.all([getRoutes(), getDestinations()])
      setRoutes(routesData)
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

  const getDestinationName = (destinationId: string) => {
    const destination = destinations.find((d) => d.$id === destinationId)
    return destination ? `${destination.name} (${destination.city})` : destinationId
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.origin_id === formData.destination_id) {
      toast({
        title: "Error",
        description: "Origin and destination cannot be the same",
        variant: "destructive",
      })
      return
    }

    try {
      const routeData = {
        origin_id: formData.origin_id,
        destination_id: formData.destination_id,
        distance: Number.parseFloat(formData.distance),
        duration: Number.parseFloat(formData.duration),
        price: Number.parseFloat(formData.price),
        active: formData.active,
      }

      if (editingRoute) {
        await updateRoute(editingRoute.$id, routeData)
        toast({
          title: "Success",
          description: "Route updated successfully",
        })
      } else {
        await createRoute(routeData)
        toast({
          title: "Success",
          description: "Route created successfully",
        })
      }

      setShowAddForm(false)
      setEditingRoute(null)
      resetForm()
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save route",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      origin_id: "",
      destination_id: "",
      distance: "",
      duration: "",
      price: "",
      active: true,
    })
  }

  const handleEdit = (route: any) => {
    setEditingRoute(route)
    setFormData({
      origin_id: route.origin_id,
      destination_id: route.destination_id,
      distance: route.distance.toString(),
      duration: route.duration.toString(),
      price: route.price.toString(),
      active: route.active,
    })
    setShowAddForm(true)
  }

  const handleDelete = async (routeId: string) => {
    if (confirm("Are you sure you want to delete this route?")) {
      try {
        await deleteRoute(routeId)
        toast({
          title: "Success",
          description: "Route deleted successfully",
        })
        loadData()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete route",
          variant: "destructive",
        })
      }
    }
  }

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}h ${m}min`
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#23282d]">Routes Management</h1>
        </div>
        <div className="text-center py-8">Loading routes...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#23282d]">Routes Management</h1>
        <Button onClick={() => setShowAddForm(true)} className="bg-[#0073aa] hover:bg-[#005a87] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add New Route
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingRoute ? "Edit Route" : "Add New Route"}</CardTitle>
            <CardDescription>{editingRoute ? "Update route information" : "Create a new travel route"}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin_id">Origin</Label>
                  <Select
                    value={formData.origin_id}
                    onValueChange={(value) => setFormData({ ...formData, origin_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select origin" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations.map((destination) => (
                        <SelectItem key={destination.$id} value={destination.$id}>
                          {destination.name} ({destination.city})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination_id">Destination</Label>
                  <Select
                    value={formData.destination_id}
                    onValueChange={(value) => setFormData({ ...formData, destination_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations
                        .filter((dest) => dest.$id !== formData.origin_id)
                        .map((destination) => (
                          <SelectItem key={destination.$id} value={destination.$id}>
                            {destination.name} ({destination.city})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    step="0.1"
                    placeholder="235.5"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    step="0.1"
                    placeholder="4.5"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (CFA)</Label>
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
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                <Label htmlFor="active">Active Route</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-[#0073aa] hover:bg-[#005a87]">
                  {editingRoute ? "Update Route" : "Create Route"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingRoute(null)
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

      {/* Routes List */}
      <Card>
        <CardHeader>
          <CardTitle>All Routes ({routes.length})</CardTitle>
          <CardDescription>Manage your travel routes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {routes.length === 0 ? (
              <div className="text-center py-8 text-[#666]">
                No routes found. Create your first route to get started.
              </div>
            ) : (
              routes.map((route) => (
                <div key={route.$id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-[#666]" />
                        <span className="font-medium text-lg">
                          {getDestinationName(route.origin_id)} → {getDestinationName(route.destination_id)}
                        </span>
                        <Badge className={route.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {route.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[#666] mb-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>Distance: {route.distance} km</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Duration: {formatDuration(route.duration)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span>Price: {route.price.toLocaleString()} CFA</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(route)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(route.$id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
