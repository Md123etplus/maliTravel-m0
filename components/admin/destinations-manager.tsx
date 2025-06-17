"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, MapPin, Star, ImageIcon } from "lucide-react"
import { getDestinations, createDestination, updateDestination, deleteDestination } from "@/lib/appwrite/admin"
import { useToast } from "@/components/ui/use-toast"

export default function DestinationsManager() {
  const [destinations, setDestinations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingDestination, setEditingDestination] = useState<any>(null)
  const [formData, setFormData] = useState<{
    name: string
    city: string
    region: string
    country: string
    description: string
    image: string // Remove | null
    popular: boolean
    coordinates: number[]
  }>({
    name: "",
    city: "",
    region: "",
    country: "Mali",
    description: "",
    image: "", // Change from null to empty string
    popular: false,
    coordinates: [] as number[],
  })
  const { toast } = useToast()

  useEffect(() => {
    loadDestinations()
  }, [])

  const loadDestinations = async () => {
    try {
      setIsLoading(true)
      const data = await getDestinations()
      setDestinations(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load destinations",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const destinationData: any = {
        name: formData.name,
        city: formData.city,
        region: formData.region,
        country: formData.country,
        description: formData.description,
        popular: formData.popular,
        coordinates: formData.coordinates,
      }

      // Only include image if it's a valid URL
      if (formData.image && formData.image.trim() !== "") {
        destinationData.image = formData.image.trim()
      }

      if (editingDestination) {
        await updateDestination(editingDestination.$id, destinationData)
        toast({
          title: "Success",
          description: "Destination updated successfully",
        })
      } else {
        await createDestination(destinationData)
        toast({
          title: "Success",
          description: "Destination created successfully",
        })
      }

      setShowAddForm(false)
      setEditingDestination(null)
      resetForm()
      loadDestinations()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save destination",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      city: "",
      region: "",
      country: "Mali",
      description: "",
      image: "", // Change from null to empty string
      popular: false,
      coordinates: [],
    })
  }

  const handleEdit = (destination: any) => {
    setEditingDestination(destination)
    setFormData({
      name: destination.name || "",
      city: destination.city || "",
      region: destination.region || "",
      country: destination.country || "Mali",
      description: destination.description || "",
      image: destination.image || "", // Change from null to empty string
      popular: destination.popular || false,
      coordinates: destination.coordinates || [],
    })
    setShowAddForm(true)
  }

  const handleDelete = async (destinationId: string) => {
    if (confirm("Are you sure you want to delete this destination?")) {
      try {
        await deleteDestination(destinationId)
        toast({
          title: "Success",
          description: "Destination deleted successfully",
        })
        loadDestinations()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete destination",
          variant: "destructive",
        })
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#23282d]">Destinations Management</h1>
        </div>
        <div className="text-center py-8">Loading destinations...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#23282d]">Destinations Management</h1>
        <Button onClick={() => setShowAddForm(true)} className="bg-[#0073aa] hover:bg-[#005a87] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add New Destination
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingDestination ? "Edit Destination" : "Add New Destination"}</CardTitle>
            <CardDescription>
              {editingDestination ? "Update destination information" : "Create a new destination"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Destination Name</Label>
                  <Input
                    id="name"
                    placeholder="Gare Routière de Bamako"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Bamako"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    placeholder="Bamako"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="Mali"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Description of the destination..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="popular"
                  checked={formData.popular}
                  onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                />
                <Label htmlFor="popular">Popular Destination</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-[#0073aa] hover:bg-[#005a87]">
                  {editingDestination ? "Update Destination" : "Create Destination"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingDestination(null)
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

      {/* Destinations List */}
      <Card>
        <CardHeader>
          <CardTitle>All Destinations ({destinations.length})</CardTitle>
          <CardDescription>Manage your travel destinations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {destinations.length === 0 ? (
              <div className="text-center py-8 text-[#666]">
                No destinations found. Create your first destination to get started.
              </div>
            ) : (
              destinations.map((destination) => (
                <div key={destination.$id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-[#666]" />
                        <span className="font-medium text-lg">{destination.name}</span>
                        {destination.popular && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[#666] mb-2">
                        <div>
                          <span className="font-medium">City:</span> {destination.city}
                        </div>
                        <div>
                          <span className="font-medium">Region:</span> {destination.region}
                        </div>
                        <div>
                          <span className="font-medium">Country:</span> {destination.country}
                        </div>
                      </div>

                      {destination.description && (
                        <p className="text-sm text-[#666] mt-2 line-clamp-2">{destination.description}</p>
                      )}

                      {destination.image && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-[#666]">
                          <ImageIcon className="h-4 w-4" />
                          <span>Image available</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(destination)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(destination.$id)}
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
