"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, User, Loader2 } from "lucide-react"
import { databases, COLLECTION_REVIEWS, DATABASE_ID } from "@/lib/appwrite/config"
import { Query } from "appwrite"

interface Review {
  $id: string
  user_id: string
  trip_id: string
  rating: number
  comment: string
  created_at: string
}

interface ReviewDisplayProps {
  tripId: string
  limit?: number
  showTitle?: boolean
}

export default function ReviewDisplay({ tripId, limit = 10, showTitle = true }: ReviewDisplayProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true)

        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_REVIEWS, [
          Query.equal("trip_id", tripId),
          Query.orderDesc("created_at"),
          Query.limit(limit),
        ])

        const reviewsData = response.documents as unknown as Review[]
        setReviews(reviewsData)
        setTotalReviews(response.total)

        // Calculate average rating
        if (reviewsData.length > 0) {
          const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0)
          setAverageRating(sum / reviewsData.length)
        }
      } catch (error) {
        console.error("Error loading reviews:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (tripId) {
      loadReviews()
    }
  }, [tripId, limit])

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

  const formatUserName = (userId: string) => {
    // Return anonymous display for privacy
    return `Voyageur ${userId.slice(-4)}`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>{showTitle && <CardTitle>Avis des voyageurs</CardTitle>}</CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardHeader>{showTitle && <CardTitle>Avis des voyageurs</CardTitle>}</CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun avis pour le moment</h3>
            <p className="text-slate-500">Soyez le premier à laisser un avis sur ce voyage.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        {showTitle && (
          <div className="flex items-center justify-between">
            <CardTitle>Avis des voyageurs</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-600">
                {averageRating.toFixed(1)} ({totalReviews} avis)
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.$id} className="flex items-start gap-4">
              <Avatar>
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{formatUserName(review.user_id)}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {getRatingText(review.rating)}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    {new Date(review.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
