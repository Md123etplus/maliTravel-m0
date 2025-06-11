"use client"

import Link from "next/link"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export default function ContactPageClient() {
  const isMobile = useMobile()
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "information",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simuler l'envoi du formulaire
    setTimeout(() => {
      setFormSubmitted(true)
      // Réinitialiser le formulaire après soumission
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "information",
        message: "",
      })
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Contactez-nous</h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Nous sommes là pour répondre à vos questions et vous aider à planifier votre prochain voyage au Mali.
        </p>
      </div>

      {/* Informations de contact et formulaire */}
      <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
        {/* Informations de contact */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-6 text-xl font-semibold">Nos coordonnées</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="mr-3 h-5 w-5 text-amber-500" />
                  <div>
                    <h3 className="font-medium">Adresse</h3>
                    <p className="text-slate-600">123 Avenue de l'Indépendance</p>
                    <p className="text-slate-600">Bamako, Mali</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="mr-3 h-5 w-5 text-amber-500" />
                  <div>
                    <h3 className="font-medium">Téléphone</h3>
                    <p className="text-slate-600">+223 20 22 33 44</p>
                    <p className="text-slate-600">+223 76 12 34 56 (WhatsApp)</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="mr-3 h-5 w-5 text-amber-500" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-slate-600">contact@malivoyages.ml</p>
                    <p className="text-slate-600">reservation@malivoyages.ml</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="mr-3 h-5 w-5 text-amber-500" />
                  <div>
                    <h3 className="font-medium">Heures d'ouverture</h3>
                    <p className="text-slate-600">Lundi - Samedi: 7h00 - 19h00</p>
                    <p className="text-slate-600">Dimanche: 8h00 - 16h00</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="mb-3 font-medium">Suivez-nous</h3>
                <div className="flex space-x-4">
                  {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                    <a
                      key={social}
                      href={`https://${social}.com/malivoyages`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-amber-100 hover:text-amber-600"
                    >
                      <span className="sr-only">{social}</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {!isMobile && (
            <div className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-semibold">Nos agences</h2>
                  <Tabs defaultValue="bamako">
                    <TabsList className="w-full">
                      <TabsTrigger value="bamako">Bamako</TabsTrigger>
                      <TabsTrigger value="segou">Ségou</TabsTrigger>
                      <TabsTrigger value="mopti">Mopti</TabsTrigger>
                    </TabsList>
                    <TabsContent value="bamako" className="mt-4">
                      <div className="space-y-2">
                        <p className="font-medium">Agence Principale</p>
                        <p className="text-sm text-slate-600">123 Avenue de l'Indépendance, Bamako</p>
                        <p className="text-sm text-slate-600">Tél: +223 20 22 33 44</p>
                      </div>
                      <div className="mt-4 space-y-2">
                        <p className="font-medium">Agence Hamdallaye</p>
                        <p className="text-sm text-slate-600">45 Rue du Marché, Hamdallaye, Bamako</p>
                        <p className="text-sm text-slate-600">Tél: +223 20 44 55 66</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="segou" className="mt-4">
                      <div className="space-y-2">
                        <p className="font-medium">Agence Ségou</p>
                        <p className="text-sm text-slate-600">78 Boulevard du Fleuve, Ségou</p>
                        <p className="text-sm text-slate-600">Tél: +223 21 32 43 54</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="mopti" className="mt-4">
                      <div className="space-y-2">
                        <p className="font-medium">Agence Mopti</p>
                        <p className="text-sm text-slate-600">12 Rue du Port, Mopti</p>
                        <p className="text-sm text-slate-600">Tél: +223 21 43 54 65</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Formulaire de contact */}
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              {formSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
                  <h2 className="mb-2 text-2xl font-bold">Message envoyé!</h2>
                  <p className="mb-6 text-slate-600">
                    Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais.
                  </p>
                  <Button onClick={() => setFormSubmitted(false)}>Envoyer un autre message</Button>
                </div>
              ) : (
                <>
                  <h2 className="mb-6 text-xl font-semibold">Envoyez-nous un message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Votre nom"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="votre.email@exemple.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="+223 XX XX XX XX"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Sujet</Label>
                      <RadioGroup
                        value={formData.subject}
                        onValueChange={handleRadioChange}
                        className="flex flex-wrap gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="information" id="information" />
                          <Label htmlFor="information">Information</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="reservation" id="reservation" />
                          <Label htmlFor="reservation">Réservation</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="reclamation" id="reclamation" />
                          <Label htmlFor="reclamation">Réclamation</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="autre" id="autre" />
                          <Label htmlFor="autre">Autre</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Votre message ici..."
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer le message
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>

          {/* Carte */}
          <div className="mt-8">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124857.87624566949!2d-8.068389!3d12.639232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe51d2926ee7987d%3A0xb4a6e419e0ba3de9!2sBamako%2C%20Mali!5e0!3m2!1sfr!2sfr!4v1623345678901!5m2!1sfr!2sfr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mali Voyages Location"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* FAQ rapide */}
      <div className="mt-16">
        <h2 className="mb-8 text-center text-2xl font-bold">Questions fréquentes</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              question: "Comment puis-je réserver un billet?",
              answer:
                "Vous pouvez réserver un billet en ligne sur notre site web, via notre application mobile, par téléphone ou en personne dans l'une de nos agences.",
            },
            {
              question: "Quelle est votre politique d'annulation?",
              answer:
                "Les annulations effectuées 24 heures avant le départ sont remboursées à 100%. Les annulations effectuées moins de 24 heures avant le départ sont remboursées à 50%.",
            },
            {
              question: "Puis-je modifier ma réservation?",
              answer:
                "Oui, vous pouvez modifier votre réservation jusqu'à 6 heures avant le départ, sous réserve de disponibilité, sans frais supplémentaires.",
            },
            {
              question: "Quels sont les documents nécessaires pour voyager?",
              answer:
                "Une pièce d'identité valide est requise pour tous les voyageurs. Pour les enfants, un certificat de naissance ou une pièce d'identité est nécessaire.",
            },
            {
              question: "Y a-t-il une limite de bagages?",
              answer:
                "Chaque passager a droit à un bagage en soute de 20 kg maximum et un bagage à main. Des frais supplémentaires s'appliquent pour les bagages excédentaires.",
            },
            {
              question: "Proposez-vous des réductions pour les groupes?",
              answer:
                "Oui, nous offrons des tarifs spéciaux pour les groupes de 10 personnes ou plus. Contactez notre service commercial pour plus d'informations.",
            },
          ].map((faq, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="mb-2 font-semibold">{faq.question}</h3>
                <p className="text-sm text-slate-600">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button asChild variant="link" className="text-amber-500">
            <Link href="/faq">Voir toutes les questions fréquentes</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
