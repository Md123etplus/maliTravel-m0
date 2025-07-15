"use client"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Users } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import ReviewDisplay from "@/components/review-display"
import {
  databases,
  DATABASE_ID,
  COLLECTION_TRIPS,
  COLLECTION_ROUTES,
  COLLECTION_DESTINATIONS,
  COLLECTION_VEHICLES,
} from "@/lib/appwrite/config"

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
  description: string
  image: string
}

interface Vehicle {
  $id: string
  name: string
  type: string
  capacity: number
  features: string[]
}

export default function TripDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { user } = useAuth()

  const [trip, setTrip] = useState<Trip | null>(null)
  const [route, setRoute] = useState<Route | null>(null)
  const [origin, setOrigin] = useState<Destination | null>(null)
  const [destination, setDestination] = useState<Destination | null>(null)
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTripData = async () => {
      try {
        setIsLoading(true)

        // Get trip
        const tripDoc = await databases.getDocument(DATABASE_ID, COLLECTION_TRIPS, resolvedParams.id)
        const tripData: Trip = {
          $id: tripDoc.$id,
          route_id: tripDoc.route_id as string,
          vehicle_id: tripDoc.vehicle_id as string,
          departure_time: tripDoc.departure_time as string,
          arrival_time: tripDoc.arrival_time as string,
          price: tripDoc.price as number,
          available_seats: tripDoc.available_seats as number,
          status: tripDoc.status as string,
        }
        setTrip(tripData)

        // Get route
        const routeDoc = await databases.getDocument(DATABASE_ID, COLLECTION_ROUTES, tripData.route_id)
        const routeData: Route = {
          $id: routeDoc.$id,
          origin_id: routeDoc.origin_id as string,
          destination_id: routeDoc.destination_id as string,
          distance: routeDoc.distance as number,
          estimated_duration: routeDoc.estimated_duration as number,
        }
        setRoute(routeData)

        // Get destinations
        const [originDoc, destinationDoc] = await Promise.all([
          databases.getDocument(DATABASE_ID, COLLECTION_DESTINATIONS, routeData.origin_id),
          databases.getDocument(DATABASE_ID, COLLECTION_DESTINATIONS, routeData.destination_id),
        ])

        setOrigin({
          $id: originDoc.$id,
          name: originDoc.name as string,
          city: originDoc.city as string,
          region: originDoc.region as string,
          description: originDoc.description as string,
          image: originDoc.image as string,
        })

        setDestination({
          $id: destinationDoc.$id,
          name: destinationDoc.name as string,
          city: destinationDoc.city as string,
          region: destinationDoc.region as string,
          description: destinationDoc.description as string,
          image: destinationDoc.image as string,
        })

        // Get vehicle
        const vehicleDoc = await databases.getDocument(DATABASE_ID, COLLECTION_VEHICLES, tripData.vehicle_id)
        setVehicle({
          $id: vehicleDoc.$id,
          name: vehicleDoc.name as string,
          type: vehicleDoc.type as string,
          capacity: vehicleDoc.capacity as number,
          features: vehicleDoc.features as string[],
        })
      } catch (error) {
        console.error("Error loading trip data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTripData()
  }, [resolvedParams.id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (!trip || !origin || !destination || !vehicle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Voyage non trouvé</h1>
          <Link href="/search">
            <Button>Retour à la recherche</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/search" className="inline-flex items-center text-amber-500 hover:text-amber-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la recherche
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {origin.city} → {destination.city}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {new Date(trip.departure_time).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </div>
                <Badge variant={trip.status === "planifié" ? "default" : "secondary"}>{trip.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-medium">Départ</p>
                    <p className="text-sm text-slate-600">{trip.departure_time.split("T")[1]?.substring(0, 5)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-medium">Arrivée</p>
                    <p className="text-sm text-slate-600">{trip.arrival_time.split("T")[1]?.substring(0, 5)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-medium">Places disponibles</p>
                    <p className="text-sm text-slate-600">{trip.available_seats} places</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Info */}
          <Card>
            <CardHeader>
              <CardTitle>Véhicule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Type:</strong> {vehicle.type}
                </p>
                <p>
                  <strong>Nom:</strong> {vehicle.name}
                </p>
                <p>
                  <strong>Capacité:</strong> {vehicle.capacity} places
                </p>
                {vehicle.features && vehicle.features.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">Équipements:</p>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.features.map((feature, index) => (
                        <Badge key={index} variant="outline">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <ReviewDisplay tripId={trip.$id} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <Card>
              <CardHeader>
                <CardTitle>Réserver ce voyage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-600">{trip.price.toLocaleString()} FCFA</p>
                  <p className="text-sm text-slate-600">par personne</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Distance:</span>
                    <span>{route?.distance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Durée estimée:</span>
                    <span>{route?.estimated_duration}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Places disponibles:</span>
                    <span>{trip.available_seats}</span>
                  </div>
                </div>

                <Link href={`/booking/${trip.$id}`} className="w-full">
                  <Button
                    className="w-full bg-amber-500 hover:bg-amber-600"
                    size="lg"
                    disabled={trip.available_seats === 0 || trip.status !== "planifié"}
                  >
                    {trip.available_seats === 0 ? "Complet" : "Réserver maintenant"}
                  </Button>
                </Link>

                {!user && (
                  <p className="text-xs text-center text-slate-500">
                    <Link href="/login" className="text-amber-600 hover:underline">
                      Connectez-vous
                    </Link>{" "}
                    pour réserver ce voyage
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
