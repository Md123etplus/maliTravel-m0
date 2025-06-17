"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, Bus, X } from "lucide-react"
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from "@/lib/appwrite/admin"
import { useToast } from "@/components/ui/use-toast"

export default function VehiclesManager() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "bus" as const,
    registration: "",
    capacity: "",
    features: [] as string[],
    image: null as string | null,
    active: true,
  })
  const [newFeature, setNewFeature] = useState("")
  const { toast } = useToast()

  // Predefined features list
  const availableFeatures = [
    "Air Conditioning",
    "WiFi",
    "USB Charging",
    "Reclining Seats",
    "Entertainment System",
    "Toilet",
    "Refreshments",
    "Luggage Storage",
    "GPS Tracking",
    "CCTV",
  ]

  useEffect(() => {
    loadVehicles()
  }, [])

  const loadVehicles = async () => {
    try {
      setIsLoading(true)
      const data = await getVehicles()
      setVehicles(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load vehicles",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const vehicleData = {
        name: formData.name,
        type: formData.type,
        registration: formData.registration,
        capacity: Number.parseInt(formData.capacity),
        features: formData.features,
        image: formData.image,
        active: formData.active,
      }

      if (editingVehicle) {
        await updateVehicle(editingVehicle.$id, vehicleData)
        toast({
          title: "Success",
          description: "Vehicle updated successfully",
        })
      } else {
        await createVehicle(vehicleData)
        toast({
          title: "Success",
          description: "Vehicle created successfully",
        })
      }

      setShowAddForm(false)
      setEditingVehicle(null)
      resetForm()
      loadVehicles()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save vehicle",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      type: "bus",
      registration: "",
      capacity: "",
      features: [],
      image: "",
      active: true,
    })
    setNewFeature("")
  }

  const handleEdit = (vehicle: any) => {
    setEditingVehicle(vehicle)
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      registration: vehicle.registration,
      capacity: vehicle.capacity.toString(),
      features: vehicle.features || [],
      image: vehicle.image || "",
      active: vehicle.active,
    })
    setShowAddForm(true)
  }

  const handleDelete = async (vehicleId: string) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await deleteVehicle(vehicleId)
        toast({
          title: "Success",
          description: "Vehicle deleted successfully",
        })
        loadVehicles()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete vehicle",
          variant: "destructive",
        })
      }
    }
  }

  const addFeature = (feature: string) => {
    if (feature && !formData.features.includes(feature)) {
      setFormData({ ...formData, features: [...formData.features, feature] })
    }
  }

  const removeFeature = (feature: string) => {
    setFormData({
      ...formData,
      features: formData.features.filter((f) => f !== feature),
    })
  }

  const addCustomFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] })
      setNewFeature("")
    }
  }

  const getStatusBadge = (active: boolean) => {
    return (
      <Badge className={active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
        {active ? "Active" : "Inactive"}
      </Badge>
    )
  }

  const getTypeIcon = (type: string) => {
    return <Bus className="h-4 w-4 text-[#666]" />
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#23282d]">Vehicles Management</h1>
        </div>
        <div className="text-center py-8">Loading vehicles...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#23282d]">Vehicles Management</h1>
        <Button onClick={() => setShowAddForm(true)} className="bg-[#0073aa] hover:bg-[#005a87] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add New Vehicle
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}</CardTitle>
            <CardDescription>
              {editingVehicle ? "Update vehicle information" : "Register a new vehicle in your fleet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Vehicle Name</Label>
                  <Input
                    id="name"
                    placeholder="Mercedes Sprinter VIP"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registration">Registration Number</Label>
                  <Input
                    id="registration"
                    placeholder="ML-001-AB"
                    value={formData.registration}
                    onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Vehicle Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="minibus">Minibus</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="coach">Coach</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (seats)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="50"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="image">Vehicle Image URL</Label>
                  <Input
                    id="image"
                    type="url"
                    placeholder="https://example.com/vehicle-image.jpg"
                    value={formData.image ?? ""}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>
              </div>

              {/* Features Section */}
              <div className="space-y-4">
                <Label>Vehicle Features</Label>

                {/* Available Features */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableFeatures.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={formData.features.includes(feature)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            addFeature(feature)
                          } else {
                            removeFeature(feature)
                          }
                        }}
                      />
                      <Label htmlFor={feature} className="text-sm">
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>

                {/* Custom Feature Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom feature..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomFeature())}
                  />
                  <Button type="button" onClick={addCustomFeature} variant="outline">
                    Add
                  </Button>
                </div>

                {/* Selected Features */}
                {formData.features.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Selected Features:</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                          {feature}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-600"
                            onClick={() => removeFeature(feature)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: !!checked })}
                />
                <Label htmlFor="active">Active Vehicle</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-[#0073aa] hover:bg-[#005a87]">
                  {editingVehicle ? "Update Vehicle" : "Add Vehicle"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingVehicle(null)
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

      {/* Vehicles List */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Overview ({vehicles.length})</CardTitle>
          <CardDescription>Manage your vehicle fleet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.$id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {/* Vehicle Image */}
                  {vehicle.image && (
                    <div className="mb-3">
                      <img
                        src={vehicle.image || "/placeholder.svg"}
                        alt={vehicle.name}
                        className="w-full h-32 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(vehicle.type)}
                      <span className="font-medium">{vehicle.name}</span>
                    </div>
                    {getStatusBadge(vehicle.active)}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="text-[#666]">Registration: {vehicle.registration}</div>
                    <div className="text-[#666]">Type: {vehicle.type}</div>
                    <div className="text-[#666]">Capacity: {vehicle.capacity} seats</div>

                    {/* Features */}
                    {vehicle.features && vehicle.features.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-[#666]">Features:</div>
                        <div className="flex flex-wrap gap-1">
                          {vehicle.features.slice(0, 3).map((feature: string) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {vehicle.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{vehicle.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(vehicle)} className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(vehicle.$id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
