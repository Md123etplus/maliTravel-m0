"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { SearchForm } from "@/components/search-form"
import { MapPin, Calendar, Clock, Users, Filter, ArrowRight, Wifi, AirVent, Coffee } from "lucide-react"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

// Données simulées pour les voyages
const mockTrips = [
  {
    id: "T1001",
    origin: "bamako",
    originName: "Bamako",
    destination: "segou",
    destinationName: "Ségou",
    departure_time: "2023-06-15T08:00:00",
    arrival_time: "2023-06-15T11:30:00",
    price: 8000,
    available_seats: 32,
    bus_type: "standard",
    amenities: ["wifi", "ac", "snacks"],
  },
  {
    id: "T1002",
    origin: "bamako",
    originName: "Bamako",
    destination: "segou",
    destinationName: "Ségou",
    departure_time: "2023-06-15T10:30:00",
    arrival_time: "2023-06-15T14:00:00",
    price: 7500,
    available_seats: 15,
    bus_type: "standard",
    amenities: ["wifi", "ac"],
  },
  {
    id: "T1003",
    origin: "bamako",
    originName: "Bamako",
    destination: "segou",
    destinationName: "Ségou",
    departure_time: "2023-06-15T13:00:00",
    arrival_time: "2023-06-15T16:30:00",
    price: 9500,
    available_seats: 25,
    bus_type: "premium",
    amenities: ["wifi", "ac", "snacks", "usb", "tv"],
  },
  {
    id: "T1004",
    origin: "bamako",
    originName: "Bamako",
    destination: "segou",
    destinationName: "Ségou",
    departure_time: "2023-06-15T16:00:00",
    arrival_time: "2023-06-15T19:30:00",
    price: 8500,
    available_seats: 8,
    bus_type: "standard",
    amenities: ["wifi", "ac"],
  },
  {
    id: "T1005",
    origin: "bamako",
    originName: "Bamako",
    destination: "mopti",
    destinationName: "Mopti",
    departure_time: "2023-06-15T07:00:00",
    arrival_time: "2023-06-15T14:00:00",
    price: 15000,
    available_seats: 22,
    bus_type: "premium",
    amenities: ["wifi", "ac", "snacks", "usb", "tv"],
  },
  {
    id: "T1006",
    origin: "bamako",
    originName: "Bamako",
    destination: "mopti",
    destinationName: "Mopti",
    departure_time: "2023-06-15T20:00:00",
    arrival_time: "2023-06-16T03:00:00",
    price: 12000,
    available_seats: 35,
    bus_type: "night",
    amenities: ["wifi", "ac", "blanket", "usb"],
  },
  {
    id: "T1007",
    origin: "bamako",
    originName: "Bamako",
    destination: "sikasso",
    destinationName: "Sikasso",
    departure_time: "2023-06-15T09:00:00",
    arrival_time: "2023-06-15T13:30:00",
    price: 9000,
    available_seats: 18,
    bus_type: "standard",
    amenities: ["wifi", "ac"],
  },
  {
    id: "T1008",
    origin: "segou",
    originName: "Ségou",
    destination: "bamako",
    destinationName: "Bamako",
    departure_time: "2023-06-15T07:30:00",
    arrival_time: "2023-06-15T11:00:00",
    price: 8000,
    available_seats: 28,
    bus_type: "standard",
    amenities: ["wifi", "ac"],
  },
]

// Fonction pour obtenir l'icône d'un équipement
const getAmenityIcon = (amenity: string) => {
  switch (amenity) {
    case "wifi":
      return <Wifi className="h-4 w-4" />
    case "ac":
      return <AirVent className="h-4 w-4" />
    case "snacks":
      return <Coffee className="h-4 w-4" />
    default:
      return null
  }
}

