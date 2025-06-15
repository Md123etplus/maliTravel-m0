"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Clock, LogOut, Ticket, Star, Gift, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import AccountSidebar from "@/components/account-sidebar"
import { useMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/components/auth-provider"
import { getUserBookings, getUserStats } from "@/lib/appwrite/bookings"
import {Booking} from "@/lib/appwrite/types"

export default function AccountPage() {
  const router = useRouter()
  const isMobile = useMobile()
  const { user, logout, isLoading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
  })
  const [isLoadingBookings, setIsLoadingBookings] = useState(true)

  // Rediriger si pas connecté
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Charger les réservations et statistiques de l'utilisateur
  useEffect(() => {
    const loadUserData = async () => {
      if (user?.$id) {
        try {
          setIsLoadingBookings(true)
          const [userBookings, stats] = await Promise.all([getUserBookings(user.$id), getUserStats(user.$id)])
          setBookings(userBookings)
          setUserStats(stats)
        } catch (error) {
          console.error("Erreur lors du chargement des données:", error)
        } finally {
          setIsLoadingBookings(false)
        }
      }
    }

    loadUserData()
  }, [user?.$id])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  // Afficher un loader pendant le chargement
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Filtrer les réservations
  const upcomingBookings = bookings.filter(
    (booking) => booking.status === "confirmé" && new Date(booking.trip?.departure_time || "") > new Date(),
  )
  const pastBookings = bookings.filter(
    (booking) => booking.status === "confirmé" && new Date(booking.trip?.departure_time || "") <= new Date(),
  )

  // Obtenir le statut de fidélité
  const getLoyaltyStatus = (points: number) => {
    if (points >= 3000) return <Badge className="bg-purple-100 text-purple-800">Platinum</Badge>
    if (points >= 2000) return <Badge className="bg-amber-100 text-amber-800">Gold</Badge>
    if (points >= 1000) return <Badge className="bg-slate-100 text-slate-800">Silver</Badge>
    if (points >= 500) return <Badge className="bg-orange-100 text-orange-800">Bronze</Badge>
    return <Badge variant="outline">Standard</Badge>
  }

  const loyaltyPoints = Math.floor(userStats.totalSpent / 1000) + userStats.completedBookings * 100

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
                      <AvatarImage src="/placeholder.svg" alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center md:text-left">
                      <h2 className="text-xl font-bold">Bienvenue, {user.name}</h2>
                      <p className="text-slate-600">
                        Membre depuis{" "}
                        {user.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR") : "Récemment"}
                      </p>
                    </div>
                    <div className="ml-auto hidden md:block">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-500" />
                        <div>
                          <p className="font-medium">{loyaltyPoints} points</p>
                          <div>{getLoyaltyStatus(loyaltyPoints)}</div>
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
                    <p className="text-2xl font-bold">
                      {isLoadingBookings ? <Loader2 className="h-6 w-6 animate-spin" /> : userStats.totalBookings}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Calendar className="mb-2 h-8 w-8 text-amber-500" />
                    <p className="text-sm text-slate-600">Voyages à venir</p>
                    <p className="text-2xl font-bold">
                      {isLoadingBookings ? <Loader2 className="h-6 w-6 animate-spin" /> : upcomingBookings.length}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Star className="mb-2 h-8 w-8 text-amber-500" />
                    <p className="text-sm text-slate-600">Points de fidélité</p>
                    <p className="text-2xl font-bold">{user?.loyaltyPoints || 0}</p>
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
                  {isLoadingBookings ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div key={booking.$id} className="rounded-lg border p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-amber-500" />
                                <span className="font-medium">
                                  {booking.trip?.route?.origin?.name || "Départ"} →{" "}
                                  {booking.trip?.route?.destination?.name || "Arrivée"}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {booking.trip?.departure_time
                                    ? new Date(booking.trip.departure_time).toLocaleDateString("fr-FR", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                      })
                                    : "Date à confirmer"}
                                </span>
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {booking.trip?.departure_time
                                    ? new Date(booking.trip.departure_time).toLocaleTimeString("fr-FR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : "Heure à confirmer"}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-slate-600">Réservation #{booking.$id}</div>
                              <div className="mt-1 text-sm">
                                {booking.seats?.map((s) => s.seat?.seat_number).join(", ") || "Sièges à confirmer"}
                              </div>
                              <div className="mt-1 font-medium text-amber-600">
                                {booking.total_price.toLocaleString()} FCFA
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/booking/${booking.$id}`}>Voir les détails</Link>
                            </Button>
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Link href={`/booking/${booking.$id}/cancel`}>Annuler</Link>
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
                        <h3 className="font-medium">
                          Offre spéciale membres{" "}
                          {loyaltyPoints >= 2000 ? "Gold" : loyaltyPoints >= 1000 ? "Silver" : "Bronze"}
                        </h3>
                        <p className="mt-1 text-slate-600">
                          Bénéficiez de {loyaltyPoints >= 2000 ? "15%" : loyaltyPoints >= 1000 ? "10%" : "5%"} de
                          réduction sur votre prochain voyage vers Ségou ou Mopti.
                        </p>
                        <p className="mt-2 text-sm text-slate-500">Valable jusqu'au 30 juin 2024</p>
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

          {/* Section Réservations */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Mes réservations</h1>

              {isLoadingBookings ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Tabs defaultValue="upcoming">
                  <TabsList>
                    <TabsTrigger value="upcoming">À venir ({upcomingBookings.length})</TabsTrigger>
                    <TabsTrigger value="past">Passées ({pastBookings.length})</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upcoming" className="mt-6">
                    {upcomingBookings.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingBookings.map((booking) => (
                          <Card key={booking.$id}>
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-amber-500" />
                                    <span className="font-medium">
                                      {booking.trip?.route?.origin?.name || "Départ"} →{" "}
                                      {booking.trip?.route?.destination?.name || "Arrivée"}
                                    </span>
                                  </div>
                                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                      {booking.trip?.departure_time
                                        ? new Date(booking.trip.departure_time).toLocaleDateString("fr-FR", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                          })
                                        : "Date à confirmer"}
                                    </span>
                                  </div>
                                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                                    <Clock className="h-4 w-4" />
                                    <span>
                                      {booking.trip?.departure_time
                                        ? new Date(booking.trip.departure_time).toLocaleTimeString("fr-FR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })
                                        : "Heure à confirmer"}
                                    </span>
                                    <div className="mt-2 text-sm">
                                      <span className="text-slate-600">Réservation:</span> #{booking.$id}
                                    </div>
                                    <div className="mt-1 text-sm">
                                      <span className="text-slate-600">Sièges:</span>{" "}
                                      {booking.seats?.map((s) => s.seat?.seat_number).join(", ") ||
                                        "Sièges à confirmer"}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium text-amber-600">
                                    {booking.total_price.toLocaleString()} FCFA
                                  </div>
                                  <div className="mt-4 flex flex-wrap gap-2 justify-end">
                                    <Button asChild size="sm" variant="outline">
                                      <Link href={`/booking/${booking.$id}`}>Voir les détails</Link>
                                    </Button>
                                    <Button
                                      asChild
                                      size="sm"
                                      variant="outline"
                                      className="border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                      <Link href={`/booking/${booking.$id}/cancel`}>Annuler</Link>
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
                          <Card key={booking.$id}>
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-amber-500" />
                                    <span className="font-medium">
                                      {booking.trip?.route?.origin?.name || "Départ"} →{" "}
                                      {booking.trip?.route?.destination?.name || "Arrivée"}
                                    </span>
                                  </div>
                                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                      {booking.trip?.departure_time
                                        ? new Date(booking.trip.departure_time).toLocaleDateString("fr-FR", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                          })
                                        : "Date à confirmer"}
                                    </span>
                                  </div>
                                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                                    <Clock className="h-4 w-4" />
                                    <span>
                                      {booking.trip?.departure_time
                                        ? new Date(booking.trip.departure_time).toLocaleTimeString("fr-FR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })
                                        : "Heure à confirmer"}
                                    </span>
                                  </div>
                                  <div className="mt-2 text-sm">
                                    <span className="text-slate-600">Réservation:</span> #{booking.$id}
                                  </div>
                                  <div className="mt-1 text-sm">
                                    <span className="text-slate-600">Sièges:</span>{" "}
                                    {booking.seats?.map((s) => s.seat?.seat_number).join(", ") || "Sièges à confirmer"}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge className="bg-green-100 text-green-800">Terminé</Badge>
                                  <div className="mt-2 font-medium text-amber-600">
                                    {booking.total_price.toLocaleString()} FCFA
                                  </div>
                                  <div className="mt-4 flex flex-wrap gap-2 justify-end">
                                    <Button asChild size="sm" variant="outline">
                                      <Link href={`/booking/${booking.$id}`}>Voir les détails</Link>
                                    </Button>
                                    <Button asChild size="sm" variant="outline">
                                      <Link href={`/booking/${booking.$id}/review`}>Laisser un avis</Link>
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
              )}
            </div>
          )}

          {/* Section Profil */}
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
                        <AvatarImage src="/placeholder.svg" alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">
                        Changer la photo
                      </Button>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-slate-600">Nom complet</label>
                          <div className="mt-1 rounded-md border px-3 py-2">{user.name}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600">Email</label>
                          <div className="mt-1 rounded-md border px-3 py-2">{user.email}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600">Téléphone</label>
                          <div className="mt-1 rounded-md border px-3 py-2">{user.phone || "Non renseigné"}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600">Rôle</label>
                          <div className="mt-1 rounded-md border px-3 py-2">
                            {user.role === "admin" ? "Administrateur" : "Client"}
                          </div>
                        </div>
                      </div>
                      <Button className="bg-amber-500 hover:bg-amber-600">Modifier mes informations</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Section Fidélité */}
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
                        <p className="text-2xl font-bold">{loyaltyPoints}</p>
                        <p className="text-sm text-slate-600">points de fidélité</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-medium">
                        Statut actuel:{" "}
                        <span className="text-amber-600">
                          {loyaltyPoints >= 3000
                            ? "PLATINUM"
                            : loyaltyPoints >= 2000
                              ? "GOLD"
                              : loyaltyPoints >= 1000
                                ? "SILVER"
                                : loyaltyPoints >= 500
                                  ? "BRONZE"
                                  : "STANDARD"}
                        </span>
                      </h2>
                      <p className="mt-1 text-slate-600">
                        Continuez à voyager avec nous pour accumuler des points et débloquer des avantages exclusifs.
                      </p>
                      <div className="mt-4">
                        <div className="h-2 w-full rounded-full bg-slate-100">
                          <div
                            className="h-2 rounded-full bg-amber-500"
                            style={{ width: `${Math.min((loyaltyPoints % 1000) / 10, 100)}%` }}
                          ></div>
                        </div>
                        <div className="mt-1 flex justify-between text-xs text-slate-500">
                          <span>0</span>
                          <span>1000</span>
                          <span>2000</span>
                          <span>3000</span>
                        </div>
                      </div>
                      {loyaltyPoints < 3000 && (
                        <p className="mt-2 text-sm text-slate-600">
                          Plus que {1000 - (loyaltyPoints % 1000)} points pour atteindre le niveau suivant
                        </p>
                      )}
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
