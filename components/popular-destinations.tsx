"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Star } from "lucide-react"
import Link from "next/link"
import { getDestinations } from "@/lib/appwrite/admin"

export default function PopularDestinations() {
  const [destinations, setDestinations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPopularDestinations = async () => {
      try {
        setIsLoading(true)
        const allDestinations = await getDestinations()
        // Filter for popular destinations and limit to 4
        const popularDestinations = allDestinations.filter((dest) => dest.popular === true).slice(0, 4)
        setDestinations(popularDestinations)
      } catch (err) {
        console.error("Error fetching popular destinations:", err)
        setError("Impossible de charger les destinations populaires")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPopularDestinations()
  }, [])

  if (isLoading) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Destinations Populaires</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Découvrez les destinations les plus prisées par nos voyageurs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-200"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded mb-4"></div>
                  <div className="h-8 bg-slate-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Destinations Populaires</h2>
            <p className="text-slate-600">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (destinations.length === 0) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Destinations Populaires</h2>
            <p className="text-slate-600">Aucune destination populaire disponible pour le moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Destinations Populaires</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Découvrez les destinations les plus prisées par nos voyageurs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <Card key={destination.$id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={destination.image || "/placeholder.svg?height=200&width=300"}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-1">
                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                  </div>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg line-clamp-1">{destination.name}</h3>
                </div>

                <div className="flex items-center text-slate-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {destination.city}, {destination.region}
                  </span>
                </div>

                {destination.description && (
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{destination.description}</p>
                )}

                <Button asChild className="w-full bg-amber-500 hover:bg-amber-600">
                  <Link href={`/destinations?city=${encodeURIComponent(destination.city)}`}>Découvrir</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* <div className="text-center mt-8">
          <Button asChild variant="outline" size="lg">
            <Link href="/destinations">Voir toutes les destinations</Link>
          </Button>
        </div> */}
      </div>
    </section>
  )
}
