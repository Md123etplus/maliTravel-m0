"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"

// Données simulées pour les FAQ
const faqCategories = [
  {
    id: "reservations",
    name: "Réservations",
    faqs: [
      {
        question: "Comment puis-je réserver un billet?",
        answer:
          "Vous pouvez réserver un billet de plusieurs façons: en ligne sur notre site web, via notre application mobile, par téléphone au +223 20 22 33 44 ou en personne dans l'une de nos agences. Pour la réservation en ligne, il vous suffit de sélectionner votre itinéraire, la date de voyage, le nombre de passagers et de suivre les instructions pour le paiement.",
      },
      {
        question: "Puis-je réserver un billet pour quelqu'un d'autre?",
        answer:
          "Oui, vous pouvez réserver un billet pour une autre personne. Lors de la réservation, vous devrez fournir les informations du passager, notamment son nom complet et son numéro de pièce d'identité. La personne devra présenter sa pièce d'identité lors de l'embarquement.",
      },
      {
        question: "Comment puis-je choisir mon siège?",
        answer:
          "Lors du processus de réservation en ligne, après avoir sélectionné votre itinéraire et la date, vous aurez accès à un plan du bus où vous pourrez choisir votre siège préféré parmi ceux disponibles. Si vous réservez par téléphone ou en agence, vous pouvez également demander un siège spécifique, sous réserve de disponibilité.",
      },
      {
        question: "Combien de temps à l'avance puis-je réserver?",
        answer:
          "Vous pouvez réserver vos billets jusqu'à 3 mois à l'avance. Nous recommandons de réserver le plus tôt possible, surtout pour les périodes de forte affluence comme les jours fériés et les vacances scolaires, afin de garantir votre place et de bénéficier des meilleurs tarifs.",
      },
      {
        question: "Recevrai-je une confirmation de ma réservation?",
        answer:
          "Oui, après avoir effectué votre réservation, vous recevrez une confirmation par SMS et par email. Cette confirmation contient toutes les informations de votre voyage, y compris le numéro de réservation, l'itinéraire, la date et l'heure de départ, ainsi que les détails du siège. Nous vous recommandons de conserver cette confirmation pour la présenter lors de l'embarquement  Nous vous recommandons de conserver cette confirmation pour la présenter lors de l'embarquement.",
      },
      {
        question: "Que faire si je n'ai pas reçu ma confirmation de réservation?",
        answer:
          "Si vous n'avez pas reçu votre confirmation de réservation dans les 30 minutes suivant votre paiement, veuillez vérifier votre dossier de courriers indésirables. Si vous ne la trouvez toujours pas, contactez notre service client au +223 20 22 33 44 ou par email à support@malivoyages.ml en fournissant votre nom et les détails de votre voyage. Nous vous enverrons à nouveau votre confirmation.",
      },
    ],
  },
  {
    id: "payment",
    name: "Paiement",
    faqs: [
      {
        question: "Quels modes de paiement acceptez-vous?",
        answer:
          "Nous acceptons plusieurs modes de paiement: Orange Money, Moov Money, Wave, cartes bancaires (Visa, Mastercard), et paiement en espèces dans nos agences. Pour les réservations en ligne, vous pouvez payer par mobile money ou carte bancaire.",
      },
      {
        question: "Le paiement en ligne est-il sécurisé?",
        answer:
          "Oui, tous nos paiements en ligne sont sécurisés. Nous utilisons des protocoles de cryptage avancés pour protéger vos informations financières. Pour les paiements par mobile money, nous utilisons les interfaces sécurisées officielles des opérateurs.",
      },
      {
        question: "Puis-je payer mon billet à bord du bus?",
        answer:
          "Non, tous les billets doivent être achetés avant l'embarquement. Vous pouvez acheter votre billet en ligne, par téléphone ou dans l'une de nos agences jusqu'à 30 minutes avant le départ, sous réserve de disponibilité.",
      },
      {
        question: "Y a-t-il des frais supplémentaires pour la réservation en ligne?",
        answer:
          "Non, il n'y a pas de frais supplémentaires pour la réservation en ligne. Les prix affichés incluent tous les frais de service. Cependant, des frais peuvent s'appliquer pour certains services spéciaux comme les bagages excédentaires ou les modifications de réservation de dernière minute.",
      },
      {
        question: "Comment obtenir une facture pour mon voyage?",
        answer:
          "Vous pouvez demander une facture lors de votre réservation en agence ou en contactant notre service client après une réservation en ligne. Pour les entreprises, nous proposons également des comptes professionnels avec facturation mensuelle.",
      },
    ],
  },
  {
    id: "cancellation",
    name: "Annulations",
    faqs: [
      {
        question: "Quelle est votre politique d'annulation?",
        answer:
          "Les annulations effectuées 24 heures ou plus avant le départ sont remboursées à 100%. Les annulations effectuées entre 6 et 24 heures avant le départ sont remboursées à 50%. Les annulations effectuées moins de 6 heures avant le départ ne sont pas remboursables. Des conditions spéciales peuvent s'appliquer pendant les périodes de forte affluence.",
      },
      {
        question: "Comment puis-je annuler ma réservation?",
        answer:
          "Vous pouvez annuler votre réservation en ligne en vous connectant à votre compte et en accédant à la section 'Mes réservations'. Vous pouvez également annuler par téléphone au +223 20 22 33 44 ou en personne dans l'une de nos agences. Assurez-vous d'avoir votre numéro de réservation à portée de main.",
      },
      {
        question: "Combien de temps faut-il pour recevoir un remboursement?",
        answer:
          "Les remboursements sont traités dans un délai de 7 jours ouvrables. Le délai exact dépend de votre mode de paiement: les remboursements par mobile money sont généralement plus rapides (1-3 jours) que les remboursements par carte bancaire (3-7 jours).",
      },
      {
        question: "Puis-je modifier ma réservation au lieu de l'annuler?",
        answer:
          "Oui, vous pouvez modifier votre réservation jusqu'à 6 heures avant le départ, sous réserve de disponibilité, sans frais supplémentaires. Les modifications incluent le changement de date, d'heure ou de siège. Pour modifier votre réservation, connectez-vous à votre compte ou contactez notre service client.",
      },
      {
        question: "Que se passe-t-il si Mali Voyages annule mon voyage?",
        answer:
          "Si nous devons annuler votre voyage pour des raisons opérationnelles ou de sécurité, vous serez automatiquement remboursé à 100% ou vous pourrez choisir de reporter votre voyage à une date ultérieure sans frais supplémentaires. Nous vous informerons de l'annulation par SMS et par email dès que possible.",
      },
    ],
  },
  {
    id: "travel",
    name: "Voyage",
    faqs: [
      {
        question: "Quand dois-je me présenter avant le départ?",
        answer:
          "Nous recommandons d'arriver à la gare routière au moins 30 minutes avant l'heure de départ prévue pour les trajets nationaux. Cela vous laisse suffisamment de temps pour l'enregistrement, le dépôt des bagages et l'embarquement. Pour les trajets internationaux, veuillez arriver au moins 1 heure à l'avance.",
      },
      {
        question: "Quels documents dois-je apporter pour voyager?",
        answer:
          "Tous les voyageurs doivent présenter une pièce d'identité valide (carte d'identité nationale, passeport ou permis de conduire) et leur confirmation de réservation (imprimée ou électronique). Pour les enfants, un certificat de naissance ou une pièce d'identité est nécessaire. Pour les voyages internationaux, un passeport valide est obligatoire.",
      },
      {
        question: "Y a-t-il une limite de bagages?",
        answer:
          "Chaque passager a droit à un bagage en soute de 20 kg maximum et un bagage à main ne dépassant pas 5 kg. Les dimensions maximales pour le bagage à main sont de 45 x 35 x 20 cm. Des frais supplémentaires s'appliquent pour les bagages excédentaires, à régler avant l'embarquement.",
      },
      {
        question: "Les animaux sont-ils autorisés à bord?",
        answer:
          "Seuls les chiens guides pour personnes malvoyantes sont autorisés à bord de nos bus. Pour des raisons de sécurité et de confort, les autres animaux ne sont pas acceptés, même en cage ou en caisse de transport.",
      },
      {
        question: "Y a-t-il des arrêts pendant le voyage?",
        answer:
          "Pour les trajets de plus de 3 heures, nous effectuons généralement un arrêt de 15-20 minutes à mi-parcours, permettant aux passagers d'utiliser les toilettes et d'acheter des rafraîchissements. Les arrêts sont indiqués dans l'itinéraire détaillé de votre voyage.",
      },
      {
        question: "Que faire en cas de retard du bus?",
        answer:
          "En cas de retard prévu, nous vous informerons par SMS. Pour les retards de plus de 30 minutes, vous pouvez également contacter notre service client au +223 20 22 33 44 pour obtenir des informations actualisées sur l'heure d'arrivée estimée de votre bus.",
      },
    ],
  },
  {
    id: "services",
    name: "Services à bord",
    faqs: [
      {
        question: "Y a-t-il le WiFi à bord des bus?",
        answer:
          "Oui, tous nos bus Confort Plus et Premium sont équipés du WiFi gratuit. La connexion peut varier en fonction de la couverture réseau dans les zones rurales. Pour accéder au WiFi, demandez le mot de passe au chauffeur ou à l'hôtesse de bord.",
      },
      {
        question: "Les bus sont-ils climatisés?",
        answer:
          "Oui, tous nos bus sont équipés de la climatisation pour assurer votre confort, particulièrement important pendant la saison chaude. La température est régulée pour maintenir un environnement agréable pour tous les passagers.",
      },
      {
        question: "Y a-t-il des prises électriques dans les bus?",
        answer:
          "Nos bus Confort Plus et Premium sont équipés de prises USB à chaque siège pour charger vos appareils mobiles. Les bus Premium disposent également de prises électriques standards sur certains sièges.",
      },
      {
        question: "Proposez-vous des boissons ou des collations à bord?",
        answer:
          "Sur les trajets de plus de 2 heures, nous offrons gratuitement de l'eau en bouteille. Sur les trajets Premium de longue distance, une collation légère est également offerte. Vous pouvez apporter vos propres boissons et snacks, à condition qu'ils ne soient pas odorants ou salissants.",
      },
      {
        question: "Y a-t-il des toilettes à bord des bus?",
        answer:
          "Nos bus Premium et certains bus Confort Plus utilisés pour les longs trajets sont équipés de toilettes à bord. Pour les autres bus, des arrêts réguliers sont prévus sur les itinéraires de plus de 3 heures.",
      },
      {
        question: "Les bus sont-ils accessibles aux personnes à mobilité réduite?",
        answer:
          "Certains de nos bus sont équipés pour accueillir les personnes à mobilité réduite, avec des rampes d'accès et des espaces réservés pour les fauteuils roulants. Veuillez nous informer de vos besoins spécifiques lors de la réservation afin que nous puissions vous assurer le meilleur service possible.",
      },
    ],
  },
]

