import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, Bus, Calendar, CreditCard, Shield, Users, MapPin, Clock, Headphones, Gift } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nos Services de Transport | Mali Voyages",
  description:
    "Découvrez nos services de transport en bus, réservation en ligne, paiement sécurisé et bien plus pour voyager confortablement au Mali.",
  keywords:
    "services transport Mali, bus Mali, réservation en ligne, paiement sécurisé, WiFi bus, climatisation, service VIP",
  openGraph: {
    title: "Nos Services de Transport | Mali Voyages",
    description: "Découvrez nos services de transport en bus, réservation en ligne, paiement sécurisé et bien plus.",
    url: "https://malivoyages.ml/services",
    images: [
      {
        url: "https://malivoyages.ml/images/services-og.jpg",
        width: 1200,
        height: 630,
        alt: "Services Mali Voyages",
      },
    ],
  },
}

const services = [
  {
    id: "bus",
    icon: <Bus className="h-10 w-10 text-amber-500" />,
    title: "Transport en bus",
    description:
      "Notre flotte de bus modernes offre confort et sécurité pour tous vos déplacements au Mali. Climatisation, WiFi et sièges spacieux pour un voyage agréable.",
    features: [
      "Flotte moderne et bien entretenue",
      "Sièges confortables et spacieux",
      "Climatisation dans tous les véhicules",
      "WiFi gratuit à bord",
      "Prises USB pour charger vos appareils",
      "Toilettes à bord sur les longs trajets",
    ],
  },
  {
    id: "booking",
    icon: <Calendar className="h-10 w-10 text-amber-500" />,
    title: "Réservation en ligne",
    description:
      "Réservez vos billets en ligne, choisissez votre siège et payez en quelques clics. Notre système de réservation est simple, rapide et sécurisé.",
    features: [
      "Réservation 24h/24 et 7j/7",
      "Sélection de siège personnalisée",
      "Confirmation instantanée par SMS et email",
      "Modification et annulation flexibles",
      "Historique de réservation accessible",
      "Réservation pour groupes disponible",
    ],
  },
  {
    id: "payment",
    icon: <CreditCard className="h-10 w-10 text-amber-500" />,
    title: "Paiement sécurisé",
    description:
      "Plusieurs options de paiement sécurisées: Orange Money, Moov Money, Wave et carte bancaire. Vos transactions sont protégées et instantanées.",
    features: [
      "Paiement mobile (Orange Money, Moov Money, Wave)",
      "Paiement par carte bancaire",
      "Transactions sécurisées et cryptées",
      "Reçu de paiement instantané",
      "Remboursement rapide en cas d'annulation",
      "Pas de frais cachés",
    ],
  },
  {
    id: "safety",
    icon: <Shield className="h-10 w-10 text-amber-500" />,
    title: "Sécurité garantie",
    description:
      "Votre sécurité est notre priorité avec des chauffeurs expérimentés et des véhicules bien entretenus. Voyagez en toute tranquillité avec Mali Voyages.",
    features: [
      "Chauffeurs professionnels et expérimentés",
      "Maintenance régulière des véhicules",
      "Respect des normes de sécurité",
      "Assurance voyage incluse",
      "Suivi GPS des véhicules",
      "Protocoles sanitaires stricts",
    ],
  },
  {
    id: "groups",
    icon: <Users className="h-10 w-10 text-amber-500" />,
    title: "Voyages de groupe",
    description:
      "Organisez votre voyage de groupe avec Mali Voyages. Nous offrons des tarifs spéciaux et des services personnalisés pour les groupes de toutes tailles.",
    features: [
      "Tarifs préférentiels pour les groupes",
      "Réservation de bus entiers possible",
      "Organisation sur mesure",
      "Accompagnateur dédié pour grands groupes",
      "Facturation simplifiée",
      "Services additionnels disponibles",
    ],
  },
  {
    id: "tours",
    icon: <MapPin className="h-10 w-10 text-amber-500" />,
    title: "Circuits touristiques",
    description:
      "Découvrez le Mali avec nos circuits touristiques organisés. Visitez les sites historiques, culturels et naturels avec des guides expérimentés.",
    features: [
      "Circuits thématiques variés",
      "Guides touristiques professionnels",
      "Visites des sites UNESCO",
      "Immersion culturelle authentique",
      "Hébergement et repas inclus",
      "Expériences personnalisables",
    ],
  },
  {
    id: "express",
    icon: <Clock className="h-10 w-10 text-amber-500" />,
    title: "Service express",
    description:
      "Notre service express vous garantit des départs fréquents et ponctuels entre les principales villes du Mali. Idéal pour les voyageurs pressés.",
    features: [
      "Départs fréquents toute la journée",
      "Ponctualité garantie",
      "Temps de trajet optimisé",
      "Embarquement prioritaire",
      "Liaison entre grandes villes",
      "Service de navette disponible",
    ],
  },
  {
    id: "support",
    icon: <Headphones className="h-10 w-10 text-amber-500" />,
    title: "Service client 24/7",
    description:
      "Notre équipe de service client est disponible 24h/24 et 7j/7 pour répondre à vos questions et résoudre vos problèmes. Votre satisfaction est notre priorité.",
    features: [
      "Assistance téléphonique 24h/24",
      "Support par email et chat",
      "Résolution rapide des problèmes",
      "Suivi personnalisé",
      "Agents multilingues",
      "Feedback et amélioration continue",
    ],
  },
  {
    id: "loyalty",
    icon: <Gift className="h-10 w-10 text-amber-500" />,
    title: "Programme de fidélité",
    description:
      "Rejoignez notre programme de fidélité et bénéficiez de réductions, de promotions exclusives et d'avantages spéciaux sur vos voyages réguliers.",
    features: [
      "Points de fidélité sur chaque voyage",
      "Réductions exclusives pour membres",
      "Promotions saisonnières",
      "Cadeaux d'anniversaire",
      "Statuts privilégiés",
      "Avantages partenaires",
    ],
  },
]

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Nos Services</h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Découvrez l'ensemble des services que nous proposons pour rendre votre voyage à travers le Mali confortable,
          sécurisé et mémorable.
        </p>
      </div>

      {/* Onglets de services */}
      <Tabs defaultValue="all" className="mb-12">
        <TabsList className="mb-8 w-full justify-start overflow-auto">
          <TabsTrigger value="all">Tous les services</TabsTrigger>
          <TabsTrigger value="transport">Transport</TabsTrigger>
          <TabsTrigger value="booking">Réservation</TabsTrigger>
          <TabsTrigger value="tours">Tourisme</TabsTrigger>
          <TabsTrigger value="support">Assistance</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transport" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services
              .filter((service) => ["bus", "safety", "express"].includes(service.id))
              .map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="booking" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services
              .filter((service) => ["booking", "payment", "groups"].includes(service.id))
              .map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="tours" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services
              .filter((service) => ["tours"].includes(service.id))
              .map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="support" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services
              .filter((service) => ["support", "loyalty"].includes(service.id))
              .map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Section de mise en avant */}
      <div className="mb-16 overflow-hidden rounded-lg bg-slate-50">
        <div className="grid md:grid-cols-2">
          <div className="p-8 md:p-12">
            <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-200">Service Premium</Badge>
            <h2 className="mb-4 text-3xl font-bold">Voyagez en classe VIP</h2>
            <p className="mb-6 text-slate-600">
              Découvrez notre service VIP avec des bus de luxe, des sièges inclinables, des repas à bord et un service
              personnalisé. Une expérience de voyage exceptionnelle pour les clients exigeants.
            </p>
            <ul className="mb-8 space-y-2">
              {[
                "Sièges en cuir entièrement inclinables",
                "Espacement généreux entre les sièges",
                "Service de restauration à bord",
                "Écrans individuels de divertissement",
                "WiFi haut débit et prises électriques",
                "Service d'accueil personnalisé",
              ].map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-amber-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600">
              <Link href="/services/vip">En savoir plus</Link>
            </Button>
          </div>
          <div className="relative hidden md:block">
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="Service VIP"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Témoignages */}
      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Ce que disent nos clients</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: "Amadou Diallo",
              role: "Voyageur d'affaires",
              comment:
                "Le service VIP de Mali Voyages a transformé mes déplacements professionnels. Confort, ponctualité et professionnalisme sont au rendez-vous à chaque voyage.",
              avatar: "/placeholder.svg?height=100&width=100",
            },
            {
              name: "Fatoumata Coulibaly",
              role: "Touriste",
              comment:
                "J'ai utilisé le service de circuit touristique pour découvrir Tombouctou et j'ai été impressionnée par la qualité des guides et l'organisation parfaite du voyage.",
              avatar: "/placeholder.svg?height=100&width=100",
            },
            {
              name: "Ibrahim Touré",
              role: "Étudiant",
              comment:
                "En tant qu'étudiant, j'apprécie les tarifs abordables et le programme de fidélité qui me permet d'économiser sur mes trajets réguliers entre Bamako et Ségou.",
              avatar: "/placeholder.svg?height=100&width=100",
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
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-600">"{testimonial.comment}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-lg bg-amber-50 p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Prêt à voyager avec nous?</h2>
        <p className="mb-6 text-slate-600">
          Réservez dès maintenant et découvrez pourquoi des milliers de voyageurs nous font confiance chaque jour.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600">
            <Link href="/search">Réserver un voyage</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function ServiceCard({ service }: { service: any }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="mb-4 rounded-full bg-amber-50 p-3 inline-flex">{service.icon}</div>
        <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
        <p className="mb-4 text-slate-600">{service.description}</p>
        <div>
          <h4 className="mb-2 text-sm font-medium">Caractéristiques:</h4>
          <ul className="space-y-1">
            {service.features.slice(0, 4).map((feature: string, index: number) => (
              <li key={index} className="flex items-center text-sm">
                <Check className="mr-2 h-4 w-4 text-amber-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          {service.features.length > 4 && (
            <Button variant="link" className="mt-2 h-auto p-0 text-amber-500" asChild>
              <Link href={`/services/${service.id}`}>Voir plus de détails</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
