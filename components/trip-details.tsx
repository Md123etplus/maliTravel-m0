import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Bus, Wifi, AirVent, Coffee } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

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

interface TripDetailsProps {
  from: string
  to: string
  departureDate: string
  departureTime: string
  arrivalDate: string
  arrivalTime: string
  vehicleType: string
  company: string
  amenities?: string[]
}

export function TripDetails({
  from,
  to,
  departureDate,
  departureTime,
  arrivalTime,
  vehicleType,
  company,
  amenities = ["wifi", "ac", "snacks"],
}: TripDetailsProps) {
  // Formatage des dates
  const formattedDepartureDate = new Date(`${departureDate}T${departureTime}:00`)
  const formattedArrivalTime = new Date(`${departureDate}T${arrivalTime}:00`)

  // Calcul de la durée du voyage en heures
  const durationHours = Math.round(
    (formattedArrivalTime.getTime() - formattedDepartureDate.getTime()) / (1000 * 60 * 60),
  )

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Détails du voyage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Badge
              className={
                vehicleType.toLowerCase() === "premium"
                  ? "bg-amber-100 text-amber-800"
                  : vehicleType.toLowerCase() === "night"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-slate-100 text-slate-800"
              }
            >
              {vehicleType.toLowerCase() === "premium"
                ? "Premium"
                : vehicleType.toLowerCase() === "night"
                  ? "Bus de nuit"
                  : vehicleType}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-500" />
            <div>
              <div className="font-medium">{from}</div>
              <div className="text-sm text-slate-500">Gare routière de {from}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-500" />
            <div>
              <div className="font-medium">{format(formattedDepartureDate, "EEEE d MMMM yyyy", { locale: fr })}</div>
              <div className="text-sm text-slate-500">Date de départ</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <div>
              <div className="font-medium">
                {format(formattedDepartureDate, "HH:mm")} - {format(formattedArrivalTime, "HH:mm")}
              </div>
              <div className="text-sm text-slate-500">Durée: {durationHours} heures</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-500" />
            <div>
              <div className="font-medium">{to}</div>
              <div className="text-sm text-slate-500">Gare routière de {to}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Bus className="h-5 w-5 text-amber-500" />
            <div>
              <div className="font-medium">{company}</div>
              <div className="text-sm text-slate-500">Compagnie de transport</div>
            </div>
          </div>

          {amenities && amenities.length > 0 && (
            <div className="flex items-center gap-2">
              <Bus className="h-5 w-5 text-amber-500" />
              <div>
                <div className="font-medium">Équipements</div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700"
                    >
                      {getAmenityIcon(amenity)}
                      <span>{getAmenityLabel(amenity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
