"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TicketTemplate } from "@/components/ticket-template"
import { Check, Download, ArrowLeft, Share2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ConfirmationPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const seats = searchParams?.get("seats")?.split(",") || []
  const name = searchParams?.get("name") || "Passager"
  const paymentMethod = searchParams?.get("method") || "card"

  // Données simulées pour le voyage
  const trip = {
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
  }

  // Simuler l'envoi d'un email de confirmation
  useEffect(() => {
    const timer = setTimeout(() => {
      toast({
        title: "Email de confirmation envoyé",
        description: "Un email contenant les détails de votre réservation a été envoyé à votre adresse email.",
      })
    }, 2000)

    return () => clearTimeout(timer)
  }, [toast])

  const handleDownloadTicket = () => {
    setIsGeneratingPDF(true)

    // Simuler le téléchargement d'un PDF
    setTimeout(() => {
      toast({
        title: "Billet téléchargé",
        description: "Votre billet a été téléchargé avec succès.",
      })
      setIsGeneratingPDF(false)
    }, 2000)
  }

  const handleShareTicket = () => {
    // Simuler le partage du billet
    if (navigator.share) {
      navigator
        .share({
          title: `Billet de voyage ${trip.from} - ${trip.to}`,
          text: `Mon billet de voyage de ${trip.from} à ${trip.to} le ${trip.departureDate}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Erreur lors du partage:", error))
    } else {
      toast({
        title: "Partage non supporté",
        description: "Le partage n'est pas supporté sur votre appareil.",
      })
    }
  }

  // Obtenir l'icône et la couleur en fonction de la méthode de paiement
  const getPaymentMethodInfo = () => {
    switch (paymentMethod) {
      case "orange":
        return { color: "text-orange-600", bgColor: "bg-orange-100", name: "Orange Money" }
      case "moov":
        return { color: "text-blue-600", bgColor: "bg-blue-100", name: "Moov Money" }
      case "wave":
        return { color: "text-teal-600", bgColor: "bg-teal-100", name: "Wave" }
      default:
        return { color: "text-slate-600", bgColor: "bg-slate-100", name: "Carte bancaire" }
    }
  }

  const paymentInfo = getPaymentMethodInfo()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-amber-500 hover:text-amber-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Link>
      </div>

      <div className="mx-auto max-w-3xl">
        <Card className="mb-8 border-green-100 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-green-800">Réservation confirmée !</h2>
                <p className="text-green-700">Votre paiement a été traité avec succès via {paymentInfo.name}.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Détails de la réservation</CardTitle>
            <CardDescription>
              Référence de réservation: {trip.id}-{Math.floor(Math.random() * 10000)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <TicketTemplate
                name={name}
                from={trip.from}
                to={trip.to}
                date={trip.departureDate}
                time={trip.departureTime}
                seats={seats}
                ticketId={`${trip.id}-${Math.floor(Math.random() * 10000)}`}
                company={trip.company}
                vehicleType={trip.vehicleType}
              />

              <div className="mt-6 flex flex-wrap gap-4">
                <Button
                  onClick={handleDownloadTicket}
                  className="flex-1 bg-amber-500 hover:bg-amber-600"
                  disabled={isGeneratingPDF}
                >
                  {isGeneratingPDF ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger le billet
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleShareTicket} className="flex-1">
                  <Share2 className="mr-2 h-4 w-4" />
                  Partager le billet
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 rounded-md bg-amber-50 p-6">
          <h3 className="text-lg font-semibold text-amber-800">Informations importantes</h3>
          <ul className="ml-6 list-disc space-y-2 text-amber-700">
            <li>Veuillez vous présenter au moins 30 minutes avant le départ.</li>
            <li>N'oubliez pas votre pièce d'identité pour l'embarquement.</li>
            <li>Vous pouvez emporter un bagage à main et un bagage en soute.</li>
            <li>En cas d'annulation, veuillez nous contacter au moins 24h à l'avance.</li>
          </ul>
          <div className="mt-4">
            <p className="font-medium text-amber-800">Besoin d'aide ?</p>
            <p className="text-amber-700">
              Contactez notre service client au +223 XX XX XX XX ou par email à support@malivoyages.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
