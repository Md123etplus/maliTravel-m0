import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Award, Clock, MapPin, Bus, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "À propos de Mali Voyages | Notre histoire et nos valeurs",
  description:
    "Découvrez l'histoire de Mali Voyages, notre mission, nos valeurs et notre équipe dédiée au transport de qualité au Mali depuis 2010.",
  keywords:
    "à propos Mali Voyages, histoire entreprise transport Mali, valeurs Mali Voyages, équipe Mali Voyages, mission transport Mali",
  openGraph: {
    title: "À propos de Mali Voyages | Notre histoire et nos valeurs",
    description:
      "Découvrez l'histoire de Mali Voyages, notre mission, nos valeurs et notre équipe dédiée au transport de qualité au Mali depuis 2010.",
    url: "https://malivoyages.ml/about",
    images: [
      {
        url: "https://malivoyages.ml/images/about-og.jpg",
        width: 1200,
        height: 630,
        alt: "À propos de Mali Voyages",
      },
    ],
  },
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">À propos de Mali Voyages</h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Découvrez notre histoire, notre mission et les valeurs qui nous animent pour vous offrir la meilleure
          expérience de voyage au Mali.
        </p>
      </div>

      {/* Section histoire */}
      <div className="mb-16 grid gap-8 md:grid-cols-2 items-center">
        <div>
          <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-200">Notre Histoire</Badge>
          <h2 className="mb-4 text-3xl font-bold">Une aventure qui a commencé en 2010</h2>
          <p className="mb-4 text-slate-600">
            Mali Voyages a été fondée en 2010 avec une vision claire : révolutionner le transport de passagers au Mali
            en offrant un service fiable, confortable et accessible à tous.
          </p>
          <p className="mb-4 text-slate-600">
            Ce qui a commencé avec seulement 3 bus reliant Bamako à Ségou s'est transformé en une entreprise de premier
            plan dans le secteur du transport au Mali, desservant aujourd'hui plus de 15 destinations à travers le pays
            avec une flotte moderne de plus de 50 véhicules.
          </p>
          <p className="text-slate-600">
            Notre croissance rapide témoigne de notre engagement envers l'excellence et la satisfaction client. Chaque
            année, nous transportons plus de 500 000 passagers en toute sécurité vers leur destination.
          </p>
        </div>
        <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="Histoire de Mali Voyages"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Mission et vision */}
      <div className="mb-16 rounded-lg bg-slate-50 p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-2xl font-bold">Notre Mission</h3>
            <p className="text-slate-600">
              Offrir un service de transport sûr, fiable et confortable qui connecte les personnes et les communautés à
              travers le Mali, tout en contribuant au développement économique et social du pays.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-2xl font-bold">Notre Vision</h3>
            <p className="text-slate-600">
              Devenir la référence du transport de passagers en Afrique de l'Ouest, reconnue pour l'excellence de son
              service, son innovation constante et son impact positif sur la société et l'environnement.
            </p>
          </div>
        </div>
      </div>

      {/* Valeurs */}
      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Nos Valeurs</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <Users className="h-10 w-10 text-amber-500" />,
              title: "Client d'abord",
              description:
                "Nous plaçons nos clients au centre de toutes nos décisions. Leur satisfaction et leur sécurité sont nos priorités absolues.",
            },
            {
              icon: <Award className="h-10 w-10 text-amber-500" />,
              title: "Excellence",
              description:
                "Nous visons l'excellence dans tous les aspects de notre service, de la propreté de nos bus à la formation de notre personnel.",
            },
            {
              icon: <Clock className="h-10 w-10 text-amber-500" />,
              title: "Ponctualité",
              description:
                "Nous respectons le temps de nos clients en assurant des départs et des arrivées ponctuels sur toutes nos lignes.",
            },
            {
              icon: <MapPin className="h-10 w-10 text-amber-500" />,
              title: "Accessibilité",
              description:
                "Nous nous efforçons de rendre le voyage accessible à tous, avec des tarifs abordables et un réseau étendu.",
            },
            {
              icon: <Bus className="h-10 w-10 text-amber-500" />,
              title: "Innovation",
              description:
                "Nous innovons constamment pour améliorer l'expérience de voyage, de la réservation en ligne à la technologie à bord.",
            },
            {
              icon: <Calendar className="h-10 w-10 text-amber-500" />,
              title: "Durabilité",
              description:
                "Nous nous engageons à réduire notre impact environnemental et à contribuer positivement aux communautés que nous servons.",
            },
          ].map((value, index) => (
            <Card key={index}>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-amber-50 p-3">{value.icon}</div>
                <h3 className="mb-2 text-xl font-semibold">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Équipe */}
      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Notre Équipe de Direction</h2>
        <div className="grid gap-6 md:grid-cols-4">
            {[
            {
              name: "Moussa DEMBELE",
              role: "Directeur Général",
              bio: "Fondateur de Mali Voyages, Moussa dirige l'entreprise avec passion et une vision tournée vers l'innovation et la qualité.",
              image: "/team/moussa-dembele.jpg",
            },
            {
              name: "Ramses Kodio",
              role: "Directeur Général",
              bio: "Expert en logistique, Ramses veille à la ponctualité et à la sécurité sur toutes les lignes de Mali Voyages.",
              image: "/team/ramses-kodio.jpg",
            },
            {
              name: "Salimata Coumare",
              role: "Directeur Général",
              bio: "Salimata développe la notoriété de Mali Voyages et place la satisfaction client au cœur de la stratégie.",
              image: "/team/salimata-coumare.jpg",
            }
            ].map((member, index) => (
            <Card key={index}>
              <div className="relative h-64 w-full">
              <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <CardContent className="p-4">
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="mb-2 text-sm text-amber-600">{member.role}</p>
              <p className="text-sm text-slate-600">{member.bio}</p>
              </CardContent>
            </Card>
            ))}
        </div>
      </div>

      {/* Chiffres clés */}
      <div className="mb-16 rounded-lg bg-amber-50 p-8">
        <h2 className="mb-8 text-center text-3xl font-bold">Mali Voyages en Chiffres</h2>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { number: "50+", label: "Bus modernes" },
            { number: "15+", label: "Destinations" },
            { number: "500K+", label: "Passagers par an" },
            { number: "200+", label: "Employés" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl font-bold text-amber-600">{stat.number}</p>
              <p className="text-slate-700">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Partenaires */}
      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Nos Partenaires</h2>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {[1, 2, 3, 4, 5, 6].map((partner) => (
            <div key={partner} className="relative h-16 w-32 grayscale transition-all hover:grayscale-0">
              <Image
                src={`/placeholder.svg?height=64&width=128&text=Partner${partner}`}
                alt={`Partenaire ${partner}`}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-lg bg-slate-900 p-8 text-center text-white">
        <h2 className="mb-4 text-2xl font-bold">Rejoignez l'aventure Mali Voyages</h2>
        <p className="mb-6 mx-auto max-w-2xl">
          Que vous soyez à la recherche d'une carrière enrichissante ou d'un partenaire commercial fiable, nous serions
          ravis de vous accueillir dans la famille Mali Voyages.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600">
            <Link href="/careers">Carrières</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
