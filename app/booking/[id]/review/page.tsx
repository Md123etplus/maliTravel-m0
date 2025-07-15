"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Star, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import {
  databases,
  DATABASE_ID,
  COLLECTION_REVIEWS,
  COLLECTION_BOOKINGS,
  COLLECTION_TRIPS,
  COLLECTION_ROUTES,
  COLLECTION_DESTINATIONS,
  ID,
} from "@/lib/appwrite/config"
import { Query } from "appwrite"

interface Trip {
  $id: string
  route_id: string
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

interface Booking {
  $id: string
  user_id: string
  trip_id: string
  status: string
}

interface Review {
  $id: string
  user_id: string
  trip_id: string
  rating: number
  comment: string
  created_at: string
}

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  // State
  const [booking, setBooking] = useState<Booking | null>(null)
  const [trip, setTrip] = useState<Trip | null>(null)
  const [route, setRoute] = useState<Route | null>(null)
  const [origin, setOrigin] = useState<Destination | null>(null)
  const [destination, setDestination] = useState<Destination | null>(null)
  const [existingReview, setExistingReview] = useState<Review | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")

  // Load booking and trip data
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour laisser un avis.",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      try {
        setIsLoading(true)
        console.log("Loading booking data for ID:", resolvedParams.id)

        // Get booking
        const bookingDoc = await databases.getDocument(DATABASE_ID, COLLECTION_BOOKINGS, resolvedParams.id)
        const bookingData: Booking = {
          $id: bookingDoc.$id,
          user_id: bookingDoc.user_id as string,
          trip_id: bookingDoc.trip_id as string,
          status: bookingDoc.status as string,
        }

        // Verify booking ownership
        if (bookingData.user_id !== user.$id) {
          toast({
            title: "Accès refusé",
            description: "Vous ne pouvez laisser un avis que pour vos propres réservations.",
            variant: "destructive",
          })
          router.push("/account")
          return
        }

        setBooking(bookingData)

        // Get trip
        const tripDoc = await databases.getDocument(DATABASE_ID, COLLECTION_TRIPS, bookingData.trip_id)
        const tripData: Trip = {
          $id: tripDoc.$id,
          route_id: tripDoc.route_id as string,
          departure_time: tripDoc.departure_time as string,
          arrival_time: tripDoc.arrival_time as string,
          price: tripDoc.price as number,
        }
        setTrip(tripData)

        // Get route
        const routeDoc = await databases.getDocument(DATABASE_ID, COLLECTION_ROUTES, tripData.route_id)
        const routeData: Route = {
          $id: routeDoc.$id,
          origin_id: routeDoc.origin_id as string,
          destination_id: routeDoc.destination_id as string,
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
        })

        setDestination({
          $id: destinationDoc.$id,
          name: destinationDoc.name as string,
          city: destinationDoc.city as string,
        })

        // Check for existing review
        const reviewsResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_REVIEWS, [
          Query.equal("user_id", user.$id),
          Query.equal("trip_id", bookingData.trip_id),
        ])

        if (reviewsResponse.documents.length > 0) {
          const existingReviewDoc = reviewsResponse.documents[0]
          const reviewData: Review = {
            $id: existingReviewDoc.$id,
            user_id: existingReviewDoc.user_id as string,
            trip_id: existingReviewDoc.trip_id as string,
            rating: existingReviewDoc.rating as number,
            comment: existingReviewDoc.comment as string,
            created_at: existingReviewDoc.created_at as string,
          }
          setExistingReview(reviewData)
          setRating(reviewData.rating)
          setComment(reviewData.comment)
        }

        console.log("Data loaded successfully")
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de la réservation.",
          variant: "destructive",
        })
        router.push("/account")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [resolvedParams.id, user, router, toast])

  // Handle star click
  const handleStarClick = (starRating: number) => {
    console.log("Star clicked:", starRating)
    setRating(starRating)
  }

  // Handle review submission
  const handleSubmit = async () => {
    console.log("Submit button clicked")
    console.log("Current state:", { rating, comment: comment.length, user: user?.$id })

    if (!user || !booking || !trip) {
      console.log("Missing required data")
      return
    }

    if (rating === 0) {
      toast({
        title: "Note requise",
        description: "Veuillez sélectionner une note avant de publier votre avis.",
        variant: "destructive",
      })
      return
    }

    if (comment.trim().length < 10) {
      toast({
        title: "Commentaire trop court",
        description: "Votre commentaire doit contenir au moins 10 caractères.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      console.log("Starting review submission...")

      const reviewData = {
        user_id: user.$id,
        trip_id: booking.trip_id,
        rating: rating,
        comment: comment.trim(),
        created_at: new Date().toISOString(),
      }

      console.log("Review data to submit:", reviewData)

      let result
      if (existingReview) {
        // Update existing review
        console.log("Updating existing review:", existingReview.$id)
        result = await databases.updateDocument(DATABASE_ID, COLLECTION_REVIEWS, existingReview.$id, {
          rating: reviewData.rating,
          comment: reviewData.comment,
          created_at: reviewData.created_at,
        })
        console.log("Review updated successfully:", result)
      } else {
        // Create new review
        console.log("Creating new review...")
        result = await databases.createDocument(DATABASE_ID, COLLECTION_REVIEWS, ID.unique(), reviewData)
        console.log("Review created successfully:", result)
      }

      toast({
        title: "Avis publié",
        description: existingReview
          ? "Votre avis a été mis à jour avec succès."
          : "Votre avis a été publié avec succès.",
      })

      // Redirect to account page
      router.push("/account")
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la publication de votre avis.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Chargement des détails de la réservation...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!booking || !trip || !origin || !destination) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Réservation non trouvée</h1>
          <p className="text-slate-600 mb-6">
            La réservation que vous recherchez n'existe pas ou vous n'y avez pas accès.
          </p>
          <Link href="/account">
            <Button>Retour au compte</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/account" className="inline-flex items-center text-amber-500 hover:text-amber-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au compte
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{existingReview ? "Modifier votre avis" : "Laisser un avis"}</CardTitle>
          <CardDescription>Partagez votre expérience de voyage pour aider d'autres voyageurs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trip Details */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Détails du voyage</h3>
            <div className="text-sm text-slate-600 space-y-1">
              <p>
                <strong>Trajet:</strong> {origin.city} → {destination.city}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(trip.departure_time).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p>
                <strong>Heure:</strong> {trip.departure_time.split("T")[1]?.substring(0, 5)}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-3">Note générale *</label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300 hover:text-amber-300"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-slate-600">
                  {rating === 1 && "Décevant"}
                  {rating === 2 && "Moyen"}
                  {rating === 3 && "Bien"}
                  {rating === 4 && "Très bien"}
                  {rating === 5 && "Excellent"}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-2">
              Votre commentaire *
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Décrivez votre expérience de voyage (confort, ponctualité, service, etc.)"
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-slate-500 mt-1">{comment.length}/500 caractères (minimum 10)</p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Link href="/account">
              <Button variant="outline">Annuler</Button>
            </Link>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || comment.trim().length < 10 || isSubmitting}
              className="bg-amber-500 hover:bg-amber-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publication...
                </>
              ) : existingReview ? (
                "Mettre à jour l'avis"
              ) : (
                "Publier l'avis"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