export default function FAQClientPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filtrer les FAQ en fonction de la recherche
  const filteredFAQs = searchQuery
    ? faqCategories.flatMap((category) =>
        category.faqs.filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    : []

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Questions fréquentes</h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Trouvez rapidement des réponses à vos questions concernant nos services, réservations, paiements et plus
          encore.
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="mb-12 mx-auto max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Rechercher une question..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Résultats de recherche */}
        {searchQuery && (
          <div className="mt-4">
            <h2 className="mb-4 text-lg font-semibold">
              {filteredFAQs.length} résultat(s) pour "{searchQuery}"
            </h2>
            {filteredFAQs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`search-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-slate-600">
                Aucun résultat trouvé. Essayez avec d'autres termes ou consultez les catégories ci-dessous.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Onglets de catégories */}
      {!searchQuery && (
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 w-full justify-start overflow-auto">
            <TabsTrigger value="all">Toutes les questions</TabsTrigger>
            {faqCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {faqCategories.map((category) => (
              <div key={category.id} className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">{category.name}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`${category.id}-${index}`}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </TabsContent>

          {faqCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <h2 className="mb-4 text-2xl font-bold">{category.name}</h2>
              <Accordion type="single" collapsible className="w-full">
                {category.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`${category.id}-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Vous n'avez pas trouvé votre réponse */}
      <div className="mt-16 rounded-lg bg-amber-50 p-8">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h2 className="mb-4 text-2xl font-bold">Vous n'avez pas trouvé votre réponse?</h2>
            <p className="mb-6 text-slate-600">
              Notre équipe de service client est disponible pour répondre à toutes vos questions. N'hésitez pas à nous
              contacter par téléphone, email ou en visitant l'une de nos agences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-amber-500 hover:bg-amber-600">
                <Link href="/contact">
                  <Mail className="mr-2 h-4 w-4" />
                  Nous contacter
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/services">
                  En savoir plus sur nos services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Contact rapide</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Service client</p>
                    <p className="text-slate-600">+223 20 22 33 44</p>
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-slate-600">support@malivoyages.ml</p>
                  </div>
                  <div>
                    <p className="font-medium">Horaires</p>
                    <p className="text-slate-600">7j/7 de 7h00 à 19h00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
