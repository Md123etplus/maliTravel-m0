"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Edit, Trash2, MapPin, Calendar, Loader2 } from "lucide-react"
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
} from "@/lib/appwrite/config"
import { Query } from "appwrite"

interface Review {
  $id: string
  user_id: string
  trip_id: string
  rating: number
  comment: string
  created_at: string
}

interface ReviewWithTrip extends Review {
  trip?: {
    $id: string
    departure_time: string
    route: {
      origin: { city: string }
      destination: { city: string }
    }
  }
  booking_id?: string
}

export default function ReviewsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [reviews, setReviews] = useState<ReviewWithTrip[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadReviews = async () => {
      if (!user) return

      try {
        setIsLoading(true)

        // Get user's reviews
        const reviewsResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_REVIEWS, [
          Query.equal("user_id", user.$id),
          Query.orderDesc("created_at"),
        ])

        const reviewsWithTrips: ReviewWithTrip[] = []

        for (const reviewDoc of reviewsResponse.documents) {
          const review: Review = {
            $id: reviewDoc.$id,
            user_id: reviewDoc.user_id as string,
            trip_id: reviewDoc.trip_id as string,
            rating: reviewDoc.rating as number,
            comment: reviewDoc.comment as string,
            created_at: reviewDoc.created_at as string,
          }

          try {
            // Get trip details
            const tripDoc = await databases.getDocument(DATABASE_ID, COLLECTION_TRIPS, review.trip_id)
            const routeDoc = await databases.getDocument(DATABASE_ID, COLLECTION_ROUTES, tripDoc.route_id as string)
            const [originDoc, destinationDoc] = await Promise.all([
              databases.getDocument(DATABASE_ID, COLLECTION_DESTINATIONS, routeDoc.origin_id as string),
              databases.getDocument(DATABASE_ID, COLLECTION_DESTINATIONS, routeDoc.destination_id as string),
            ])

            // Find booking ID for this trip
            const bookingsResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_BOOKINGS, [
              Query.equal("user_id", user.$id),
              Query.equal("trip_id", review.trip_id),
            ])

            reviewsWithTrips.push({
              ...review,
              trip: {
                $id: tripDoc.$id,
                departure_time: tripDoc.departure_time as string,
                route: {
                  origin: { city: originDoc.city as string },
                  destination: { city: destinationDoc.city as string },
                },
              },
              booking_id: bookingsResponse.documents[0]?.$id,
            })
          } catch (error) {
            // If trip details can't be loaded, still show the review
            reviewsWithTrips.push(review)
          }
        }

        setReviews(reviewsWithTrips)
      } catch (error) {
        console.error("Error loading reviews:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger vos avis.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadReviews()
  }, [user, toast])

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) return

    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_REVIEWS, reviewId)
      setReviews(reviews.filter((review) => review.$id !== reviewId))
      toast({
        title: "Avis supprimé",
        description: "Votre avis a été supprimé avec succès.",
      })
    } catch (error) {
      console.error("Error deleting review:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'avis.",
        variant: "destructive",
      })
    }
  }

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 5:
        return "Excellent"
      case 4:
        return "Très bien"
      case 3:
        return "Bien"
      case 2:
        return "Moyen"
      case 1:
        return "Décevant"
      default:
        return ""
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const recentReviews = reviews.filter((review) => {
    const reviewDate = new Date(review.created_at)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return reviewDate >= thirtyDaysAgo
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes avis</h1>
          <p className="text-slate-600">Gérez vos avis et commentaires sur vos voyages</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mes avis</h1>
        <p className="text-slate-600">Gérez vos avis et commentaires sur vos voyages</p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Tous les avis ({reviews.length})</TabsTrigger>
          <TabsTrigger value="recent">Récents ({recentReviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Star className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucun avis pour le moment</h3>
                <p className="text-slate-600 mb-6">Vous n'avez pas encore laissé d'avis sur vos voyages.</p>
                <Link href="/account?tab=bookings">
                  <Button>Voir mes réservations</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            reviews.map((review) => (
              <Card key={review.$id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {review.trip ? (
                          <>
                            <MapPin className="h-5 w-5 text-slate-500" />
                            {review.trip.route.origin.city} → {review.trip.route.destination.city}
                          </>
                        ) : (
                          "Voyage supprimé"
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {review.trip ? formatDate(review.trip.departure_time) : "Date inconnue"}
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                              }`}
                            />
                          ))}
                          <Badge variant="outline" className="ml-2">
                            {getRatingText(review.rating)}
                          </Badge>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {review.booking_id && (
                        <Link href={`/booking/${review.booking_id}/review`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteReview(review.$id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">{review.comment}</p>
                  <p className="text-xs text-slate-500 mt-4">Publié le {formatDate(review.created_at)}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          {recentReviews.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Star className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucun avis récent</h3>
                <p className="text-slate-600">Vous n'avez pas laissé d'avis au cours des 30 derniers jours.</p>
              </CardContent>
            </Card>
          ) : (
            recentReviews.map((review) => (
              <Card key={review.$id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {review.trip ? (
                          <>
                            <MapPin className="h-5 w-5 text-slate-500" />
                            {review.trip.route.origin.city} → {review.trip.route.destination.city}
                          </>
                        ) : (
                          "Voyage supprimé"
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {review.trip ? formatDate(review.trip.departure_time) : "Date inconnue"}
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                              }`}
                            />
                          ))}
                          <Badge variant="outline" className="ml-2">
                            {getRatingText(review.rating)}
                          </Badge>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {review.booking_id && (
                        <Link href={`/booking/${review.booking_id}/review`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteReview(review.$id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">{review.comment}</p>
                  <p className="text-xs text-slate-500 mt-4">Publié le {formatDate(review.created_at)}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
