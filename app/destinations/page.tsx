import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, Calendar, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Destinations au Mali | Mali Voyages",
  description:
    "Découvrez les plus belles destinations du Mali, de Bamako à Tombouctou. Réservez votre voyage vers ces lieux emblématiques avec Mali Voyages.",
  keywords: "destinations Mali, Bamako, Ségou, Mopti, Tombouctou, Sikasso, Kayes, Gao, Djenné, tourisme Mali",
  openGraph: {
    title: "Destinations au Mali | Mali Voyages",
    description: "Découvrez les plus belles destinations du Mali, de Bamako à Tombouctou.",
    url: "https://malivoyages.ml/destinations",
    images: [
      {
        url: "https://malivoyages.ml/images/destinations-og.jpg",
        width: 1200,
        height: 630,
        alt: "Destinations au Mali",
      },
    ],
  },
}

// Données simulées pour les destinations
const destinations = [
  {
    id: "1",
    name: "Bamako",
    region: "District de Bamako",
    image: "/placeholder.svg?height=400&width=600",
    description: "La capitale dynamique du Mali, centre économique et culturel du pays.",
    highlights: ["Marché de Médina", "Musée National", "Monument de l'Indépendance", "Zoo National"],
    price: 5000,
    popular: true,
  },
  {
    id: "2",
    name: "Ségou",
    region: "Région de Ségou",
    image: "/placeholder.svg?height=400&width=600",
    description: "Ancienne capitale du royaume bambara, située sur les rives du fleuve Niger.",
    highlights: ["Festival sur le Niger", "Quartier Somono", "Marché de Ségou"],
    price: 8000,
    popular: true,
  },
  {
    id: "3",
    name: "Mopti",
    region: "Région de Mopti",
    image: "/placeholder.svg?height=400&width=600",
    description: "Surnommée la Venise du Mali, cette ville est située au confluent du Niger et du Bani.",
    highlights: ["Port de pêche", "Grande Mosquée", "Marché artisanal"],
    price: 12000,
    popular: true,
  },
  {
    id: "4",
    name: "Tombouctou",
    region: "Région de Tombouctou",
    image: "/placeholder.svg?height=400&width=600",
    description: "Cité historique du désert, célèbre pour son patrimoine culturel et architectural.",
    highlights: ["Mosquée Djingareyber", "Manuscrits anciens", "Maison des Savants"],
    price: 25000,
    popular: true,
  },
  {
    id: "5",
    name: "Sikasso",
    region: "Région de Sikasso",
    image: "/placeholder.svg?height=400&width=600",
    description: "Ville du sud du Mali connue pour son agriculture et son histoire de résistance.",
    highlights: ["Tata de Sikasso", "Mamelon de Sikasso", "Marché central"],
    price: 9000,
    popular: false,
  },
  {
    id: "6",
    name: "Kayes",
    region: "Région de Kayes",
    image: "/placeholder.svg?height=400&width=600",
    description: "Ville de l'ouest du Mali, porte d'entrée vers le Sénégal et la Mauritanie.",
    highlights: ["Chutes de Félou", "Fort colonial", "Fleuve Sénégal"],
    price: 15000,
    popular: false,
  },
  {
    id: "7",
    name: "Gao",
    region: "Région de Gao",
    image: "/placeholder.svg?height=400&width=600",
    description: "Ancienne capitale de l'Empire Songhaï, située sur les rives du fleuve Niger.",
    highlights: ["Tombeau des Askia", "Marché de Gao", "Dune rose"],
    price: 20000,
    popular: false,
  },
  {
    id: "8",
    name: "Djenné",
    region: "Région de Mopti",
    image: "/placeholder.svg?height=400&width=600",
    description: "Célèbre pour sa grande mosquée en terre, la plus grande construction en adobe au monde.",
    highlights: ["Grande Mosquée", "Marché du lundi", "Architecture soudanaise"],
    price: 14000,
    popular: false,
  },
]

export default function DestinationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Découvrez le Mali</h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Explorez les plus belles destinations du Mali, de la capitale animée de Bamako aux mystérieuses dunes de
          Tombouctou.
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="mb-12 rounded-lg bg-white p-6 shadow-md">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input placeholder="Rechercher une destination" className="pl-10" />
          </div>
          <div className="flex-1">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <select className="w-full rounded-md border border-slate-200 bg-white px-10 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option value="">Toutes les régions</option>
                <option value="bamako">District de Bamako</option>
                <option value="segou">Région de Ségou</option>
                <option value="mopti">Région de Mopti</option>
                <option value="tombouctou">Région de Tombouctou</option>
                <option value="sikasso">Région de Sikasso</option>
                <option value="kayes">Région de Kayes</option>
                <option value="gao">Région de Gao</option>
              </select>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <select className="w-full rounded-md border border-slate-200 bg-white px-10 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option value="">Toutes les saisons</option>
                <option value="dry">Saison sèche (Octobre - Mai)</option>
                <option value="rainy">Saison des pluies (Juin - Septembre)</option>
              </select>
            </div>
          </div>
          <Button className="bg-amber-500 hover:bg-amber-600">
            <Search className="mr-2 h-4 w-4" />
            Rechercher
          </Button>
        </div>
      </div>

      {/* Onglets */}
      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-8 w-full justify-start">
          <TabsTrigger value="all">Toutes les destinations</TabsTrigger>
          <TabsTrigger value="popular">Destinations populaires</TabsTrigger>
          <TabsTrigger value="cultural">Sites culturels</TabsTrigger>
          <TabsTrigger value="nature">Nature et paysages</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {destinations
              .filter((destination) => destination.popular)
              .map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="cultural" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {destinations
              .filter((destination) => destination.id === "4" || destination.id === "8" || destination.id === "7")
              .map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="nature" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {destinations
              .filter((destination) => destination.id === "3" || destination.id === "6" || destination.id === "5")
              .map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* CTA */}
      <div className="mt-16 rounded-lg bg-amber-50 p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Vous ne trouvez pas votre destination idéale?</h2>
        <p className="mb-6 text-slate-600">
          Contactez notre équipe pour organiser un voyage personnalisé selon vos préférences.
        </p>
        <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600">
          <Link href="/contact">Nous contacter</Link>
        </Button>
      </div>
    </div>
  )
}

function DestinationCard({ destination }: { destination: any }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image src={destination.image || "/placeholder.svg"} alt={destination.name} fill className="object-cover" />
        {destination.popular && (
          <Badge className="absolute right-2 top-2 bg-amber-500 text-white hover:bg-amber-600">Populaire</Badge>
        )}
      </div>
      <CardContent className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xl font-semibold">{destination.name}</h3>
          <Badge variant="outline" className="bg-slate-50">
            {destination.region}
          </Badge>
        </div>
        <p className="mb-4 text-sm text-slate-600">{destination.description}</p>
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-medium">Points d'intérêt:</h4>
          <div className="flex flex-wrap gap-2">
            {destination.highlights.slice(0, 3).map((highlight: string, index: number) => (
              <Badge key={index} variant="secondary" className="bg-slate-100">
                {highlight}
              </Badge>
            ))}
            {destination.highlights.length > 3 && (
              <Badge variant="secondary" className="bg-slate-100">
                +{destination.highlights.length - 3}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-slate-500">À partir de</span>
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
  )
}
