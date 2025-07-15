"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, MapPin, Clock, Users, Star, Search } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { getTrips, getRoutes, getDestinations, getVehicles } from "@/lib/appwrite/admin"
import { databases, DATABASE_ID, COLLECTION_REVIEWS } from "@/lib/appwrite/config"
import { Query } from "appwrite"
import type { Models } from "appwrite"

interface Trip {
  $id: string
  route_id: string
  vehicle_id: string
  departure_time: string
  arrival_time: string
  price: number
  available_seats: number
  status: string
}

interface Route {
  $id: string
  origin_id: string
  destination_id: string
  distance: number
  estimated_duration: number
}

interface Destination {
  $id: string
  name: string
  city: string
  region: string
}

interface Vehicle {
  $id: string
  name: string
  type: string
  capacity: number
}

interface TripWithDetails extends Trip {
  route: Route & {
    origin: Destination
    destination: Destination
  }
  vehicle: Vehicle
  averageRating?: number
  reviewCount?: number
}

function SearchContent() {
  const searchParams = useSearchParams()

  // Search filters
  const [origin, setOrigin] = useState(searchParams.get("from") || "all")
  const [destination, setDestination] = useState(searchParams.get("to") || "all")
  const [date, setDate] = useState<Date | undefined>(
    searchParams.get("date") ? new Date(searchParams.get("date")!) : undefined,
  )
  const [passengers, setPassengers] = useState(searchParams.get("passengers") || "1")
  const [priceRange, setPriceRange] = useState("all")
  const [vehicleType, setVehicleType] = useState("all")

  // Data
  const [trips, setTrips] = useState<TripWithDetails[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasSearched, setHasSearched] = useState(false)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [tripsData, routesData, destinationsData, vehiclesData] = await Promise.all([
          getTrips(),
          getRoutes(),
          getDestinations(),
          getVehicles(),
        ])

        setDestinations(destinationsData as unknown as Destination[])

        // Process trips with details
        const tripsWithDetails: TripWithDetails[] = []

        for (const tripDoc of tripsData) {
          const trip: Trip = {
            $id: tripDoc.$id,
            route_id: tripDoc.route_id as string,
            vehicle_id: tripDoc.vehicle_id as string,
            departure_time: tripDoc.departure_time as string,
            arrival_time: tripDoc.arrival_time as string,
            price: tripDoc.price as number,
            available_seats: tripDoc.available_seats as number,
            status: tripDoc.status as string,
          }

          // Find route
          const routeDoc = routesData.find((r: Models.Document) => r.$id === trip.route_id)
          if (!routeDoc) continue

          const route: Route = {
            $id: routeDoc.$id,
            origin_id: routeDoc.origin_id as string,
            destination_id: routeDoc.destination_id as string,
            distance: routeDoc.distance as number,
            estimated_duration: routeDoc.estimated_duration as number,
          }

          // Find destinations
          const originDest = destinationsData.find((d: Models.Document) => d.$id === route.origin_id)
          const destDest = destinationsData.find((d: Models.Document) => d.$id === route.destination_id)
          if (!originDest || !destDest) continue

          // Find vehicle
          const vehicleDoc = vehiclesData.find((v: Models.Document) => v.$id === trip.vehicle_id)
          if (!vehicleDoc) continue

          const vehicle: Vehicle = {
            $id: vehicleDoc.$id,
            name: vehicleDoc.name as string,
            type: vehicleDoc.type as string,
            capacity: vehicleDoc.capacity as number,
          }

          // Get reviews for this trip
          try {
            const reviewsResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_REVIEWS, [
              Query.equal("trip_id", trip.$id),
            ])

            let averageRating = 0
            const reviewCount = reviewsResponse.total

            if (reviewCount > 0) {
              const sum = reviewsResponse.documents.reduce((acc, review) => acc + (review.rating as number), 0)
              averageRating = sum / reviewCount
            }

            tripsWithDetails.push({
              ...trip,
              route: {
                ...route,
                origin: {
                  $id: originDest.$id,
                  name: originDest.name as string,
                  city: originDest.city as string,
                  region: originDest.region as string,
                },
                destination: {
                  $id: destDest.$id,
                  name: destDest.name as string,
                  city: destDest.city as string,
                  region: destDest.region as string,
                },
              },
              vehicle,
              averageRating,
              reviewCount,
            })
          } catch (error) {
            // If reviews fail, still add the trip without rating
            tripsWithDetails.push({
              ...trip,
              route: {
                ...route,
                origin: {
                  $id: originDest.$id,
                  name: originDest.name as string,
                  city: originDest.city as string,
                  region: originDest.region as string,
                },
                destination: {
                  $id: destDest.$id,
                  name: destDest.name as string,
                  city: destDest.city as string,
                  region: destDest.region as string,
                },
              },
              vehicle,
              averageRating: 0,
              reviewCount: 0,
            })
          }
        }

        setTrips(tripsWithDetails)

        // If we have search params, perform initial search
        if (searchParams.get("from") || searchParams.get("to") || searchParams.get("date")) {
          setHasSearched(true)
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [searchParams])

  // Filter trips based on search criteria
  const filteredTrips = trips.filter((trip) => {
    // Origin filter
    if (origin !== "all" && trip.route.origin.city !== origin) {
      return false
    }

    // Destination filter
    if (destination !== "all" && trip.route.destination.city !== destination) {
      return false
    }

    // Date filter
    if (date) {
      const tripDate = new Date(trip.departure_time).toDateString()
      const searchDate = date.toDateString()
      if (tripDate !== searchDate) {
        return false
      }
    }

    // Passengers filter
    const passengerCount = Number.parseInt(passengers)
    if (trip.available_seats < passengerCount) {
      return false
    }

    // Price filter
    if (priceRange !== "all") {
      const price = trip.price
      switch (priceRange) {
        case "low":
          if (price > 15000) return false
          break
        case "medium":
          if (price <= 15000 || price > 30000) return false
          break
        case "high":
          if (price <= 30000) return false
          break
      }
    }

    // Vehicle type filter
    if (vehicleType !== "all" && trip.vehicle.type !== vehicleType) {
      return false
    }

    return true
  })

  const handleSearch = () => {
    setHasSearched(true)
  }

  // Get unique cities for origin and destination dropdowns
  const originCities = Array.from(new Set(destinations.map((d) => d.city))).sort()
  const destinationCities = Array.from(new Set(destinations.map((d) => d.city))).sort()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Rechercher un voyage</h1>
        <p className="text-slate-600">Trouvez le voyage parfait pour votre destination</p>
      </div>

      {/* Search Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Recherche de voyages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label htmlFor="origin">Ville de départ</Label>
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la ville de départ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {originCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="destination">Ville d'arrivée</Label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la ville d'arrivée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {destinationCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date de départ</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="passengers">Nombre de passagers</Label>
              <Select value={passengers} onValueChange={setPassengers}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} passager{num > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mt-4">
            <div>
              <Label>Gamme de prix</Label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les prix</SelectItem>
                  <SelectItem value="low">Moins de 15 000 FCFA</SelectItem>
                  <SelectItem value="medium">15 000 - 30 000 FCFA</SelectItem>
                  <SelectItem value="high">Plus de 30 000 FCFA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type de véhicule</Label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="bus">Bus</SelectItem>
                  <SelectItem value="minibus">Minibus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full bg-amber-500 hover:bg-amber-600">
                <Search className="mr-2 h-4 w-4" />
                Rechercher
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {hasSearched && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {filteredTrips.length > 0
                ? `${filteredTrips.length} voyage${filteredTrips.length > 1 ? "s" : ""} trouvé${filteredTrips.length > 1 ? "s" : ""}`
                : "Aucun voyage trouvé"}
            </h2>
          </div>

          {filteredTrips.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucun voyage correspondant</h3>
                <p className="text-slate-600 mb-6">
                  Nous n'avons trouvé aucun voyage correspondant à vos critères de recherche.
                </p>
                <div className="space-y-2 text-sm text-slate-500">
                  <p>Suggestions :</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Essayez des dates différentes</li>
                    <li>Modifiez vos villes de départ ou d'arrivée</li>
                    <li>Élargissez vos critères de recherche</li>
                  </ul>
                </div>

                {/* Show available trips anyway */}
                {trips.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-medium mb-4">Voyages disponibles</h4>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {trips.slice(0, 6).map((trip) => (
                        <Card key={trip.$id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">
                                {trip.route.origin.city} → {trip.route.destination.city}
                              </h5>
                              {(trip.reviewCount??0) > 0 && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                  <span className="text-xs">{trip.averageRating?.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mb-2">
                              {new Date(trip.departure_time).toLocaleDateString("fr-FR")}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-600">{trip.price.toLocaleString()} FCFA</span>
                              <Link href={`/booking/${trip.$id}`}>
                                <Button size="sm" variant="outline">
                                  Voir
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredTrips.map((trip) => (
                <Card key={trip.$id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold">{trip.departure_time.split("T")[1]?.substring(0, 5)}</p>
                            <p className="text-sm text-slate-600">{trip.route.origin.city}</p>
                          </div>
                          <div className="flex-1 text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <div className="h-px bg-slate-300 flex-1"></div>
                              <Clock className="h-4 w-4 text-slate-400" />
                              <div className="h-px bg-slate-300 flex-1"></div>
                            </div>
                            <p className="text-xs text-slate-500">{trip.route.estimated_duration}h de voyage</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">{trip.arrival_time.split("T")[1]?.substring(0, 5)}</p>
                            <p className="text-sm text-slate-600">{trip.route.destination.city}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{trip.available_seats} places disponibles</span>
                          </div>
                          <Badge variant="outline">{trip.vehicle.type}</Badge>
                          <Badge variant={trip.status === "planifié" ? "default" : "secondary"}>{trip.status}</Badge>
                          {(trip.reviewCount??0) > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span>
                                {trip.averageRating?.toFixed(1)} ({trip.reviewCount} avis)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right ml-6">
                        <p className="text-3xl font-bold text-amber-600 mb-2">{trip.price.toLocaleString()} FCFA</p>
                        <p className="text-sm text-slate-600 mb-4">par personne</p>
                        <div className="space-y-2">
                          <Link href={`/trips/${trip.$id}`}>
                            <Button variant="outline" className="w-full bg-transparent">
                              Voir détails
                            </Button>
                          </Link>
                          <Link href={`/booking/${trip.$id}`}>
                            <Button
                              className="w-full bg-amber-500 hover:bg-amber-600"
                              disabled={trip.available_seats === 0 || trip.status !== "planifié"}
                            >
                              {trip.available_seats === 0 ? "Complet" : "Réserver"}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
