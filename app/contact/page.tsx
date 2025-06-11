import type { Metadata } from "next"
import ContactPageClient from "./ContactPageClient"

export const metadata: Metadata = {
  title: "Contactez-nous | Mali Voyages",
  description:
    "Besoin d'aide pour votre voyage au Mali? Contactez notre équipe par téléphone, email ou en visitant l'une de nos agences à Bamako, Ségou ou Mopti.",
  keywords:
    "contact Mali Voyages, agence voyage Mali, téléphone Mali Voyages, email Mali Voyages, adresse Mali Voyages, assistance voyage Mali",
  openGraph: {
    title: "Contactez-nous | Mali Voyages",
    description:
      "Besoin d'aide pour votre voyage au Mali? Contactez notre équipe par téléphone, email ou en visitant l'une de nos agences.",
    url: "https://malivoyages.ml/contact",
    images: [
      {
        url: "https://malivoyages.ml/images/contact-og.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Mali Voyages",
      },
    ],
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}
