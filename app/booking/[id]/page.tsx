"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SeatSelector } from "@/components/seat-selector"
import { TripDetails } from "@/components/trip-details"
import { BookingSummary } from "@/components/booking-summary"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Smartphone, AlertCircle } from "lucide-react"

// Types pour les données du voyage
interface Trip {
  id: string
  from: string
  to: string
  departureDate: string
  departureTime: string
  arrivalDate: string
  arrivalTime: string
  price: number
  vehicleType: string
  company: string
  availableSeats: number
}

// Types pour les données du passager
interface PassengerInfo {
  fullName: string
  email: string
  phone: string
  idNumber: string
}

// Types pour les données de paiement
interface PaymentInfo {
  method: "card" | "orange" | "moov" | "wave"
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  cvv?: string
  mobileNumber?: string
}

export default function BookingPage({ params }: { params: { id: string } }) {
  const { user, isLoading: authIsLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("seats")
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [passengerInfo, setPassengerInfo] = useState<PassengerInfo>({
    fullName: "",
    email: "",
    phone: "",
    idNumber: "",
  })
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: "card",
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    mobileNumber: "",
  })
  const [trip, setTrip] = useState<Trip | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [processingPayment, setProcessingPayment] = useState(false)

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    if (!authIsLoading && !user) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      router.push(`/login?redirect=/booking/${params.id}`)
    }
  }, [user, authIsLoading, router, params.id])

  // Simuler le chargement des données du voyage
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        // Simuler un appel API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Données fictives du voyage
        const tripData: Trip = {
          id: params.id,
          from: "Bamako",
          to: "Ségou",
          departureDate: "2023-07-15",
          departureTime: "08:00",
          arrivalDate: "2023-07-15",
          arrivalTime: "12:30",
          price: 15000,
          vehicleType: "Bus",
          company: "Mali Travel Express",
          availableSeats: 40,
        }

        setTrip(tripData)
      } catch (error) {
        console.error("Erreur lors du chargement des données du voyage:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails du voyage. Veuillez réessayer.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrip()
  }, [params.id, toast])

  // Pré-remplir les informations du passager si l'utilisateur est connecté
  useEffect(() => {
    if (user) {
      setPassengerInfo((prev) => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
      }))
    }
  }, [user])

  // Pré-remplir le numéro de téléphone mobile pour les paiements mobiles
  useEffect(() => {
    if (passengerInfo.phone) {
      setPaymentInfo((prev) => ({
        ...prev,
        mobileNumber: passengerInfo.phone,
      }))
    }
  }, [passengerInfo.phone])

  const handleSeatSelection = (seatNumber: number) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((seat) => seat !== seatNumber)
      } else {
        return [...prev, seatNumber]
      }
    })
  }

  const handlePassengerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPassengerInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePaymentMethodChange = (value: string) => {
    setPaymentInfo((prev) => ({
      ...prev,
      method: value as "card" | "orange" | "moov" | "wave",
    }))
  }

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validatePaymentInfo = () => {
    const { method } = paymentInfo

    if (method === "card") {
      const { cardNumber, cardHolder, expiryDate, cvv } = paymentInfo
      if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        toast({
          title: "Informations de paiement incomplètes",
          description: "Veuillez remplir toutes les informations de la carte bancaire.",
          variant: "destructive",
        })
        return false
      }
    } else if (["orange", "moov", "wave"].includes(method)) {
      const { mobileNumber } = paymentInfo
      if (!mobileNumber) {
        toast({
          title: "Numéro de téléphone requis",
          description: "Veuillez entrer votre numéro de téléphone mobile pour le paiement.",
          variant: "destructive",
        })
        return false
      }
    }

    return true
  }

  const handleContinue = () => {
    if (activeTab === "seats") {
      if (selectedSeats.length === 0) {
        toast({
          title: "Sélection de siège requise",
          description: "Veuillez sélectionner au moins un siège pour continuer.",
          variant: "destructive",
        })
        return
      }
      setActiveTab("passenger")
    } else if (activeTab === "passenger") {
      // Vérifier que toutes les informations du passager sont remplies
      const { fullName, email, phone, idNumber } = passengerInfo
      if (!fullName || !email || !phone || !idNumber) {
        toast({
          title: "Informations incomplètes",
          description: "Veuillez remplir toutes les informations du passager pour continuer.",
          variant: "destructive",
        })
        return
      }
      setActiveTab("payment")
    } else if (activeTab === "payment") {
      // Vérifier que toutes les informations de paiement sont remplies
      if (!validatePaymentInfo()) {
        return
      }

      // Simuler le traitement du paiement
      setProcessingPayment(true)
      toast({
        title: "Traitement du paiement",
        description: "Veuillez patienter pendant que nous traitons votre paiement...",
      })

      // Simuler un délai de traitement
      setTimeout(() => {
        setProcessingPayment(false)

        // Simuler une confirmation de paiement mobile si nécessaire
        if (paymentInfo.method !== "card") {
          toast({
            title: "Confirmation requise",
            description: `Veuillez confirmer le paiement sur votre téléphone mobile. Un code a été envoyé au ${paymentInfo.mobileNumber}.`,
          })

          // Simuler une confirmation après quelques secondes
          setTimeout(() => {
            router.push(
              `/booking/${params.id}/confirmation?seats=${selectedSeats.join(",")}&name=${encodeURIComponent(
                passengerInfo.fullName,
              )}&method=${paymentInfo.method}`,
            )
          }, 3000)
        } else {
          // Redirection directe pour le paiement par carte
          router.push(
            `/booking/${params.id}/confirmation?seats=${selectedSeats.join(",")}&name=${encodeURIComponent(
              passengerInfo.fullName,
            )}&method=${paymentInfo.method}`,
          )
        }
      }, 2000)
    }
  }

  const handleBack = () => {
    if (activeTab === "passenger") {
      setActiveTab("seats")
    } else if (activeTab === "payment") {
      setActiveTab("passenger")
    }
  }

  if (isLoading || !trip) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium">Chargement des détails du voyage...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">Réservation de billet</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger value="seats">Sièges</TabsTrigger>
              <TabsTrigger value="passenger">Passager</TabsTrigger>
              <TabsTrigger value="payment">Paiement</TabsTrigger>
            </TabsList>

            <Card>
              <CardContent className="p-6">
                <TabsContent value="seats" className="mt-0">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Sélectionnez vos sièges</h2>
                    <SeatSelector
                      selectedSeats={selectedSeats}
                      onSeatSelect={handleSeatSelection}
                      totalSeats={trip.availableSeats}
                      bookedSeats={[3, 7, 12, 15, 22, 28, 33]}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="passenger" className="mt-0">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Informations du passager</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nom complet</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={passengerInfo.fullName}
                          onChange={handlePassengerInfoChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={passengerInfo.email}
                          onChange={handlePassengerInfoChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={passengerInfo.phone}
                          onChange={handlePassengerInfoChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="idNumber">Numéro de pièce d'identité</Label>
                        <Input
                          id="idNumber"
                          name="idNumber"
                          value={passengerInfo.idNumber}
                          onChange={handlePassengerInfoChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="payment" className="mt-0">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Méthode de paiement</h2>

                    <RadioGroup
                      value={paymentInfo.method}
                      onValueChange={handlePaymentMethodChange}
                      className="grid gap-4 md:grid-cols-2"
                    >
                      <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-slate-50">
                        <RadioGroupItem value="card" id="payment-card" />
                        <Label htmlFor="payment-card" className="flex items-center">
                          <CreditCard className="mr-2 h-5 w-5 text-slate-600" />
                          Carte bancaire
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-orange-50">
                        <RadioGroupItem value="orange" id="payment-orange" />
                        <Label htmlFor="payment-orange" className="flex items-center">
                          <Smartphone className="mr-2 h-5 w-5 text-orange-600" />
                          Orange Money
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-blue-50">
                        <RadioGroupItem value="moov" id="payment-moov" />
                        <Label htmlFor="payment-moov" className="flex items-center">
                          <Smartphone className="mr-2 h-5 w-5 text-blue-600" />
                          Moov Money
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 rounded-md border p-4 hover:bg-teal-50">
                        <RadioGroupItem value="wave" id="payment-wave" />
                        <Label htmlFor="payment-wave" className="flex items-center">
                          <Smartphone className="mr-2 h-5 w-5 text-teal-600" />
                          Wave
                        </Label>
                      </div>
                    </RadioGroup>

                    {/* Formulaire de paiement par carte bancaire */}
                    {paymentInfo.method === "card" && (
                      <div className="mt-6 space-y-4 rounded-md border border-slate-200 bg-slate-50 p-4">
                        <h3 className="font-medium">Informations de carte bancaire</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="cardNumber">Numéro de carte</Label>
                            <Input
                              id="cardNumber"
                              name="cardNumber"
                              value={paymentInfo.cardNumber}
                              onChange={handlePaymentInfoChange}
                              placeholder="1234 5678 9012 3456"
                              required
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="cardHolder">Titulaire de la carte</Label>
                            <Input
                              id="cardHolder"
                              name="cardHolder"
                              value={paymentInfo.cardHolder}
                              onChange={handlePaymentInfoChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Date d'expiration</Label>
                            <Input
                              id="expiryDate"
                              name="expiryDate"
                              value={paymentInfo.expiryDate}
                              onChange={handlePaymentInfoChange}
                              placeholder="MM/AA"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              name="cvv"
                              value={paymentInfo.cvv}
                              onChange={handlePaymentInfoChange}
                              placeholder="123"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Formulaire de paiement mobile (Orange Money) */}
                    {paymentInfo.method === "orange" && (
                      <div className="mt-6 space-y-4 rounded-md border border-orange-200 bg-orange-50 p-4">
                        <div className="flex items-start">
                          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                            <Smartphone className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-orange-800">Paiement par Orange Money</h3>
                            <p className="mt-1 text-sm text-orange-700">
                              Vous recevrez un message sur votre téléphone pour confirmer le paiement.
                            </p>
                            <div className="mt-3 space-y-3">
                              <div className="space-y-2">
                                <Label htmlFor="mobileNumber" className="text-orange-800">
                                  Numéro Orange Money
                                </Label>
                                <Input
                                  id="mobileNumber"
                                  name="mobileNumber"
                                  value={paymentInfo.mobileNumber}
                                  onChange={handlePaymentInfoChange}
                                  placeholder="+223 XX XX XX XX"
                                  className="border-orange-200 bg-white"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Formulaire de paiement mobile (Moov Money) */}
                    {paymentInfo.method === "moov" && (
                      <div className="mt-6 space-y-4 rounded-md border border-blue-200 bg-blue-50 p-4">
                        <div className="flex items-start">
                          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                            <Smartphone className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-blue-800">Paiement par Moov Money</h3>
                            <p className="mt-1 text-sm text-blue-700">
                              Vous recevrez un message sur votre téléphone pour confirmer le paiement.
                            </p>
                            <div className="mt-3 space-y-3">
                              <div className="space-y-2">
                                <Label htmlFor="mobileNumber" className="text-blue-800">
                                  Numéro Moov Money
                                </Label>
                                <Input
                                  id="mobileNumber"
                                  name="mobileNumber"
                                  value={paymentInfo.mobileNumber}
                                  onChange={handlePaymentInfoChange}
                                  placeholder="+223 XX XX XX XX"
                                  className="border-blue-200 bg-white"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Formulaire de paiement mobile (Wave) */}
                    {paymentInfo.method === "wave" && (
                      <div className="mt-6 space-y-4 rounded-md border border-teal-200 bg-teal-50 p-4">
                        <div className="flex items-start">
                          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                            <Smartphone className="h-5 w-5 text-teal-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-teal-800">Paiement par Wave</h3>
                            <p className="mt-1 text-sm text-teal-700">
                              Vous recevrez un message sur votre téléphone pour confirmer le paiement.
                            </p>
                            <div className="mt-3 space-y-3">
                              <div className="space-y-2">
                                <Label htmlFor="mobileNumber" className="text-teal-800">
                                  Numéro Wave
                                </Label>
                                <Input
                                  id="mobileNumber"
                                  name="mobileNumber"
                                  value={paymentInfo.mobileNumber}
                                  onChange={handlePaymentInfoChange}
                                  placeholder="+223 XX XX XX XX"
                                  className="border-teal-200 bg-white"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Informations de sécurité */}
                    <div className="mt-4 rounded-md bg-amber-50 p-4">
                      <div className="flex items-start">
                        <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
                        <div>
                          <h3 className="font-medium text-amber-800">Paiement sécurisé</h3>
                          <p className="mt-1 text-sm text-amber-700">
                            Toutes vos informations de paiement sont cryptées et sécurisées. Nous ne stockons pas vos
                            données de carte bancaire.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <div className="mt-6 flex justify-between">
                  {activeTab !== "seats" && (
                    <Button variant="outline" onClick={handleBack} disabled={processingPayment}>
                      Retour
                    </Button>
                  )}
                  <Button
                    className="ml-auto bg-amber-500 hover:bg-amber-600"
                    onClick={handleContinue}
                    disabled={processingPayment}
                  >
                    {processingPayment ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Traitement en cours...
                      </>
                    ) : activeTab === "payment" ? (
                      "Confirmer et payer"
                    ) : (
                      "Continuer"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Tabs>
        </div>

        <div>
          <div className="sticky top-4 space-y-6">
            <TripDetails
              from={trip.from}
              to={trip.to}
              departureDate={trip.departureDate}
              departureTime={trip.departureTime}
              arrivalDate={trip.arrivalDate}
              arrivalTime={trip.arrivalTime}
              vehicleType={trip.vehicleType}
              company={trip.company}
            />

            <BookingSummary basePrice={trip.price} selectedSeats={selectedSeats} serviceFee={1500} />
          </div>
        </div>
      </div>
    </div>
  )
}
