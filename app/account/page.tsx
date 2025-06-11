"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Clock, LogOut, Ticket, Star, Gift } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import AccountSidebar from "@/components/account-sidebar"
import { useMobile } from "@/hooks/use-mobile"

// Données simulées pour l'utilisateur
const mockUser = {
  id: "1",
  firstName: "Amadou",
  lastName: "Diallo",
  email: "amadou.diallo@example.com",
  phone: "+223 70 12 34 56",
  avatar: "/placeholder.svg?height=100&width=100",
  memberSince: "2022-05-15",
  loyaltyPoints: 1250,
  status: "gold",
}

// Données simulées pour les réservations
const mockBookings = [
  {
    id: "B12345",
    trip: {
      origin: "Bamako",
      destination: "Ségou",
      departure_time: "2023-06-15T08:00:00",
      arrival_time: "2023-06-15T11:30:00",
    },
    seats: ["12", "13"],
    total_price: 24000,
    booking_date: "2023-06-10T14:32:45",
    status: "upcoming",
  },
  {
    id: "B12346",
    trip: {
      origin: "Ségou",
      destination: "Bamako",
      departure_time: "2023-06-20T16:00:00",
      arrival_time: "2023-06-20T19:30:00",
    },
    seats: ["5"],
    total_price: 12000,
    booking_date: "2023-06-10T14:35:12",
    status: "upcoming",
  },
  {
    id: "B12347",
    trip: {
      origin: "Bamako",
      destination: "Sikasso",
      departure_time: "2023-05-05T09:30:00",
      arrival_time: "2023-05-05T14:00:00",
    },
    seats: ["22"],
    total_price: 15000,
    booking_date: "2023-04-28T10:15:22",
    status: "completed",
  },
  {
    id: "B12348",
    trip: {
      origin: "Sikasso",
      destination: "Bamako",
      departure_time: "2023-05-10T15:00:00",
      arrival_time: "2023-05-10T19:30:00",
    },
    seats: ["18"],
    total_price: 15000,
    booking_date: "2023-04-28T10:18:45",
    status: "completed",
  },
]

