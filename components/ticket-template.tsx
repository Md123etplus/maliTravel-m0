"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, Clock, User, Hash, Bus } from "lucide-react"

interface TicketTemplateProps {
  name: string
  from: string
  to: string
  date: string
  time: string
  seats: string[]
  ticketId: string
  company: string
  vehicleType: string
}

export function TicketTemplate({
  name,
  from,
  to,
  date,
  time,
  seats,
  ticketId,
  company,
  vehicleType,
}: TicketTemplateProps) {
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
    <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-amber-800">{company}</h2>
            <p className="text-amber-600">Billet de voyage électronique</p>
          </div>

          <Separator className="bg-amber-200" />

          {/* Passenger info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-gray-600">Passager</span>
              </div>
              <p className="font-semibold text-lg">{name}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-gray-600">Référence</span>
              </div>
              <p className="font-mono text-sm bg-white px-2 py-1 rounded border">
                {ticketId.substring(0, 8).toUpperCase()}
              </p>
            </div>
          </div>

          <Separator className="bg-amber-200" />

          {/* Trip details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MapPin className="h-5 w-5 text-amber-600" />
                  <span className="text-sm text-gray-600">Départ</span>
                </div>
                <p className="font-bold text-xl">{from}</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-px w-16 bg-amber-300 mb-2"></div>
                <Bus className="h-6 w-6 text-amber-600" />
                <div className="h-px w-16 bg-amber-300 mt-2"></div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Arrivée</span>
                </div>
                <p className="font-bold text-xl">{to}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Date</span>
                </div>
                <p className="font-medium">{formatDate(date)}</p>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Heure</span>
                </div>
                <p className="font-medium">{time}</p>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Bus className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-gray-600">Véhicule</span>
                </div>
                <p className="font-medium">{vehicleType}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-amber-200" />

          {/* Seats */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Siège{seats.length > 1 ? "s" : ""} assigné{seats.length > 1 ? "s" : ""}
            </p>
            <div className="flex justify-center space-x-2">
              {seats.map((seat) => (
                <Badge key={seat} className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1">
                  {seat}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="bg-amber-200" />

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>Veuillez vous présenter 30 minutes avant le départ</p>
            <p>Pièce d'identité obligatoire pour l'embarquement</p>
            <p>Ce billet est valable uniquement pour le voyage indiqué</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
