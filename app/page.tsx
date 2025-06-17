import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SearchForm } from "@/components/search-form"
import { PopularDestinations } from "@/components/popular-destinations"
import { Services } from "@/components/services"
import { Testimonials } from "@/components/testimonials"
import { MapPin, Calendar, Users, ArrowRight, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-900/50 z-10" />
        <div className="relative h-[600px] w-full">
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="Mali Travel"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container absolute inset-0 z-20 mx-auto flex flex-col items-center justify-center px-4 text-center text-white">
          <Badge className="mb-4 bg-amber-500 text-white hover:bg-amber-600">Voyagez en toute sécurité</Badge>
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Découvrez le Mali <br className="hidden md:block" /> avec Mali Voyages
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-slate-200">
            Réservez vos billets de bus en ligne pour voyager à travers le Mali en toute simplicité. Service fiable,
            confortable et sécurisé.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
              <Link href="/search">Réserver maintenant</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white bg-white/10 text-white hover:bg-white/10">
              <Link href="/destinations">Explorer les destinations</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Search Form Section */}
      <section className="container relative mx-auto px-4 py-0">
        <div className="relative -mt-16 rounded-lg bg-white p-6 shadow-lg z-30">
          <SearchForm />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Pourquoi choisir Mali Voyages?</h2>
          <p className="mx-auto max-w-2xl text-slate-600">
            Nous offrons une expérience de voyage exceptionnelle avec des services de qualité pour tous vos déplacements
            au Mali.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: <MapPin className="h-10 w-10 text-amber-500" />,
              title: "Réseau étendu",
              description:
                "Nous desservons plus de 15 destinations à travers le Mali, vous permettant de voyager facilement où que vous souhaitiez aller.",
            },
            {
              icon: <Calendar className="h-10 w-10 text-amber-500" />,
              title: "Réservation facile",
              description:
                "Réservez vos billets en ligne, par téléphone ou dans l'une de nos agences. Simple, rapide et pratique.",
            },
            {
              icon: <Users className="h-10 w-10 text-amber-500" />,
              title: "Confort et sécurité",
              description:
                "Nos bus modernes sont équipés pour votre confort avec climatisation, sièges spacieux et mesures de sécurité strictes.",
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
      </section>

      {/* Popular Destinations Section */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Destinations populaires</h2>
            <p className="mx-auto max-w-2xl text-slate-600">
              Découvrez nos destinations les plus prisées et planifiez votre prochain voyage au Mali.
            </p>
          </div>

          <PopularDestinations />

          <div className="mt-10 text-center">
            <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white">
              <Link href="/destinations">
                Voir toutes les destinations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Nos services</h2>
          <p className="mx-auto max-w-2xl text-slate-600">
            Nous offrons une gamme complète de services pour rendre votre voyage agréable et sans souci.
          </p>
        </div>

        <Services />

        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-50">
            <Link href="/services">
              En savoir plus sur nos services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-amber-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Comment ça marche</h2>
            <p className="mx-auto max-w-2xl text-slate-600">
              Réserver votre voyage avec Mali Voyages est simple et rapide. Suivez ces étapes faciles.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                step: "1",
                title: "Recherchez",
                description: "Sélectionnez votre destination, la date et le nombre de passagers.",
              },
              {
                step: "2",
                title: "Choisissez",
                description: "Sélectionnez l'horaire qui vous convient et choisissez vos sièges.",
              },
              {
                step: "3",
                title: "Payez",
                description: "Effectuez le paiement via Orange Money, carte bancaire ou autre méthode.",
              },
              {
                step: "4",
                title: "Voyagez",
                description: "Recevez votre billet par SMS et email, puis présentez-vous à l'embarquement.",
              },
            ].map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-xl font-bold text-white">
                  {step.step}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
                {index < 3 && <div className="absolute right-0 top-8 hidden h-0.5 w-1/2 bg-amber-300 md:block"></div>}
                {index > 0 && index < 4 && (
                  <div className="absolute left-0 top-8 hidden h-0.5 w-1/2 bg-amber-300 md:block"></div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white">
              <Link href="/search">Réserver maintenant</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ce que disent nos clients</h2>
          <p className="mx-auto max-w-2xl text-slate-600">
            Découvrez les témoignages de nos clients satisfaits qui ont voyagé avec Mali Voyages.
          </p>
        </div>

        <Testimonials />
      </section> */}

      {/* App Promotion Section */}
      {/* <section className="bg-slate-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <Badge className="mb-4 bg-amber-500 text-white hover:bg-amber-600">Nouveau</Badge>
              <h2 className="mb-4 text-3xl font-bold">Téléchargez notre application mobile</h2>
              <p className="mb-6 text-slate-300">
                Réservez vos billets, suivez vos voyages et recevez des notifications en temps réel avec notre
                application mobile. Disponible sur iOS et Android.
              </p>
              <ul className="mb-8 space-y-2">
                {[
                  "Réservation rapide en quelques clics",
                  "Billets électroniques sur votre téléphone",
                  "Notifications de statut en temps réel",
                  "Gestion facile de vos réservations",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-amber-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="#">
                    <svg
                      className="mr-2 h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.5227 7.39069C17.4042 7.46651 15.1735 8.88191 15.1735 11.6109C15.1735 14.7199 17.8519 16.0553 17.9129 16.0866C17.9019 16.1241 17.5349 17.3762 16.6659 18.6539C15.8894 19.7976 15.0688 20.9412 13.8368 20.9412C12.6047 20.9412 12.2626 20.1896 10.8595 20.1896C9.51691 20.1896 8.90329 20.9662 7.75783 20.9662C6.61237 20.9662 5.7543 19.7976 4.94033 18.6789C4.01356 17.3637 3.24432 15.3549 3.24432 13.4461C3.24432 10.4099 5.05458 8.80863 6.83598 8.80863C8.02913 8.80863 9.00432 9.63472 9.73598 9.63472C10.4301 9.63472 11.5193 8.7581 12.8844 8.7581C13.3406 8.7581 14.9651 8.80863 16.0407 10.1353C15.9235 10.2025 14.0407 11.2961 14.0407 13.8087C14.0407 16.7949 16.4301 17.7635 16.5037 17.7885C16.4676 17.8511 16.0344 19.3786 14.8485 20.9037C13.8368 22.2141 12.7735 23.5 11.3154 23.5C9.95069 23.5 9.48264 22.6739 8.0246 22.6739C6.62913 22.6739 6.01856 23.525 4.74342 23.525C3.46827 23.525 2.54149 22.2642 1.70237 20.9537C0.76356 19.4887 0 17.3137 0 15.2174C0 11.9834 2.12913 10.0246 4.22913 9.04841C5.75783 8.32979 7.12913 8.7581 8.15069 8.7581C9.10155 8.7581 10.4301 9.63472 11.3154 9.63472C12.1735 9.63472 13.6316 8.7581 14.8485 8.7581C15.1735 8.7581 16.7485 8.78347 18.0126 9.75865C17.8954 9.82643 17.5704 9.97884 17.5227 7.39069ZM12.1485 6.86402C12.6047 6.33735 13.1547 5.58389 13.1547 4.60871C13.1547 4.49615 13.1422 4.38359 13.1297 4.30777C12.0907 4.35831 10.8595 5.0082 10.3282 5.58389C9.92173 6.03472 9.28264 6.83735 9.28264 7.82457C9.28264 7.94918 9.30719 8.07379 9.31924 8.11228C9.38702 8.12433 9.49958 8.14843 9.61215 8.14843C10.5506 8.14843 11.6548 7.53786 12.1485 6.86402Z" />
                    </svg>
                    App Store
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="#">
                    <svg
                      className="mr-2 h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M3.60001 1.91897C3.40314 2.21966 3.27471 2.56365 3.22539 2.92306C3.17607 3.28247 3.20713 3.64745 3.31601 3.99097C3.42489 4.33449 3.60876 4.64832 3.85325 4.90935C4.09774 5.17038 4.39655 5.37146 4.72601 5.49897C5.05547 5.62648 5.40783 5.67682 5.75948 5.64593C6.11113 5.61504 6.45021 5.50379 6.75001 5.32097C7.04981 5.13815 7.30257 4.88825 7.48901 4.59097C7.67545 4.29368 7.79074 3.95865 7.82601 3.60997C7.86127 3.26129 7.81553 2.90897 7.69301 2.57997C7.57049 2.25097 7.37461 1.95397 7.12001 1.70997C6.86541 1.46597 6.56001 1.28197 6.22601 1.16997C5.89201 1.05797 5.53801 1.01997 5.18901 1.05997C4.84001 1.09997 4.50601 1.21697 4.20901 1.39997C3.91201 1.58297 3.66001 1.82997 3.47401 2.12697L3.60001 1.91897ZM3.60001 22.079C3.40314 21.7783 3.27471 21.4343 3.22539 21.0749C3.17607 20.7155 3.20713 20.3505 3.31601 20.007C3.42489 19.6635 3.60876 19.3496 3.85325 19.0886C4.09774 18.8276 4.39655 18.6265 4.72601 18.499C5.05547 18.3715 5.40783 18.3211 5.75948 18.352C6.11113 18.3829 6.45021 18.4942 6.75001 18.677C7.04981 18.8598 7.30257 19.1097 7.48901 19.407C7.67545 19.7043 7.79074 20.0393 7.82601 20.388C7.86127 20.7367 7.81553 21.089 7.69301 21.418C7.57049 21.747 7.37461 22.044 7.12001 22.288C6.86541 22.532 6.56001 22.716 6.22601 22.828C5.89201 22.94 5.53801 22.978 5.18901 22.938C4.84001 22.898 4.50601 22.781 4.20901 22.598C3.91201 22.415 3.66001 22.168 3.47401 21.871L3.60001 22.079ZM16.229 7.32997C16.0321 7.63066 15.9037 7.97465 15.8544 8.33406C15.8051 8.69347 15.8361 9.05845 15.945 9.40197C16.0539 9.74549 16.2377 10.0593 16.4822 10.3204C16.7267 10.5814 17.0255 10.7825 17.355 10.91C17.6845 11.0375 18.0368 11.0878 18.3885 11.0569C18.7401 11.026 19.0792 10.9148 19.379 10.732C19.6788 10.5492 19.9316 10.2993 20.118 10.002C20.3044 9.70468 20.4197 9.36965 20.455 9.02097C20.4903 8.67229 20.4445 8.31997 20.322 7.99097C20.1995 7.66197 20.0036 7.36497 19.749 7.12097C19.4944 6.87697 19.189 6.69297 18.855 6.58097C18.521 6.46897 18.167 6.43097 17.818 6.47097C17.469 6.51097 17.135 6.62797 16.838 6.81097C16.541 6.99397 16.289 7.24097 16.103 7.53797L16.229 7.32997ZM16.229 16.668C16.0321 16.3673 15.9037 16.0233 15.8544 15.6639C15.8051 15.3045 15.8361 14.9395 15.945 14.596C16.0539 14.2525 16.2377 13.9386 16.4822 13.6776C16.7267 13.4166 17.0255 13.2155 17.355 13.088C17.6845 12.9605 18.0368 12.9101 18.3885 12.941C18.7401 12.9719 19.0792 13.0832 19.379 13.266C19.6788 13.4488 19.9316 13.6987 20.118 13.996C20.3044 14.2933 20.4197 14.6283 20.455 14.977C20.4903 15.3257 20.4445 15.678 20.322 16.007C20.1995 16.336 20.0036 16.633 19.749 16.877C19.4944 17.121 19.189 17.305 18.855 17.417C18.521 17.529 18.167 17.567 17.818 17.527C17.469 17.487 17.135 17.37 16.838 17.187C16.541 17.004 16.289 16.757 16.103 16.46L16.229 16.668ZM3.60001 11.999C3.60001 10.939 3.80001 9.89897 4.20001 8.91897C4.60001 7.93897 5.17001 7.05897 5.90001 6.31897C6.63001 5.57897 7.51001 4.99897 8.50001 4.59897C9.49001 4.19897 10.53 3.99897 11.59 3.99897H20.4V7.99897H11.59C11.06 7.99897 10.54 8.11897 10.06 8.34897C9.58001 8.57897 9.16001 8.90897 8.81001 9.31897C8.46001 9.72897 8.19001 10.209 8.02001 10.729C7.85001 11.249 7.77001 11.799 7.80001 12.349C7.83001 12.899 7.95001 13.429 8.17001 13.929C8.39001 14.429 8.70001 14.879 9.10001 15.249C9.50001 15.619 9.97001 15.909 10.49 16.099C11.01 16.289 11.56 16.379 12.11 16.349H20.4V19.999H11.59C10.53 19.999 9.49001 19.799 8.50001 19.399C7.51001 18.999 6.63001 18.429 5.90001 17.689C5.17001 16.949 4.60001 16.069 4.20001 15.089C3.80001 14.109 3.60001 13.059 3.60001 11.999Z" />
                    </svg>
                    Google Play
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden h-[400px] md:block">
              <Image
                src="/placeholder.svg?height=400&width=300"
                alt="Application mobile Mali Voyages"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section> */}

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-lg bg-amber-50 p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold">Restez informé</h2>
              <p className="mb-6 text-slate-600">
                Abonnez-vous à notre newsletter pour recevoir les dernières nouvelles, promotions et offres spéciales
                directement dans votre boîte de réception.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="rounded-md border border-slate-300 px-4 py-2 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Button className="bg-amber-500 hover:bg-amber-600 text-white">S'abonner</Button>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                En vous abonnant, vous acceptez de recevoir des emails de Mali Voyages. Vous pouvez vous désabonner à
                tout moment.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-green-100 p-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Offre spéciale pour les nouveaux abonnés</h3>
                    <p className="text-slate-600">Recevez 10% de réduction sur votre premier voyage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