export default function AccountPage() {
  const router = useRouter()
  const isMobile = useMobile()
  const [activeTab, setActiveTab] = useState("dashboard")

  const handleLogout = () => {
    // Simuler la déconnexion
    setTimeout(() => {
      router.push("/")
    }, 500)
  }

  // Filtrer les réservations
  const upcomingBookings = mockBookings.filter((booking) => booking.status === "upcoming")
  const pastBookings = mockBookings.filter((booking) => booking.status === "completed")

  // Obtenir le statut de fidélité
  const getLoyaltyStatus = (status: string) => {
    switch (status) {
      case "gold":
        return <Badge className="bg-amber-100 text-amber-800">Gold</Badge>
      case "silver":
        return <Badge className="bg-slate-100 text-slate-800">Silver</Badge>
      case "bronze":
        return <Badge className="bg-orange-100 text-orange-800">Bronze</Badge>
      default:
        return <Badge variant="outline">Standard</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar pour desktop */}
        {!isMobile && (
          <div className="w-64 shrink-0">
            <AccountSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        )}

        {/* Contenu principal */}
        <div className="flex-1">
          {/* Tabs pour mobile */}
          {isMobile && (
            <div className="mb-6">
              <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start overflow-auto">
                  <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
                  <TabsTrigger value="bookings">Réservations</TabsTrigger>
                  <TabsTrigger value="profile">Profil</TabsTrigger>
                  <TabsTrigger value="loyalty">Fidélité</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          {/* Tableau de bord */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Tableau de bord</h1>
                <Button variant="outline" onClick={handleLogout} className="hidden md:flex">
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </div>

              {/* Carte de bienvenue */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={mockUser.avatar || "/placeholder.svg"}
                        alt={`${mockUser.firstName} ${mockUser.lastName}`}
                      />
                      <AvatarFallback>{`${mockUser.firstName[0]}${mockUser.lastName[0]}`}</AvatarFallback>
                    </Avatar>
                    <div className="text-center md:text-left">
                      <h2 className="text-xl font-bold">
                        Bienvenue, {mockUser.firstName} {mockUser.lastName}
                      </h2>
                      <p className="text-slate-600">
                        Membre depuis {new Date(mockUser.memberSince).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="ml-auto hidden md:block">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-500" />
                        <div>
                          <p className="font-medium">{mockUser.loyaltyPoints} points</p>
                          <div>{getLoyaltyStatus(mockUser.status)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Ticket className="mb-2 h-8 w-8 text-amber-500" />
                    <p className="text-sm text-slate-600">Réservations totales</p>
                    <p className="text-2xl font-bold">{mockBookings.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Calendar className="mb-2 h-8 w-8 text-amber-500" />
                    <p className="text-sm text-slate-600">Voyages à venir</p>
                    <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Star className="mb-2 h-8 w-8 text-amber-500" />
                    <p className="text-sm text-slate-600">Points de fidélité</p>
                    <p className="text-2xl font-bold">{mockUser.loyaltyPoints}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Prochains voyages */}
              <Card>
                <CardHeader>
                  <CardTitle>Prochains voyages</CardTitle>
                  <CardDescription>Vos réservations à venir</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div key={booking.id} className="rounded-lg border p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-amber-500" />
                                <span className="font-medium">
                                  {booking.trip.origin} → {booking.trip.destination}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {new Date(booking.trip.departure_time).toLocaleDateString("fr-FR", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                  })}
                                </span>
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {new Date(booking.trip.departure_time).toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}{" "}
                                  -{" "}
                                  {new Date(booking.trip.arrival_time).toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-slate-600">Réservation #{booking.id}</div>
                              <div className="mt-1 text-sm">
                                {booking.seats.length} {booking.seats.length > 1 ? "sièges" : "siège"} (
                                {booking.seats.join(", ")})
                              </div>
                              <div className="mt-1 font-medium text-amber-600">
                                {booking.total_price.toLocaleString()} FCFA
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/booking/${booking.id}`}>Voir les détails</Link>
                            </Button>
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Link href={`/booking/${booking.id}/cancel`}>Annuler</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Calendar className="mb-2 h-12 w-12 text-slate-300" />
                      <h3 className="text-lg font-medium">Aucun voyage à venir</h3>
                      <p className="mt-1 text-slate-500">Vous n'avez pas de réservations pour le moment</p>
                      <Button asChild className="mt-4 bg-amber-500 hover:bg-amber-600">
                        <Link href="/search">Réserver un voyage</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Offres spéciales */}
              <Card>
                <CardHeader>
                  <CardTitle>Offres spéciales</CardTitle>
                  <CardDescription>Promotions exclusives pour vous</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-amber-50 p-4">
                    <div className="flex items-start gap-4">
                      <Gift className="h-10 w-10 text-amber-500" />
                      <div>
                        <h3 className="font-medium">Offre spéciale membres {mockUser.status}</h3>
                        <p className="mt-1 text-slate-600">
                          Bénéficiez de 15% de réduction sur votre prochain voyage vers Ségou ou Mopti. Utilisez le code
                          promo GOLD15 lors de votre réservation.
                        </p>
                        <p className="mt-2 text-sm text-slate-500">Valable jusqu'au 30 juin 2023</p>
                        <Button asChild className="mt-3 bg-amber-500 hover:bg-amber-600">
                          <Link href="/search">En profiter maintenant</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Réservations */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Mes réservations</h1>

              <Tabs defaultValue="upcoming">
                <TabsList>
                  <TabsTrigger value="upcoming">À venir ({upcomingBookings.length})</TabsTrigger>
                  <TabsTrigger value="past">Passées ({pastBookings.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming" className="mt-6">
                  {upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <Card key={booking.id}>
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-amber-500" />
                                  <span className="font-medium">
                                    {booking.trip.origin} → {booking.trip.destination}
                                  </span>
                                </div>
                                <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {new Date(booking.trip.departure_time).toLocaleDateString("fr-FR", {
                                      weekday: "long",
                                      day: "numeric",
                                      month: "long",
                                    })}
                                  </span>
                                </div>
                                <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    {new Date(booking.trip.departure_time).toLocaleTimeString("fr-FR", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}{" "}
                                    -{" "}
                                    {new Date(booking.trip.arrival_time).toLocaleTimeString("fr-FR", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                <div className="mt-2 text-sm">
                                  <span className="text-slate-600">Réservation:</span> #{booking.id}
                                </div>
                                <div className="mt-1 text-sm">
                                  <span className="text-slate-600">Sièges:</span> {booking.seats.join(", ")}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-amber-600">
                                  {booking.total_price.toLocaleString()} FCFA
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2 justify-end">
                                  <Button asChild size="sm" variant="outline">
                                    <Link href={`/booking/${booking.id}`}>Voir les détails</Link>
                                  </Button>
                                  <Button
                                    asChild
                                    size="sm"
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                  >
                                    <Link href={`/booking/${booking.id}/cancel`}>Annuler</Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Calendar className="mb-2 h-12 w-12 text-slate-300" />
                      <h3 className="text-lg font-medium">Aucun voyage à venir</h3>
                      <p className="mt-1 text-slate-500">Vous n'avez pas de réservations pour le moment</p>
                      <Button asChild className="mt-4 bg-amber-500 hover:bg-amber-600">
                        <Link href="/search">Réserver un voyage</Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="past" className="mt-6">
                  {pastBookings.length > 0 ? (
                    <div className="space-y-4">
                      {pastBookings.map((booking) => (
                        <Card key={booking.id}>
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-amber-500" />
                                  <span className="font-medium">
                                    {booking.trip.origin} → {booking.trip.destination}
                                  </span>
                                </div>
                                <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {new Date(booking.trip.departure_time).toLocaleDateString("fr-FR", {
                                      weekday: "long",
                                      day: "numeric",
                                      month: "long",
                                    })}
                                  </span>
                                </div>
                                <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    {new Date(booking.trip.departure_time).toLocaleTimeString("fr-FR", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}{" "}
                                    -{" "}
                                    {new Date(booking.trip.arrival_time).toLocaleTimeString("fr-FR", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                <div className="mt-2 text-sm">
                                  <span className="text-slate-600">Réservation:</span> #{booking.id}
                                </div>
                                <div className="mt-1 text-sm">
                                  <span className="text-slate-600">Sièges:</span> {booking.seats.join(", ")}
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge className="bg-green-100 text-green-800">Terminé</Badge>
                                <div className="mt-2 font-medium text-amber-600">
                                  {booking.total_price.toLocaleString()} FCFA
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2 justify-end">
                                  <Button asChild size="sm" variant="outline">
                                    <Link href={`/booking/${booking.id}`}>Voir les détails</Link>
                                  </Button>
                                  <Button asChild size="sm" variant="outline">
                                    <Link href={`/booking/${booking.id}/review`}>Laisser un avis</Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Calendar className="mb-2 h-12 w-12 text-slate-300" />
                      <h3 className="text-lg font-medium">Aucun voyage passé</h3>
                      <p className="mt-1 text-slate-500">Vous n'avez pas encore effectué de voyage avec nous</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Profil */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Mon profil</h1>
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>Gérez vos informations personnelles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="flex flex-col items-center space-y-2">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={mockUser.avatar || "/placeholder.svg"}
                          alt={`${mockUser.firstName} ${mockUser.lastName}`}
                        />
                        <AvatarFallback>{`${mockUser.firstName[0]}${mockUser.lastName[0]}`}</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">
                        Changer la photo
                      </Button>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-slate-600">Prénom</label>
                          <div className="mt-1 rounded-md border px-3 py-2">{mockUser.firstName}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600">Nom</label>
                          <div className="mt-1 rounded-md border px-3 py-2">{mockUser.lastName}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600">Email</label>
                          <div className="mt-1 rounded-md border px-3 py-2">{mockUser.email}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600">Téléphone</label>
                          <div className="mt-1 rounded-md border px-3 py-2">{mockUser.phone}</div>
                        </div>
                      </div>
                      <Button className="bg-amber-500 hover:bg-amber-600">Modifier mes informations</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Préférences de voyage</CardTitle>
                  <CardDescription>Personnalisez vos préférences pour vos voyages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-slate-600">Préférence de siège</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Button variant="outline" className="border-amber-200 bg-amber-50 text-amber-800">
                          Fenêtre
                        </Button>
                        <Button variant="outline">Couloir</Button>
                        <Button variant="outline">Avant du véhicule</Button>
                        <Button variant="outline">Arrière du véhicule</Button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-600">Type de véhicule préféré</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Button variant="outline">Standard</Button>
                        <Button variant="outline" className="border-amber-200 bg-amber-50 text-amber-800">
                          Premium
                        </Button>
                        <Button variant="outline">VIP</Button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-600">Notifications</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Rappels de voyage</span>
                          <div className="h-6 w-11 rounded-full bg-amber-500 px-0.5 flex items-center">
                            <div className="h-5 w-5 rounded-full bg-white"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Promotions et offres</span>
                          <div className="h-6 w-11 rounded-full bg-amber-500 px-0.5 flex items-center">
                            <div className="h-5 w-5 rounded-full bg-white"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Nouvelles destinations</span>
                          <div className="h-6 w-11 rounded-full bg-slate-200 px-0.5 flex items-center justify-end">
                            <div className="h-5 w-5 rounded-full bg-white"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button className="bg-amber-500 hover:bg-amber-600">Enregistrer les préférences</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Fidélité */}
          {activeTab === "loyalty" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Programme de fidélité</h1>

              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-amber-100 p-4">
                        <Star className="h-12 w-12 text-amber-500" />
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-2xl font-bold">{mockUser.loyaltyPoints}</p>
                        <p className="text-sm text-slate-600">points de fidélité</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-medium">
                        Statut actuel: <span className="text-amber-600">{mockUser.status.toUpperCase()}</span>
                      </h2>
                      <p className="mt-1 text-slate-600">
                        Continuez à voyager avec nous pour accumuler des points et débloquer des avantages exclusifs.
                      </p>
                      <div className="mt-4">
                        <div className="h-2 w-full rounded-full bg-slate-100">
                          <div className="h-2 w-3/4 rounded-full bg-amber-500"></div>
                        </div>
                        <div className="mt-1 flex justify-between text-xs text-slate-500">
                          <span>0</span>
                          <span>1000</span>
                          <span>2000</span>
                          <span>3000</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        Plus que 750 points pour atteindre le statut Platinum
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Avantages du programme</CardTitle>
                  <CardDescription>Découvrez les avantages de chaque niveau</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Standard</Badge>
                        <span className="text-sm text-slate-500">(0-499 points)</span>
                      </div>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Accès au programme de fidélité
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          1 point pour chaque 1000 FCFA dépensés
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Offres promotionnelles par email
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-orange-100 text-orange-800">Bronze</Badge>
                        <span className="text-sm text-slate-500">(500-999 points)</span>
                      </div>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Tous les avantages Standard
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          5% de réduction sur les réservations
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Priorité d'embarquement
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-slate-100 text-slate-800">Silver</Badge>
                        <span className="text-sm text-slate-500">(1000-1999 points)</span>
                      </div>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Tous les avantages Bronze
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          10% de réduction sur les réservations
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Choix de siège gratuit
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Accès à la salle d'attente VIP
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-amber-100 text-amber-800">Gold</Badge>
                        <span className="text-sm text-slate-500">(2000-2999 points)</span>
                      </div>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Tous les avantages Silver
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          15% de réduction sur les réservations
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Surclassement gratuit (selon disponibilité)
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Service client prioritaire
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Un voyage gratuit par an (conditions applicables)
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-purple-100 text-purple-800">Platinum</Badge>
                        <span className="text-sm text-slate-500">(3000+ points)</span>
                      </div>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Tous les avantages Gold
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          20% de réduction sur les réservations
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Accès aux offres exclusives
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Deux voyages gratuits par an
                        </li>
                        <li className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Concierge personnel pour les réservations
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Historique des points</CardTitle>
                  <CardDescription>Suivez l'évolution de vos points de fidélité</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Voyage Bamako → Ségou</p>
                          <p className="text-sm text-slate-600">15 juin 2023</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">+240 points</p>
                          <p className="text-sm text-slate-600">Réservation #B12345</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Voyage Ségou → Bamako</p>
                          <p className="text-sm text-slate-600">20 juin 2023</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">+120 points</p>
                          <p className="text-sm text-slate-600">Réservation #B12346</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Voyage Bamako → Sikasso</p>
                          <p className="text-sm text-slate-600">5 mai 2023</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">+150 points</p>
                          <p className="text-sm text-slate-600">Réservation #B12347</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Voyage Sikasso → Bamako</p>
                          <p className="text-sm text-slate-600">10 mai 2023</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">+150 points</p>
                          <p className="text-sm text-slate-600">Réservation #B12348</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Bonus d'inscription</p>
                          <p className="text-sm text-slate-600">15 mai 2022</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">+100 points</p>
                          <p className="text-sm text-slate-600">Nouveau membre</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
