"use client"

import { useState, useEffect, use, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TicketTemplate } from "@/components/ticket-template"
import { Check, Download, ArrowLeft, Share2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { getTrips, getRoutes, getVehicles, getDestinations } from "@/lib/appwrite/admin"
import {
  databases,
  DATABASE_ID,
  COLLECTION_BOOKINGS,
  COLLECTION_BOOKING_SEATS,
  COLLECTION_PAYMENTS,
  ID,
} from "@/lib/appwrite/config"
import { Query } from "appwrite"
import type { Models } from "appwrite"

interface Trip {
  $id: string
  route_id: string
  vehicle_id: string
  departure_time: string
  arrival_time: string
  price: number
}

interface Route {
  $id: string
  origin_id: string
  destination_id: string
}

interface Destination {
  $id: string
  name: string
  city: string
}

interface Vehicle {
  $id: string
  type: string
}

export default function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user } = useAuth()
  const ticketRef = useRef<HTMLDivElement>(null)

  // Use refs to prevent duplicate executions - these persist across re-renders
  const isProcessingRef = useRef(false)
  const hasProcessedRef = useRef(false)
  const bookingCreatedRef = useRef(false)

  // State management
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [bookingId, setBookingId] = useState<string>("")
  const [paymentId, setPaymentId] = useState<string>("")
  const [trip, setTrip] = useState<Trip | null>(null)
  const [route, setRoute] = useState<Route | null>(null)
  const [originDestination, setOriginDestination] = useState<Destination | null>(null)
  const [destinationDestination, setDestinationDestination] = useState<Destination | null>(null)
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Extract parameters from URL - memoize to prevent changes
  const bookingParams = useRef({
    seats: searchParams?.get("seats")?.split(",") || [],
    name: searchParams?.get("name") || "Passager",
    email: searchParams?.get("email") || "",
    phone: searchParams?.get("phone") || "",
    idNumber: searchParams?.get("idNumber") || "",
    paymentMethod: searchParams?.get("method") || "orange",
  }).current

  console.log("Confirmation page render:", {
    tripId: resolvedParams.id,
    isProcessing: isProcessingRef.current,
    hasProcessed: hasProcessedRef.current,
    bookingCreated: bookingCreatedRef.current,
    hasUser: !!user,
    ...bookingParams,
  })

  // Load trip data and create booking (only once)
  useEffect(() => {
    // Multiple layers of protection against duplicate execution
    if (
      isProcessingRef.current ||
      hasProcessedRef.current ||
      bookingCreatedRef.current ||
      !user ||
      bookingParams.seats.length === 0 ||
      !bookingParams.name.trim()
    ) {
      console.log("Skipping booking creation - protection triggered:", {
        isProcessing: isProcessingRef.current,
        hasProcessed: hasProcessedRef.current,
        bookingCreated: bookingCreatedRef.current,
        hasUser: !!user,
        hasSeats: bookingParams.seats.length > 0,
        hasName: !!bookingParams.name.trim(),
      })

      // If we have a user but haven't loaded trip data, load it without creating booking
      if (user && !hasProcessedRef.current && !trip) {
        loadTripDataOnly()
      }
      return
    }

    const createBookingAndLoadData = async () => {
      // Set processing flag immediately to prevent concurrent executions
      if (isProcessingRef.current) {
        console.log("Already processing, skipping...")
        return
      }

      isProcessingRef.current = true
      hasProcessedRef.current = true

      try {
        setIsLoading(true)
        console.log("Starting booking creation process...")

        // Load trip data first
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
        }

        console.log("Trip data loaded:", tripData)
        setTrip(tripData)

        // Find associated route and cast to our interface
        const routeDocument = routesData.find((r: Models.Document) => r.$id === tripData.route_id)
        if (routeDocument) {
          const routeData: Route = {
            $id: routeDocument.$id,
            origin_id: routeDocument.origin_id as string,
            destination_id: routeDocument.destination_id as string,
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
            }
            setOriginDestination(originDest)
          }

          if (destDocument) {
            const destDest: Destination = {
              $id: destDocument.$id,
              name: destDocument.name as string,
              city: destDocument.city as string,
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
          }
          setVehicle(vehicleData)
        }

        // Check if booking already exists for this user and trip to prevent duplicates
        console.log("Checking for existing bookings...")
        const existingBookingsResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_BOOKINGS, [
          Query.equal("user_id", user.$id),
          Query.equal("trip_id", resolvedParams.id),
        ])

        if (existingBookingsResponse.documents.length > 0) {
          console.log("Booking already exists, using existing booking:", existingBookingsResponse.documents[0].$id)
          setBookingId(existingBookingsResponse.documents[0].$id)
          bookingCreatedRef.current = true

          // Check for existing payment
          const existingPaymentResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_PAYMENTS, [
            Query.equal("booking_id", existingBookingsResponse.documents[0].$id),
          ])

          if (existingPaymentResponse.documents.length > 0) {
            setPaymentId(existingPaymentResponse.documents[0].$id)
          }

          toast({
            title: "Réservation existante",
            description: "Votre réservation a déjà été confirmée.",
          })
          return
        }

        // Double-check that we haven't already created a booking
        if (bookingCreatedRef.current) {
          console.log("Booking already created in this session, skipping...")
          return
        }

        // Create new booking in database
        const totalPrice = tripData.price * bookingParams.seats.length + 1500 // Price + service fee

        // Create a unique identifier for this booking session to prevent duplicates
        const sessionId = `${user.$id}_${resolvedParams.id}_${Date.now()}`

        const bookingData = {
          user_id: user.$id,
          trip_id: resolvedParams.id,
          booking_date: new Date().toISOString(),
          trip_type: "aller simple",
          total_price: totalPrice,
          status: "confirmé",
          payment_status: "paid",
        }

        console.log("Creating new booking with data:", bookingData, "Session ID:", sessionId)

        const booking = await databases.createDocument(DATABASE_ID, COLLECTION_BOOKINGS, ID.unique(), bookingData)
        console.log("Booking created successfully:", booking.$id)

        setBookingId(booking.$id)
        bookingCreatedRef.current = true // Mark as created

        // Create payment record
        const paymentData = {
          booking_id: booking.$id,
          amount: totalPrice,
          payment_method: getPaymentMethodName(bookingParams.paymentMethod),
          transaction_id: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: "paid",
          payment_date: new Date().toISOString(),
        }

        console.log("Creating payment record with data:", paymentData)

        const payment = await databases.createDocument(DATABASE_ID, COLLECTION_PAYMENTS, ID.unique(), paymentData)
        console.log("Payment created successfully:", payment.$id)

        setPaymentId(payment.$id)

        // Create seat bookings
        for (const seat of bookingParams.seats) {
          const seatData = {
            booking_id: booking.$id,
            seat_id: `seat_${seat}`,
            passenger_name: bookingParams.name.trim(),
            passenger_id_type: "CNI",
            passenger_id_number: bookingParams.idNumber.trim() || "TEMP123456",
          }

          console.log("Creating seat booking:", seatData)
          await databases.createDocument(DATABASE_ID, COLLECTION_BOOKING_SEATS, ID.unique(), seatData)
        }

        toast({
          title: "Réservation confirmée",
          description: "Votre réservation a été enregistrée avec succès.",
        })
      } catch (error) {
        console.error("Erreur lors de la création de la réservation:", error)
        // Reset flags on error to allow retry
        isProcessingRef.current = false
        hasProcessedRef.current = false
        bookingCreatedRef.current = false
        toast({
          title: "Erreur",
          description: `Une erreur est survenue lors de la confirmation de votre réservation: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
        isProcessingRef.current = false // Reset processing flag
      }
    }

    createBookingAndLoadData()
  }, [user, resolvedParams.id]) // Only depend on user ID and trip ID

  // Separate function to load trip data only (without creating booking)
  const loadTripDataOnly = async () => {
    if (hasProcessedRef.current) return // Prevent multiple data loads

    try {
      setIsLoading(true)
      hasProcessedRef.current = true

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
      }

      setTrip(tripData)

      // Find associated route and cast to our interface
      const routeDocument = routesData.find((r: Models.Document) => r.$id === tripData.route_id)
      if (routeDocument) {
        const routeData: Route = {
          $id: routeDocument.$id,
          origin_id: routeDocument.origin_id as string,
          destination_id: routeDocument.destination_id as string,
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
          }
          setOriginDestination(originDest)
        }

        if (destDocument) {
          const destDest: Destination = {
            $id: destDocument.$id,
            name: destDocument.name as string,
            city: destDocument.city as string,
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
        }
        setVehicle(vehicleData)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to get payment method name
  const getPaymentMethodName = (method: string): string => {
    switch (method) {
      case "orange":
        return "Orange Money"
      case "moov":
        return "Moov Money"
      case "wave":
        return "Wave"
      default:
        return "Carte bancaire"
    }
  }

  // Send confirmation email (simulated) - only after booking is created
  useEffect(() => {
    if (!isLoading && bookingId && bookingCreatedRef.current) {
      const timer = setTimeout(() => {
        toast({
          title: "Email de confirmation envoyé",
          description: "Un email contenant les détails de votre réservation a été envoyé à votre adresse email.",
        })
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [toast, isLoading, bookingId])

  const handleDownloadTicket = async () => {
    if (!ticketRef.current) return

    try {
      setIsGeneratingPDF(true)

      // Dynamically import html2canvas and jsPDF to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default
      const jsPDF = (await import("jspdf")).default

      // Generate canvas from the ticket element
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: ticketRef.current.scrollWidth,
        height: ticketRef.current.scrollHeight,
      })

      // Create PDF
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Calculate dimensions to fit the page
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Add image to PDF
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

      // Download the PDF
      const fileName = `billet_${bookingId || "mali_travel"}_${new Date().getTime()}.pdf`
      pdf.save(fileName)

      toast({
        title: "Billet téléchargé",
        description: "Votre billet a été téléchargé avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement du billet. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleShareTicket = async () => {
    if (!ticketRef.current) return

    try {
      const html2canvas = (await import("html2canvas")).default

      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      })

      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error("Impossible de créer l'image du billet")
        }

        const file = new File([blob], `billet_${bookingId || "mali_travel"}.png`, { type: "image/png" })

        if (navigator.share) {
          await navigator.share({
            title: "Mon billet Mali Travel",
            text: `Billet de voyage de ${originDestination?.city} à ${destinationDestination?.city}`,
            files: [file],
          })
        } else {
          // Fallback: create download link for the image
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `billet_${bookingId || "mali_travel"}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)

          toast({
            title: "Image téléchargée",
            description: "L'image de votre billet a été téléchargée.",
          })
        }
      }, "image/png")
    } catch (error) {
      console.error("Erreur lors du partage du billet:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du partage du billet. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  // Get payment method info
  const getPaymentMethodInfo = () => {
    switch (bookingParams.paymentMethod) {
      case "orange":
        return { color: "text-orange-600", bgColor: "bg-orange-100", name: "Orange Money" }
      case "moov":
        return { color: "text-blue-600", bgColor: "bg-blue-100", name: "Moov Money" }
      case "wave":
        return { color: "text-teal-600", bgColor: "bg-teal-100", name: "Wave" }
      default:
        return { color: "text-slate-600", bgColor: "bg-slate-100", name: "Carte bancaire" }
    }
  }

  const paymentInfo = getPaymentMethodInfo()

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium">Finalisation de votre réservation...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (!trip || !originDestination || !destinationDestination) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Erreur</h1>
          <p className="mt-2 text-slate-600">Impossible de charger les détails de votre réservation.</p>
          <Link href="/" className="mt-4 inline-block">
            <Button>Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Success state
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-amber-500 hover:text-amber-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Link>
      </div>

      <div className="mx-auto max-w-3xl">
        {/* Success message */}
        <Card className="mb-8 border-green-100 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-green-800">Réservation confirmée !</h2>
                <p className="text-green-700">Votre paiement a été traité avec succès via {paymentInfo.name}.</p>
                {paymentId && <p className="text-sm text-green-600">ID de paiement: {paymentId}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Détails de la réservation</CardTitle>
            <CardDescription>
              Référence de réservation: {bookingId || `${trip.$id}-${Math.floor(Math.random() * 10000)}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div ref={ticketRef}>
                <TicketTemplate
                  name={bookingParams.name}
                  from={originDestination.city}
                  to={destinationDestination.city}
                  date={trip.departure_time.split("T")[0]}
                  time={trip.departure_time.split("T")[1]?.substring(0, 5) || "N/A"}
                  seats={bookingParams.seats}
                  ticketId={bookingId || `${trip.$id}-${Math.floor(Math.random() * 10000)}`}
                  company="Mali Travel Express"
                  vehicleType={vehicle?.type || "Bus"}
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <Button
                  onClick={handleDownloadTicket}
                  className="flex-1 bg-amber-500 hover:bg-amber-600"
                  disabled={isGeneratingPDF}
                >
                  {isGeneratingPDF ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger le PDF
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleShareTicket} className="flex-1 bg-transparent">
                  <Share2 className="mr-2 h-4 w-4" />
                  Partager le billet
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important information */}
        <div className="space-y-4 rounded-md bg-amber-50 p-6">
          <h3 className="text-lg font-semibold text-amber-800">Informations importantes</h3>
          <ul className="ml-6 list-disc space-y-2 text-amber-700">
            <li>Veuillez vous présenter au moins 30 minutes avant le départ.</li>
            <li>N'oubliez pas votre pièce d'identité pour l'embarquement.</li>
            <li>Vous pouvez emporter un bagage à main et un bagage en soute.</li>
            <li>En cas d'annulation, veuillez nous contacter au moins 24h à l'avance.</li>
          </ul>
          <div className="mt-4">
            <p className="font-medium text-amber-800">Besoin d'aide ?</p>
            <p className="text-amber-700">
              Contactez notre service client au +223 XX XX XX XX ou par email à support@malivoyages.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
