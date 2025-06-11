import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Coffee, Wifi, AirVent, Tv, Usb, Utensils } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Service VIP de Transport | Mali Voyages",
  description:
    "Découvrez notre service VIP avec des bus de luxe, des sièges inclinables, des repas à bord et un service personnalisé pour une expérience de voyage exceptionnelle au Mali.",
  keywords:
    "service VIP Mali, bus luxe Mali, transport premium Mali, siège inclinable bus, repas à bord bus Mali, service personnalisé voyage Mali",
  openGraph: {
    title: "Service VIP de Transport | Mali Voyages",
    description:
      "Découvrez notre service VIP avec des bus de luxe, des sièges inclinables, des repas à bord et un service personnalisé.",
    url: "https://malivoyages.ml/services/vip",
    images: [
      {
        url: "https://malivoyages.ml/images/vip-og.jpg",
        width: 1200,
        height: 630,
        alt: "Service VIP Mali Voyages",
      },
    ],
  },
}

export default function VipServicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-12 text-center">
        <Badge className="mb-4 bg-amber-500 text-white hover:bg-amber-600">Service Premium</Badge>
        <h1 className="mb-4 text-4xl font-bold">Voyagez en Classe VIP</h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Découvrez une expérience de voyage exceptionnelle avec notre service VIP. Confort, luxe et attention
          personnalisée pour un voyage inoubliable.
        </p>
      </div>

      {/* Hero Section */}
      <div className="mb-16 overflow-hidden rounded-lg">
        <div className="relative h-[400px] w-full">
          <Image src="/placeholder.svg?height=400&width=1200" alt="Service VIP" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-900/50"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">Le summum du confort et de l'élégance</h2>
            <p className="mb-6 max-w-xl text-lg">
              Notre service VIP est conçu pour les voyageurs exigeants qui recherchent une expérience de voyage
              exceptionnelle.
            </p>
            <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600">
              <Link href="/search">Réserver maintenant</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Caractéristiques */}
      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Caractéristiques exclusives</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <Usb className="h-10 w-10 text-amber-500" />,
              title: "Sièges de luxe",
              description:
                "Sièges en cuir entièrement inclinables avec espace généreux pour les jambes et appui-tête réglable.",
            },
            {
              icon: <Wifi className="h-10 w-10 text-amber-500" />,
              title: "WiFi haut débit",
              description:
                "Restez connecté tout au long de votre voyage avec notre WiFi haut débit gratuit et illimité.",
            },
            {
              icon: <Tv className="h-10 w-10 text-amber-500" />,
              title: "Divertissement à bord",
              description:
                "Écrans individuels avec une sélection de films, séries, musique et jeux pour vous divertir.",
            },
            {
              icon: <Utensils className="h-10 w-10 text-amber-500" />,
              title: "Service de restauration",
              description: "Repas et boissons de qualité servis à bord, avec options pour les régimes spéciaux.",
            },
            {
              icon: <AirVent className="h-10 w-10 text-amber-500" />,
              title: "Climatisation individuelle",
              description: "Contrôle individuel de la température pour un confort personnalisé tout au long du voyage.",
            },
            {
              icon: <Coffee className="h-10 w-10 text-amber-500" />,
              title: "Service personnalisé",
              description: "Personnel attentif et professionnel pour répondre à tous vos besoins pendant le voyage.",
            },
          ].map((feature, index) => (
            <Card key={index}>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-amber-50 p-3">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Comparaison des services */}
      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Comparaison des services</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse rounded-lg">
            <thead>
              <tr>
                <th className="border-b p-4 text-left">Caractéristiques</th>
                <th className="border-b p-4 text-center">Standard</th>
                <th className="border-b p-4 text-center">Confort</th>
                <th className="border-b p-4 text-center bg-amber-50">VIP</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Sièges inclinables", standard: "Non", comfort: "Partiellement", vip: "Entièrement" },
                { feature: "Espace pour les jambes", standard: "Standard", comfort: "Étendu", vip: "Maximum" },
                { feature: "WiFi à bord", standard: "Non", comfort: "Basique", vip: "Haut débit" },
                { feature: "Prises électriques", standard: "Non", comfort: "USB uniquement", vip: "USB et AC" },
                { feature: "Divertissement", standard: "Non", comfort: "Partagé", vip: "Individuel" },
                { feature: "Restauration", standard: "Non", comfort: "Collations", vip: "Repas complet" },
                { feature: "Service personnalisé", standard: "Non", comfort: "Limité", vip: "Complet" },
                { feature: "Bagages", standard: "1 x 20kg", comfort: "1 x 30kg", vip: "2 x 30kg" },
              ].map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="p-4 font-medium">{row.feature}</td>
                  <td className="p-4 text-center">{row.standard}</td>
                  <td className="p-4 text-center">{row.comfort}</td>
                  <td className="p-4 text-center bg-amber-50 font-medium">{row.vip}</td>
                </tr>
              ))}
              <tr>
                <td className="p-4 font-bold">Prix (base)</td>
                <td className="p-4 text-center">8 000 FCFA</td>
                <td className="p-4 text-center">12 000 FCFA</td>
                <td className="p-4 text-center bg-amber-50 font-bold text-amber-600">18 000 FCFA</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Témoignages */}
      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Ce que disent nos clients VIP</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: "Ibrahim Touré",
              role: "Homme d'affaires",
              avatar: "/placeholder.svg?height=100&width=100",
              comment:
                "En tant qu'homme d'affaires qui voyage fréquemment entre Bamako et Ségou, le service VIP de Mali Voyages a transformé mes déplacements. Je peux travailler confortablement pendant le trajet et arriver reposé à destination.",
              rating: 5,
            },
            {
              name: "Aminata Diallo",
              role: "Médecin",
              avatar: "/placeholder.svg?height=100&width=100",
              comment:
                "Le confort des sièges et le service attentionné font toute la différence. Je recommande vivement le service VIP pour ceux qui recherchent une expérience de voyage supérieure.",
              rating: 5,
            },
            {
              name: "Moussa Camara",
              role: "Entrepreneur",
              avatar: "/placeholder.svg?height=100&width=100",
              comment:
                "J'apprécie particulièrement les écrans individuels et le WiFi haut débit qui me permettent de rester productif pendant mes déplacements. Le service de restauration est également excellent.",
              rating: 4,
            },
          ].map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center">
                  <div className="relative mr-4 h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mb-3 flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating ? "fill-amber-500 text-amber-500" : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-slate-600">"{testimonial.comment}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Questions fréquentes</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              question: "Comment puis-je réserver un service VIP?",
              answer:
                "Vous pouvez réserver notre service VIP en ligne sur notre site web, via notre application mobile ou en contactant directement notre service client. Lors de la recherche de votre trajet, sélectionnez simplement l'option VIP.",
            },
            {
              question: "Quelle est la différence entre le service VIP et le service standard?",
              answer:
                "Le service VIP offre des sièges en cuir entièrement inclinables, plus d'espace pour les jambes, des écrans individuels, un service de restauration à bord, le WiFi haut débit et un service personnalisé.",
            },
            {
              question: "Le service VIP est-il disponible sur toutes les lignes?",
              answer:
                "Le service VIP est actuellement disponible sur nos lignes principales: Bamako-Ségou, Bamako-Sikasso et Bamako-Mopti. Nous prévoyons d'étendre ce service à d'autres destinations prochainement.",
            },
            {
              question: "Puis-je modifier ou annuler ma réservation VIP?",
              answer:
                "Oui, vous pouvez modifier ou annuler votre réservation VIP jusqu'à 24 heures avant le départ sans frais. Pour les annulations effectuées moins de 24 heures avant le départ, des frais de 30% s'appliquent.",
            },
          ].map((faq, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="mb-2 font-semibold">{faq.question}</h3>
                <p className="text-slate-600">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-lg bg-amber-50 p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Prêt à vivre l'expérience VIP?</h2>
        <p className="mb-6 mx-auto max-w-2xl text-slate-600">
          Réservez dès maintenant et découvrez pourquoi notre service VIP est le choix privilégié des voyageurs
          exigeants.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600">
            <Link href="/search">Réserver un voyage VIP</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
