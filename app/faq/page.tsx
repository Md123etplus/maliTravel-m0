import type { Metadata } from "next"
import FAQClientPage from "./FAQClientPage"

export const metadata: Metadata = {
  title: "Questions fréquentes | Mali Voyages",
  description:
    "Trouvez des réponses à toutes vos questions sur les réservations, paiements, annulations, voyages et services à bord avec Mali Voyages.",
  keywords:
    "FAQ Mali Voyages, questions fréquentes voyage Mali, réservation bus Mali, annulation billet Mali, bagages bus Mali, WiFi bus Mali",
  openGraph: {
    title: "Questions fréquentes | Mali Voyages",
    description:
      "Trouvez des réponses à toutes vos questions sur les réservations, paiements, annulations, voyages et services à bord.",
    url: "https://malivoyages.ml/faq",
    images: [
      {
        url: "https://malivoyages.ml/images/faq-og.jpg",
        width: 1200,
        height: 630,
        alt: "FAQ Mali Voyages",
      },
    ],
  },
}

export default function FAQPage() {
  return <FAQClientPage />
}
