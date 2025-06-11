import { Card, CardContent } from "@/components/ui/card"
import { Bus, Calendar, CreditCard, Shield } from "lucide-react"

export function Services() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[
        {
          icon: <Bus className="h-10 w-10 text-amber-500" />,
          title: "Transport en bus",
          description: "Notre flotte de bus modernes offre confort et sécurité pour tous vos déplacements au Mali.",
        },
        {
          icon: <Calendar className="h-10 w-10 text-amber-500" />,
          title: "Réservation en ligne",
          description: "Réservez vos billets en ligne, choisissez votre siège et payez en quelques clics.",
        },
        {
          icon: <CreditCard className="h-10 w-10 text-amber-500" />,
          title: "Paiement sécurisé",
          description: "Plusieurs options de paiement sécurisées: Orange Money, Moov Money, Wave et carte bancaire.",
        },
        {
          icon: <Shield className="h-10 w-10 text-amber-500" />,
          title: "Sécurité garantie",
          description:
            "Votre sécurité est notre priorité avec des chauffeurs expérimentés et des véhicules bien entretenus.",
        },
      ].map((service, index) => (
        <Card key={index}>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="mb-4 rounded-full bg-amber-50 p-3">{service.icon}</div>
            <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
            <p className="text-slate-600">{service.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
