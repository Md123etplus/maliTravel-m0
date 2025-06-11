"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Save, User, Mail, Phone, Lock, Globe, CreditCard, Shield } from "lucide-react"
import AccountSidebar from "@/components/account-sidebar"
import { useMobile } from "@/hooks/use-mobile"

export default function SettingsPage() {
  const isMobile = useMobile()
  const [activeTab, setActiveTab] = useState("profile")
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "Amadou",
    lastName: "Diallo",
    email: "amadou.diallo@example.com",
    phone: "+223 70 12 34 56",
    language: "fr",
    currency: "xof",
    emailNotifications: true,
    smsNotifications: true,
    marketingEmails: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simuler la sauvegarde
    setTimeout(() => {
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar pour desktop */}
        {!isMobile && (
          <div className="w-64 shrink-0">
            <AccountSidebar activeTab="profile" setActiveTab={setActiveTab} />
          </div>
        )}

        {/* Contenu principal */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Paramètres du compte</h1>
            {saveSuccess && (
              <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-1 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Modifications enregistrées</span>
              </div>
            )}
          </div>

          <Tabs defaultValue="profile">
            <TabsList className="mb-8">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="preferences">Préférences</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
              <TabsTrigger value="payment">Paiement</TabsTrigger>
            </TabsList>

            {/* Onglet Profil */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-6 flex flex-col items-center sm:flex-row sm:items-start gap-6">
                      <div className="flex flex-col items-center">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src="/placeholder.svg?height=100&width=100" alt="Amadou Diallo" />
                          <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm" className="mt-4">
                          Changer la photo
                        </Button>
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">Prénom</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                id="firstName"
                                name="firstName"
                                className="pl-10"
                                value={formData.firstName}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Nom</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                id="lastName"
                                name="lastName"
                                className="pl-10"
                                value={formData.lastName}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              className="pl-10"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Téléphone</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="phone"
                              name="phone"
                              className="pl-10"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer les modifications
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Préférences */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences</CardTitle>
                  <CardDescription>Personnalisez votre expérience</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">Langue</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Select
                          value={formData.language}
                          onValueChange={(value) => handleSelectChange("language", value)}
                        >
                          <SelectTrigger className="pl-10 w-full">
                            <SelectValue placeholder="Sélectionnez une langue" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="bm">Bambara</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Devise</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Select
                          value={formData.currency}
                          onValueChange={(value) => handleSelectChange("currency", value)}
                        >
                          <SelectTrigger className="pl-10 w-full">
                            <SelectValue placeholder="Sélectionnez une devise" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="xof">Franc CFA (FCFA)</SelectItem>
                            <SelectItem value="eur">Euro (€)</SelectItem>
                            <SelectItem value="usd">Dollar US ($)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Préférences de voyage</Label>
                      <div className="rounded-md border p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="window-seat">Siège côté fenêtre</Label>
                            <p className="text-sm text-slate-500">Préférer les sièges côté fenêtre quand disponible</p>
                          </div>
                          <Switch id="window-seat" defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="front-seat">Siège avant</Label>
                            <p className="text-sm text-slate-500">Préférer les sièges à l'avant du bus</p>
                          </div>
                          <Switch id="front-seat" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer les préférences
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Notifications */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Gérez vos préférences de notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">Notifications par email</Label>
                          <p className="text-sm text-slate-500">
                            Recevoir des notifications par email pour les réservations et les mises à jour
                          </p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={formData.emailNotifications}
                          onCheckedChange={(checked) => handleSwitchChange("emailNotifications", checked)}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sms-notifications">Notifications par SMS</Label>
                          <p className="text-sm text-slate-500">
                            Recevoir des notifications par SMS pour les réservations et les mises à jour
                          </p>
                        </div>
                        <Switch
                          id="sms-notifications"
                          checked={formData.smsNotifications}
                          onCheckedChange={(checked) => handleSwitchChange("smsNotifications", checked)}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="marketing-emails">Emails marketing</Label>
                          <p className="text-sm text-slate-500">
                            Recevoir des emails sur les promotions et les offres spéciales
                          </p>
                        </div>
                        <Switch
                          id="marketing-emails"
                          checked={formData.marketingEmails}
                          onCheckedChange={(checked) => handleSwitchChange("marketingEmails", checked)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer les préférences
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Sécurité */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité</CardTitle>
                  <CardDescription>Gérez la sécurité de votre compte</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Mot de passe actuel</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input id="current-password" type="password" className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nouveau mot de passe</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input id="new-password" type="password" className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input id="confirm-password" type="password" className="pl-10" />
                        </div>
                      </div>
                    </div>
                    <div className="rounded-md bg-amber-50 p-4">
                      <div className="flex">
                        <Shield className="h-5 w-5 text-amber-500" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-amber-800">Conseils de sécurité</h3>
                          <div className="mt-2 text-sm text-amber-700">
                            <ul className="list-disc space-y-1 pl-5">
                              <li>Utilisez au moins 8 caractères</li>
                              <li>Incluez au moins une lettre majuscule et une lettre minuscule</li>
                              <li>Incluez au moins un chiffre et un caractère spécial</li>
                              <li>Évitez d'utiliser des informations personnelles facilement devinables</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                        <Save className="mr-2 h-4 w-4" />
                        Mettre à jour le mot de passe
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <Separator className="my-4" />
                <CardContent>
                  <h3 className="text-lg font-medium">Connexions récentes</h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Voici les appareils qui se sont récemment connectés à votre compte
                  </p>
                  <div className="space-y-4">
                    {[
                      {
                        device: "Chrome sur Windows",
                        location: "Bamako, Mali",
                        time: "Aujourd'hui à 10:45",
                        current: true,
                      },
                      {
                        device: "Safari sur iPhone",
                        location: "Bamako, Mali",
                        time: "Hier à 18:30",
                        current: false,
                      },
                      {
                        device: "Firefox sur Windows",
                        location: "Ségou, Mali",
                        time: "15 mai 2023 à 14:20",
                        current: false,
                      },
                    ].map((session, index) => (
                      <div key={index} className="flex items-center justify-between rounded-md border p-4">
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{session.device}</span>
                            {session.current && (
                              <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                                Actuel
                              </span>
                            )}
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            {session.location} • {session.time}
                          </div>
                        </div>
                        {!session.current && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            Déconnecter
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Paiement */}
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Méthodes de paiement</CardTitle>
                  <CardDescription>Gérez vos méthodes de paiement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-orange-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="font-medium">Orange Money</p>
                            <p className="text-sm text-slate-500">+223 70 12 34 56</p>
                          </div>
                        </div>
                        <Badge>Par défaut</Badge>
                      </div>
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="font-medium">Carte Visa</p>
                            <p className="text-sm text-slate-500">**** **** **** 4242</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Définir par défaut
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button variant="outline" className="w-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Ajouter une méthode de paiement
                    </Button>
                  </div>
                </CardContent>
                <Separator className="my-4" />
                <CardContent>
                  <h3 className="text-lg font-medium">Historique des transactions</h3>
                  <p className="text-sm text-slate-500 mb-4">Vos transactions récentes</p>
                  <div className="space-y-4">
                    {[
                      {
                        id: "T12345",
                        description: "Réservation Bamako - Ségou",
                        date: "15 mai 2023",
                        amount: "24000 FCFA",
                        status: "success",
                      },
                      {
                        id: "T12346",
                        description: "Réservation Ségou - Bamako",
                        date: "15 mai 2023",
                        amount: "12000 FCFA",
                        status: "success",
                      },
                      {
                        id: "T12347",
                        description: "Remboursement partiel",
                        date: "10 avril 2023",
                        amount: "-8000 FCFA",
                        status: "refund",
                      },
                    ].map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between rounded-md border p-4">
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="mt-1 text-sm text-slate-500">
                            {transaction.date} • #{transaction.id}
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={
                              transaction.status === "refund"
                                ? "font-medium text-green-600"
                                : "font-medium text-slate-900"
                            }
                          >
                            {transaction.amount}
                          </div>
                          <div className="mt-1">
                            <Badge
                              className={
                                transaction.status === "success"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }
                            >
                              {transaction.status === "success" ? "Réussi" : "Remboursement"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="link" className="text-amber-500">
                      Voir toutes les transactions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
