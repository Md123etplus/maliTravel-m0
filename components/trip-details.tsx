"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Users, Bus } from "lucide-react"

interface TripDetailsProps {
  from: string
  to: string
  departureDateTime: string
  arrivalDateTime: string
  price: number
  availableSeats: number
  vehicleType: string
  company: string
}

export function TripDetails({
  from,
  to,
  departureDateTime,
  arrivalDateTime,
  price,
  availableSeats,
  vehicleType,
  company,
}: TripDetailsProps) {
  // Safe date parsing with error handling
  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString)
      if (isNaN(date.getTime())) {
        return { date: "Date invalide", time: "Heure invalide" }
      }
      return {
        date: date.toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: date.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
    } catch (error) {
      console.error("Error parsing date:", error)
      return { date: "Date invalide", time: "Heure invalide" }
    }
  }

  // Calculate duration
  const calculateDuration = () => {
    try {
      const departure = new Date(departureDateTime)
      const arrival = new Date(arrivalDateTime)

      if (isNaN(departure.getTime()) || isNaN(arrival.getTime())) {
        return "Durée inconnue"
      }

      const durationMs = arrival.getTime() - departure.getTime()
      const hours = Math.floor(durationMs / (1000 * 60 * 60))
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

      if (hours > 0) {
        return `${hours}h${minutes > 0 ? ` ${minutes}min` : ""}`
      } else {
        return `${minutes}min`
      }
    } catch (error) {
      console.error("Error calculating duration:", error)
      return "Durée inconnue"
    }
  }

  const departure = formatDateTime(departureDateTime)
  const arrival = formatDateTime(arrivalDateTime)
  const duration = calculateDuration()

  // Get availability status
  const getAvailabilityStatus = () => {
    if (availableSeats === 0) {
      return { text: "Complet", color: "bg-red-100 text-red-800" }
    } else if (availableSeats <= 5) {
      return { text: "Peu de places", color: "bg-orange-100 text-orange-800" }
    } else {
      return { text: "Disponible", color: "bg-green-100 text-green-800" }
    }
  }

  const availabilityStatus = getAvailabilityStatus()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Détails du voyage</CardTitle>
            <CardDescription>{company}</CardDescription>
          </div>
          <Badge className={availabilityStatus.color}>{availabilityStatus.text}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Route */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-amber-500" />
              <div>
                <p className="font-semibold">{from}</p>
                <p className="text-sm text-gray-600">{departure.date}</p>
                <p className="text-sm font-medium">{departure.time}</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-px w-12 bg-gray-300"></div>
              <Clock className="h-4 w-4 text-gray-400 my-1" />
              <p className="text-xs text-gray-500">{duration}</p>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-semibold">{to}</p>
                <p className="text-sm text-gray-600">{arrival.date}</p>
                <p className="text-sm font-medium">{arrival.time}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle and availability info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Bus className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Véhicule</p>
              <p className="font-medium">{vehicleType}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Places disponibles</p>
              <p className="font-medium">{availableSeats} sièges</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">€</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Prix par siège</p>
              <p className="font-medium">{price.toLocaleString()} FCFA</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
