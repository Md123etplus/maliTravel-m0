import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Users } from "lucide-react"

interface BookingSummaryProps {
  basePrice: number
  selectedSeats: number[]
  serviceFee: number
  contactInfo?: {
    name: string
    email: string
    phone: string
  }
}

export function BookingSummary({ basePrice, selectedSeats, serviceFee, contactInfo }: BookingSummaryProps) {
  const subtotal = basePrice * selectedSeats.length
  const total = subtotal + serviceFee

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Résumé de la réservation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="font-medium">Prix du billet</div>
              <div>{basePrice.toLocaleString()} FCFA</div>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <div>Prix par personne</div>
              <div></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 font-medium">
              <Users className="h-4 w-4" />
              <span>
                {selectedSeats.length} siège{selectedSeats.length > 1 ? "s" : ""}
              </span>
            </div>
            <div>{subtotal.toLocaleString()} FCFA</div>
          </div>

          {selectedSeats.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="font-medium">Sièges sélectionnés</div>
              <div>{selectedSeats.join(", ")}</div>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div className="font-medium">Sous-total</div>
            <div>{subtotal.toLocaleString()} FCFA</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="font-medium">Frais de service</div>
            <div>{serviceFee.toLocaleString()} FCFA</div>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-lg font-bold">
            <div>Total</div>
            <div>{total.toLocaleString()} FCFA</div>
          </div>

          {contactInfo && contactInfo.name && (
            <>
              <Separator />
              <div>
                <div className="font-medium">Informations de contact</div>
                <div className="mt-2 space-y-1 text-sm">
                  <div>{contactInfo.name}</div>
                  <div>{contactInfo.email}</div>
                  <div>{contactInfo.phone}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
