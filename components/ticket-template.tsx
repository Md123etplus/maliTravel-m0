"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Share2, QrCode } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface TicketTemplateProps {
  name?: string
  from: string
  to: string
  date?: string
  time?: string
  seats?: string[]
  ticketId?: string
  company?: string
  vehicleType?: string

  // Support pour l'ancienne interface
  ticketNumber?: string
  passengerName?: string
  departureDate?: string
  departureTime?: string
  arrivalTime?: string
  seatNumbers?: string[]
  price?: number
  serviceFee?: number
}

export function TicketTemplate({
  // Nouvelles props
  name,
  from,
  to,
  date,
  time,
  seats = [],
  ticketId,
  company = "Mali Travel",
  vehicleType = "Bus",

  // Anciennes props pour compatibilité
  ticketNumber,
  passengerName,
  departureDate,
  departureTime,
  arrivalTime,
  seatNumbers = [],
  price = 15000,
  serviceFee = 1500,
}: TicketTemplateProps) {
  const ticketRef = useRef<HTMLDivElement>(null)

  // Utiliser les nouvelles props ou les anciennes si disponibles
  const finalName = name || passengerName || "Passager"
  const finalTicketId = ticketId || ticketNumber || `MT-${Math.floor(Math.random() * 10000)}`
  const finalDate = date || departureDate || new Date().toISOString().split("T")[0]
  const finalTime = time || departureTime || "08:00"
  const finalArrivalTime = arrivalTime || "12:30"
  const finalSeats = seats.length > 0 ? seats : seatNumbers

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
      return new Date(dateString).toLocaleDateString("fr-FR", options)
    } catch (error) {
      return dateString
    }
  }

  const downloadAsPDF = async () => {
    if (!ticketRef.current) return

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`billet_${finalTicketId}.pdf`)
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error)
      alert("Une erreur est survenue lors du téléchargement du billet. Veuillez réessayer.")
    }
  }

  const shareTicket = async () => {
    if (!ticketRef.current) return

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      })

      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error("Impossible de créer l'image du billet")
        }

        const file = new File([blob], `billet_${finalTicketId}.png`, { type: "image/png" })

        if (navigator.share) {
          await navigator.share({
            title: "Mon billet Mali Travel",
            text: `Billet de voyage de ${from} à ${to}`,
            files: [file],
          })
        } else {
          alert("Le partage n'est pas pris en charge par votre navigateur")
        }
      }, "image/png")
    } catch (error) {
      console.error("Erreur lors du partage du billet:", error)
      alert("Une erreur est survenue lors du partage du billet. Veuillez réessayer.")
    }
  }

  // Calcul du prix total (si les prix sont fournis)
  const totalPrice = price && finalSeats ? price * finalSeats.length + (serviceFee || 0) : null

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden" ref={ticketRef}>
        {/* En-tête du billet */}
        <div className="bg-amber-500 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Mali Travel</h2>
              <p className="text-sm opacity-90">Votre partenaire de voyage au Mali</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Billet N°</p>
              <p className="font-mono text-lg font-bold">{finalTicketId}</p>
            </div>
          </div>
        </div>

        {/* Corps du billet */}
        <div className="p-6">
          {/* Informations de voyage */}
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Détails du voyage</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">De</span>
                  <span className="font-medium">{from}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">À</span>
                  <span className="font-medium">{to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Date</span>
                  <span className="font-medium">{formatDate(finalDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Départ</span>
                  <span className="font-medium">{finalTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Arrivée</span>
                  <span className="font-medium">{finalArrivalTime}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Informations passager</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Nom</span>
                  <span className="font-medium">{finalName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Siège(s)</span>
                  <span className="font-medium">
                    {finalSeats && finalSeats.length > 0 ? finalSeats.join(", ") : "Non assigné"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Type de véhicule</span>
                  <span className="font-medium">{vehicleType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Compagnie</span>
                  <span className="font-medium">{company}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Séparateur avec motif */}
          <div className="relative my-6">
            <div className="absolute -left-6 h-6 w-6 rounded-full bg-background"></div>
            <div className="absolute -right-6 h-6 w-6 rounded-full bg-background"></div>
            <div className="border-t-2 border-dashed border-slate-200"></div>
          </div>

          {/* Détails du paiement (conditionnels) */}
          {totalPrice && (
            <div className="mb-6">
              <h3 className="mb-4 text-lg font-semibold">Détails du paiement</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Prix du billet ({finalSeats?.length || 1} x {price?.toLocaleString()} FCFA)
                  </span>
                  <span>{((price || 0) * (finalSeats?.length || 1)).toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Frais de service</span>
                  <span>{(serviceFee || 0).toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{totalPrice.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>
          )}

          {/* Code QR */}
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center">
              <QrCode className="h-24 w-24 text-slate-800" />
              <p className="mt-2 text-xs text-slate-500">Scannez pour vérifier le billet</p>
            </div>
          </div>

          {/* Pied de page */}
          <div className="mt-6 border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
            <p>Ce billet est valable uniquement pour la date et l'heure indiquées.</p>
            <p>Veuillez vous présenter 30 minutes avant le départ.</p>
            <p>Pour toute assistance, appelez le +223 XX XX XX XX</p>
          </div>
        </div>
      </Card>

      {/* Boutons d'action */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={downloadAsPDF} className="flex-1 bg-amber-500 hover:bg-amber-600">
          <Download className="mr-2 h-4 w-4" />
          Télécharger le PDF
        </Button>
        <Button onClick={shareTicket} variant="outline" className="flex-1">
          <Share2 className="mr-2 h-4 w-4" />
          Partager
        </Button>
      </div>
    </div>
  )
}
