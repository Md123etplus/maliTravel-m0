"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Smartphone } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { SeatSelector } from "@/components/seat-selector"
import { TripDetails } from "@/components/trip-details"
import { BookingSummary } from "@/components/booking-summary"
import { getTrips, getRoutes, getVehicles, getDestinations } from "@/lib/appwrite/admin"
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
  type: string
  capacity: number
  company: string
}

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  // State management
  const [trip, setTrip] = useState<Trip | null>(null)
  const [route, setRoute] = useState<Route | null>(null)
  const [originDestination, setOriginDestination] = useState<Destination | null>(null)
  const [destinationDestination, setDestinationDestination] = useState<Destination | null>(null)
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    idNumber: "",
    paymentMethod: "orange",
  })

  // Load trip data
  useEffect(() => {
    const loadTripData = async () => {
      try {
        setIsLoading(true)

        const [tripsData, routesData, vehiclesData, destinationsData] = await Promise.all([
          getTrips(),
          getRoutes(),
          getVehicles(),
          getDestinations(),
        ])

        // Find the specific trip and cast to our interface
        const tripDocument = tripsData.find((t: Models.Document) => t.$id === resolvedParams.id)
        if (!tripDocument) {
          throw new Error("Voyage non trouvé")
        }

        const tripData: Trip = {
          $id: tripDocument.$id,
          route_id: tripDocument.route_id as string,
          vehicle_id: tripDocument.vehicle_id as string,
          departure_time: tripDocument.departure_time as string,
          arrival_time: tripDocument.arrival_time as string,
          price: tripDocument.price as number,
          available_seats: tripDocument.available_seats as number,
          status: tripDocument.status as string,
        }

        setTrip(tripData)

        // Find associated route and cast to our interface
        const routeDocument = routesData.find((r: Models.Document) => r.$id === tripData.route_id)
        if (routeDocument) {
          const routeData: Route = {
            $id: routeDocument.$id,
            origin_id: routeDocument.origin_id as string,
            destination_id: routeDocument.destination_id as string,
            distance: routeDocument.distance as number,
            estimated_duration: routeDocument.estimated_duration as number,
          }

          setRoute(routeData)

          // Find destinations and cast to our interface
          const originDocument = destinationsData.find((d: Models.Document) => d.$id === routeData.origin_id)
          const destDocument = destinationsData.find((d: Models.Document) => d.$id === routeData.destination_id)

          if (originDocument) {
            const originDest: Destination = {
              $id: originDocument.$id,
              name: originDocument.name as string,
              city: originDocument.city as string,
              region: originDocument.region as string,
            }
            setOriginDestination(originDest)
          }

          if (destDocument) {
            const destDest: Destination = {
              $id: destDocument.$id,
              name: destDocument.name as string,
              city: destDocument.city as string,
              region: destDocument.region as string,
            }
            setDestinationDestination(destDest)
          }
        }

        // Find vehicle and cast to our interface
        const vehicleDocument = vehiclesData.find((v: Models.Document) => v.$id === tripData.vehicle_id)
        if (vehicleDocument) {
          const vehicleData: Vehicle = {
            $id: vehicleDocument.$id,
            type: vehicleDocument.type as string,
            capacity: vehicleDocument.capacity as number,
            company: vehicleDocument.company as string,
          }
          setVehicle(vehicleData)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails du voyage.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTripData()
  }, [resolvedParams.id, toast])

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle seat selection
  const handleSeatSelection = (seats: number[]) => {
    setSelectedSeats(seats)
  }

  // Handle payment confirmation
  const handleConfirmPayment = async () => {
    // Validation
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour effectuer une réservation.",
        variant: "destructive",
      })
      return
    }

    if (selectedSeats.length === 0) {
      toast({
        title: "Sélection de siège requise",
        description: "Veuillez sélectionner au moins un siège.",
        variant: "destructive",
      })
      return
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsProcessing(true)

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Build confirmation URL with all parameters
      const params = new URLSearchParams({
        seats: selectedSeats.join(","),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        idNumber: formData.idNumber.trim(),
        method: formData.paymentMethod,
      })

      // Redirect to confirmation page
      router.push(`/booking/${resolvedParams.id}/confirmation?${params.toString()}`)
    } catch (error) {
      console.error("Erreur lors du paiement:", error)
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors du traitement du paiement.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Get payment method info
  const getPaymentMethodInfo = () => {
    switch (formData.paymentMethod) {
      case "orange":
        return { icon: Smartphone, color: "text-orange-600", name: "Orange Money" }
      case "moov":
        return { icon: Smartphone, color: "text-blue-600", name: "Moov Money" }
      case "wave":
        return { icon: Smartphone, color: "text-teal-600", name: "Wave" }
      default:
        return { icon: CreditCard, color: "text-slate-600", name: "Carte bancaire" }
    }
  }

  const paymentInfo = getPaymentMethodInfo()
  const PaymentIcon = paymentInfo.icon

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium">Chargement des détails du voyage...</p>
        </div>
      </div>
    )
  }

  if (!trip || !originDestination || !destinationDestination) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Voyage non trouvé</h1>
          <p className="mt-2 text-slate-600">Le voyage que vous recherchez n'existe pas ou n'est plus disponible.</p>
          <Link href="/search" className="mt-4 inline-block">
            <Button>Rechercher d'autres voyages</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/search" className="inline-flex items-center text-amber-500 hover:text-amber-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la recherche
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Trip Details & Seat Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Details */}
          <TripDetails
            from={originDestination.city}
            to={destinationDestination.city}
            departureDateTime={trip.departure_time}
            arrivalDateTime={trip.arrival_time}
            price={trip.price}
            availableSeats={trip.available_seats}
            vehicleType={vehicle?.type || "Bus"}
            company={vehicle?.company || "Mali Travel Express"}
          />

          {/* Seat Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Sélection des sièges</CardTitle>
              <CardDescription>Choisissez vos sièges préférés</CardDescription>
            </CardHeader>
            <CardContent>
              <SeatSelector
                tripId={trip.$id}
                maxSeats={4}
                onSeatSelection={handleSeatSelection}
                selectedSeats={selectedSeats}
              />
            </CardContent>
          </Card>

          {/* Passenger Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations du passager</CardTitle>
              <CardDescription>Veuillez remplir vos informations personnelles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Votre nom complet"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+223 XX XX XX XX"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="idNumber">Numéro de pièce d'identité</Label>
                  <Input
                    id="idNumber"
                    value={formData.idNumber}
                    onChange={(e) => handleInputChange("idNumber", e.target.value)}
                    placeholder="Numéro CNI/Passeport"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Méthode de paiement</CardTitle>
              <CardDescription>Choisissez votre mode de paiement préféré</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => handleInputChange("paymentMethod", value)}
                className="grid gap-4 sm:grid-cols-2"
              >
                <div className="flex items-center space-x-2 rounded-lg border p-4">
                  <RadioGroupItem value="orange" id="orange" />
                  <Label htmlFor="orange" className="flex items-center space-x-2 cursor-pointer">
                    <Smartphone className="h-5 w-5 text-orange-600" />
                    <span>Orange Money</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border p-4">
                  <RadioGroupItem value="moov" id="moov" />
                  <Label htmlFor="moov" className="flex items-center space-x-2 cursor-pointer">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                    <span>Moov Money</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border p-4">
                  <RadioGroupItem value="wave" id="wave" />
                  <Label htmlFor="wave" className="flex items-center space-x-2 cursor-pointer">
                    <Smartphone className="h-5 w-5 text-teal-600" />
                    <span>Wave</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border p-4">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                    <CreditCard className="h-5 w-5 text-slate-600" />
                    <span>Carte bancaire</span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Booking Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <BookingSummary
              from={originDestination.city}
              to={destinationDestination.city}
              date={trip.departure_time.split("T")[0]}
              time={trip.departure_time.split("T")[1]?.substring(0, 5) || "N/A"}
              seats={selectedSeats}
              pricePerSeat={trip.price}
              serviceFee={1500}
              paymentMethod={paymentInfo.name}
            />

            <Separator className="my-6" />

            <Button
              onClick={handleConfirmPayment}
              disabled={selectedSeats.length === 0 || isProcessing || !formData.name.trim() || !formData.email.trim()}
              className="w-full bg-amber-500 hover:bg-amber-600"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Traitement en cours...
                </>
              ) : (
                <>
                  <PaymentIcon className={`mr-2 h-4 w-4 ${paymentInfo.color}`} />
                  Confirmer le paiement
                </>
              )}
            </Button>

            <p className="mt-4 text-center text-sm text-slate-600">
              En confirmant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