// Fonction pour obtenir le libellé d'un équipement
const getAmenityLabel = (amenity: string) => {
  switch (amenity) {
    case "wifi":
      return "WiFi"
    case "ac":
      return "Climatisation"
    case "snacks":
      return "Collations"
    case "usb":
      return "Prises USB"
    case "tv":
      return "Écrans TV"
    case "blanket":
      return "Couvertures"
    default:
      return amenity
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  // Récupérer les paramètres de recherche
  const origin = searchParams?.get("origin") || "bamako"
  const destination = searchParams?.get("destination") || ""
  const dateParam = searchParams?.get("date") || new Date().toISOString()
  const passengers = searchParams?.get("passengers") || "1"

  // Formater la date pour l'affichage
  const formattedDate = format(parseISO(dateParam), "EEEE d MMMM yyyy", { locale: fr })

  useEffect(() => {
    // Simuler une requête API
    setLoading(true)
    setTimeout(() => {
      // Filtrer les voyages en fonction des paramètres de recherche
      const filteredTrips = mockTrips.filter(
        (trip) => trip.origin === origin && (!destination || trip.destination === destination),
      )
      setTrips(filteredTrips)
      setLoading(false)
    }, 1000)
  }, [origin, destination, dateParam])

  // Filtrer les voyages en fonction du type de bus
  const filteredTrips = filter === "all" ? trips : trips.filter((trip) => trip.bus_type === filter)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Recherche de voyages</h1>
        <p className="text-slate-600">
          Trouvez les meilleurs trajets entre{" "}
          <span className="font-medium">
            {origin === "bamako" ? "Bamako" : origin} et{" "}
            {destination ? (destination === "segou" ? "Ségou" : destination) : "toutes les destinations"}
          </span>
        </p>
      </div>

      {/* Formulaire de recherche */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <SearchForm />
        </CardContent>
      </Card>

      {/* Résultats de recherche */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Filtres */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center">
                <Filter className="mr-2 h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-semibold">Filtres</h2>
              </div>

              <div className="space-y-6">
                {/* Type de bus */}
                <div>
                  <h3 className="mb-3 text-sm font-medium">Type de bus</h3>
                  <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
                    <TabsList className="w-full">
                      <TabsTrigger value="all">Tous</TabsTrigger>
                      <TabsTrigger value="standard">Standard</TabsTrigger>
                      <TabsTrigger value="premium">Premium</TabsTrigger>
                      <TabsTrigger value="night">Nuit</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Heure de départ */}
                <div>
                  <h3 className="mb-3 text-sm font-medium">Heure de départ</h3>
                  <div className="space-y-2">
                    {["Matin (6h - 12h)", "Après-midi (12h - 18h)", "Soir (18h - 00h)", "Nuit (00h - 6h)"].map(
                      (time, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`time-${index}`}
                            className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                          />
                          <label htmlFor={`time-${index}`} className="ml-2 text-sm">
                            {time}
                          </label>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Équipements */}
                <div>
                  <h3 className="mb-3 text-sm font-medium">Équipements</h3>
                  <div className="space-y-2">
                    {["WiFi", "Climatisation", "Prises USB", "Collations", "Écrans TV"].map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`amenity-${index}`}
                          className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                        />
                        <label htmlFor={`amenity-${index}`} className="ml-2 text-sm">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prix */}
                <div>
                  <h3 className="mb-3 text-sm font-medium">Prix</h3>
                  <div className="flex items-center justify-between">
                    <input type="range" min="5000" max="25000" step="1000" defaultValue="25000" className="w-full" />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span>5 000 FCFA</span>
                    <span>25 000 FCFA</span>
                  </div>
                </div>

                <Button className="w-full bg-amber-500 hover:bg-amber-600">Appliquer les filtres</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des voyages */}
        <div className="md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {loading ? "Recherche en cours..." : `${filteredTrips.length} voyages trouvés`}
            </h2>
            <div className="text-sm text-slate-600">
              <Calendar className="mr-1 inline-block h-4 w-4" />
              {formattedDate}
            </div>
          </div>

          {loading ? (
            // Affichage du chargement
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-24 rounded-md bg-slate-200"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTrips.length > 0 ? (
            // Affichage des résultats
            <div className="space-y-4">
              {filteredTrips.map((trip) => (
                <Card key={trip.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="border-b p-4">
                      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                          <div className="flex items-center">
                            <Badge
                              className={
                                trip.bus_type === "premium"
                                  ? "bg-amber-100 text-amber-800"
                                  : trip.bus_type === "night"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-slate-100 text-slate-800"
                              }
                            >
                              {trip.bus_type === "premium"
                                ? "Premium"
                                : trip.bus_type === "night"
                                  ? "Bus de nuit"
                                  : "Standard"}
                            </Badge>
                            <div className="ml-2 flex">
                              {trip.amenities.slice(0, 3).map((amenity: string, index: number) => (
                                <div
                                  key={index}
                                  className="ml-1 rounded-full bg-slate-100 p-1"
                                  title={getAmenityLabel(amenity)}
                                >
                                  {getAmenityIcon(amenity)}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="mt-2 flex items-center text-lg font-semibold">
                            {format(new Date(trip.departure_time), "HH:mm")} -{" "}
                            {format(new Date(trip.arrival_time), "HH:mm")}
                          </div>
                          <div className="mt-1 flex items-center text-sm text-slate-600">
                            <MapPin className="mr-1 h-4 w-4" />
                            {trip.originName} → {trip.destinationName}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-amber-600">
                            {trip.price.toLocaleString()} <span className="text-sm font-normal">FCFA</span>
                          </div>
                          <div className="mt-1 text-sm text-slate-600">
                            <Users className="mr-1 inline-block h-4 w-4" />
                            {trip.available_seats} places disponibles
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 p-4">
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center text-sm text-slate-600">
                          <Clock className="mr-1 h-4 w-4" />
                          {Math.round(
                            (new Date(trip.arrival_time).getTime() - new Date(trip.departure_time).getTime()) /
                              (1000 * 60 * 60),
                          )}{" "}
                          heures
                        </div>
                      </div>
                      <Button asChild className="bg-amber-500 hover:bg-amber-600">
                        <Link href={`/booking/${trip.id}?passengers=${passengers}`}>
                          Sélectionner
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Aucun résultat
            <Card>
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-amber-100 p-3">
                    <MapPin className="h-6 w-6 text-amber-500" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold">Aucun voyage trouvé</h3>
                <p className="mb-4 text-slate-600">
                  Aucun voyage ne correspond à vos critères de recherche. Essayez de modifier vos filtres ou de
                  sélectionner une autre date.
                </p>
                <Button asChild variant="outline">
                  <Link href="/">Retour à l'accueil</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
