import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Données simulées pour les destinations populaires
const popularDestinations = [
  {
    id: "1",
    name: "Bamako",
    image: "/placeholder.svg?height=300&width=400",
    description: "La capitale dynamique du Mali, centre économique et culturel du pays.",
    price: 5000,
  },
  {
    id: "2",
    name: "Ségou",
    image: "/placeholder.svg?height=300&width=400",
    description: "Ancienne capitale du royaume bambara, située sur les rives du fleuve Niger.",
    price: 8000,
  },
  {
    id: "3",
    name: "Tombouctou",
    image: "/placeholder.svg?height=300&width=400",
    description: "Cité historique du désert, célèbre pour son patrimoine culturel et architectural.",
    price: 25000,
  },
  {
    id: "4",
    name: "Mopti",
    image: "/placeholder.svg?height=300&width=400",
    description: "Surnommée la Venise du Mali, cette ville est située au confluent du Niger et du Bani.",
    price: 12000,
  },
]

export function PopularDestinations() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {popularDestinations.map((destination) => (
        <Card key={destination.id} className="overflow-hidden">
          <div className="relative h-48 w-full">
            <Image
              src={destination.image || "/placeholder.svg"}
              alt={destination.name}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
            <Badge className="absolute right-2 top-2 bg-amber-500 text-white hover:bg-amber-600">Populaire</Badge>
          </div>
          <CardContent className="p-4">
            <h3 className="mb-2 text-lg font-semibold">{destination.name}</h3>
            <p className="mb-4 text-sm text-slate-600 line-clamp-2">{destination.description}</p>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">À partir de</span>
                <p className="text-lg font-semibold text-amber-600">{destination.price.toLocaleString()} FCFA</p>
              </div>
              <Button asChild variant="outline" size="sm" className="border-amber-500 text-amber-500 hover:bg-amber-50">
                <Link href={`/destinations/${destination.id}`}>
                  Découvrir
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
