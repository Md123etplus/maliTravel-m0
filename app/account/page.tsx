"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Calendar,
  Star,
  CreditCard,
  Settings,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import AccountSidebar from "@/components/account-sidebar"
import {
  databases,
  DATABASE_ID,
  COLLECTION_BOOKINGS,
  COLLECTION_REVIEWS,
  COLLECTION_PAYMENTS,
} from "@/lib/appwrite/config"
import { Query } from "appwrite"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"

interface Booking {
  $id: string
  trip_id: string
  user_id: string
  booking_date: string
  status: string
  total_amount: number
  seats_booked: number
  passenger_details: any
}

interface Review {
  $id: string
  trip_id: string
  user_id: string
  rating: number
  comment: string
  created_at: string
}

interface Payment {
  $id: string
  booking_id: string
  user_id: string
  amount: number
  payment_method: string
  status: string
  transaction_id: string
  created_at: string
}

export default function AccountPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: "",
  })

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: "",
      })
    }
  }, [user])

  // Load user data based on active tab
  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      setIsLoading(true)
      try {
        if (activeTab === "bookings") {
          const bookingsResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_BOOKINGS, [
            Query.equal("user_id", user.$id),
          ])
          setBookings(bookingsResponse.documents as any[])
        } else if (activeTab === "reviews") {
          const reviewsResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_REVIEWS, [
            Query.equal("user_id", user.$id),
          ])
          setReviews(reviewsResponse.documents as any[])
        } else if (activeTab === "payments") {
          const paymentsResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_PAYMENTS, [
            Query.equal("user_id", user.$id),
          ])
          setPayments(paymentsResponse.documents as any[])
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [activeTab, user])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement profile update
    console.log("Profile update:", profileForm)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmé":
      case "confirmed":
      case "payé":
      case "paid":
        return "bg-green-100 text-green-800"
      case "en attente":
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "annulé":
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmé":
      case "confirmed":
      case "payé":
      case "paid":
        return <CheckCircle className="h-4 w-4" />
      case "en attente":
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      case "annulé":
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
    ))
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Accès non autorisé</h1>
          <p className="text-slate-600 mb-6">Vous devez être connecté pour accéder à cette page.</p>
          <Link href="/login">
            <Button>Se connecter</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mon compte</h1>
        <p className="text-slate-600">Gérez vos informations personnelles et vos réservations</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <AccountSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="lg:col-span-3">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.profile_image || "/placeholder.svg?height=100&width=100"} />
                    <AvatarFallback className="text-lg">
                      {user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-slate-600">{user.email}</p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      <Edit className="h-4 w-4 mr-2" />
                      Changer la photo
                    </Button>
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Nom complet</Label>
                      <Input
                        id="name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="Parlez-nous de vous..."
                    />
                  </div>
                  <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                    Mettre à jour le profil
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "bookings" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Mes réservations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune réservation</h3>
                    <p className="text-slate-600 mb-4">Vous n'avez pas encore effectué de réservation.</p>
                    <Link href="/search">
                      <Button className="bg-amber-500 hover:bg-amber-600">Rechercher un voyage</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.$id} className="border-l-4 border-l-amber-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={getStatusColor(booking.status)}>
                                  {getStatusIcon(booking.status)}
                                  <span className="ml-1">{booking.status}</span>
                                </Badge>
                                <span className="text-sm text-slate-500">
                                  Réservé le {format(new Date(booking.booking_date), "PPP", { locale: fr })}
                                </span>
                              </div>
                              <div className="grid gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-slate-400" />
                                  <span>Voyage ID: {booking.trip_id}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-slate-400" />
                                  <span>
                                    {booking.seats_booked} place{booking.seats_booked > 1 ? "s" : ""}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-amber-600">
                                {booking?.total_amount?.toLocaleString()} FCFA
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Button size="sm" variant="outline">
                                  Voir détails
                                </Button>
                                {booking.status === "confirmé" && (
                                  <Link href={`/booking/${booking.trip_id}/review`}>
                                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                                      Laisser un avis
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "reviews" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Mes avis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun avis</h3>
                    <p className="text-slate-600 mb-4">Vous n'avez pas encore laissé d'avis.</p>
                    <Link href="/account?tab=bookings">
                      <Button className="bg-amber-500 hover:bg-amber-600">Voir mes réservations</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.$id} className="border-l-4 border-l-amber-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="flex">{renderStars(review.rating)}</div>
                              <span className="text-sm text-slate-500">
                                {format(new Date(review.created_at), "PPP", { locale: fr })}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-slate-700 mb-2">{review.comment}</p>
                          <div className="text-sm text-slate-500">Voyage ID: {review.trip_id}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "payments" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Historique des paiements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun paiement</h3>
                    <p className="text-slate-600 mb-4">Vous n'avez pas encore effectué de paiement.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <Card key={payment.$id} className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={getStatusColor(payment.status)}>
                                  {getStatusIcon(payment.status)}
                                  <span className="ml-1">{payment.status}</span>
                                </Badge>
                                <span className="text-sm text-slate-500">
                                  {format(new Date(payment.created_at), "PPP", { locale: fr })}
                                </span>
                              </div>
                              <div className="grid gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-slate-400" />
                                  <span>{payment.payment_method}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-slate-400" />
                                  <span>Transaction: {payment.transaction_id}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">{payment.amount.toLocaleString()} FCFA</p>
                              <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                                Télécharger reçu
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Paramètres du compte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Notifications par email</p>
                          <p className="text-sm text-slate-600">Recevoir des notifications par email</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Activer
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Notifications SMS</p>
                          <p className="text-sm text-slate-600">Recevoir des notifications par SMS</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Activer
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Sécurité</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        Changer le mot de passe
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        Authentification à deux facteurs
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Données</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        Exporter mes données
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
                      >
                        Supprimer mon compte
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
