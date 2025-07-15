"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, CreditCard } from "lucide-react"

interface BookingSummaryProps {
  from: string
  to: string
  date: string
  time: string
  seats: number[]
  pricePerSeat: number
  serviceFee: number
  paymentMethod: string
}

export function BookingSummary({
  from,
  to,
  date,
  time,
  seats,
  pricePerSeat,
  serviceFee,
  paymentMethod,
}: BookingSummaryProps) {
  const subtotal = seats.length * pricePerSeat
  const total = subtotal + serviceFee

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Date invalide"
      }
      return date.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return "Date invalide"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Récapitulatif de la réservation</CardTitle>
        <CardDescription>Vérifiez les détails de votre voyage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Trip details */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-amber-500" />
            <span className="text-sm">
              <span className="font-medium">{from}</span> → <span className="font-medium">{to}</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="text-sm">{formatDate(date)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-green-500" />
            <span className="text-sm">Départ à {time}</span>
          </div>
        </div>

        <Separator />

        {/* Seat selection */}
        <div>
          <h4 className="font-medium mb-2">Sièges sélectionnés</h4>
          {seats.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {seats
                .sort((a, b) => a - b)
                .map((seat) => (
                  <Badge key={seat} variant="secondary" className="bg-amber-100 text-amber-800">
                    Siège {seat}
                  </Badge>
                ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aucun siège sélectionné</p>
          )}
        </div>

        <Separator />

        {/* Price breakdown */}
        <div className="space-y-2">
          <h4 className="font-medium">Détail des prix</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>
                {seats.length} siège{seats.length > 1 ? "s" : ""} × {pricePerSeat.toLocaleString()} FCFA
              </span>
              <span>{subtotal.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between">
              <span>Frais de service</span>
              <span>{serviceFee.toLocaleString()} FCFA</span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{total.toLocaleString()} FCFA</span>
          </div>
        </div>

        <Separator />

        {/* Payment method */}
        <div className="flex items-center space-x-2">
          <CreditCard className="h-4 w-4 text-purple-500" />
          <span className="text-sm">
            <span className="text-gray-600">Paiement via</span> <span className="font-medium">{paymentMethod}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
