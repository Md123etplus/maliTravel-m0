"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, MapPin, Users } from "lucide-react"
import { useRouter } from "next/navigation"

// Données simulées pour les villes
const cities = [
  { id: "bamako", name: "Bamako" },
  { id: "segou", name: "Ségou" },
  { id: "mopti", name: "Mopti" },
  { id: "sikasso", name: "Sikasso" },
  { id: "kayes", name: "Kayes" },
  { id: "gao", name: "Gao" },
  { id: "tombouctou", name: "Tombouctou" },
  { id: "kidal", name: "Kidal" },
]

export function SearchForm() {
  const router = useRouter()
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState<Date>()
  const [passengers, setPassengers] = useState("1")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation de base
    if (!origin || !destination || !date) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    // Redirection vers la page de recherche avec les paramètres
    const searchParams = new URLSearchParams({
      origin,
      destination,
      date: date.toISOString(),
      passengers,
    })

    router.push(`/search?${searchParams.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-4">
      <div className="space-y-2">
        <label htmlFor="origin" className="text-sm font-medium">
          Départ
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Select value={origin} onValueChange={setOrigin}>
            <SelectTrigger id="origin" className="pl-10">
              <SelectValue placeholder="Ville de départ" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="destination" className="text-sm font-medium">
          Arrivée
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger id="destination" className="pl-10">
              <SelectValue placeholder="Ville d'arrivée" />
            </SelectTrigger>
            <SelectContent>
              {cities
                .filter((city) => city.id !== origin)
                .map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="date" className="text-sm font-medium">
          Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start pl-10 text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              {date ? format(date, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              locale={fr}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label htmlFor="passengers" className="text-sm font-medium">
          Passagers
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Select value={passengers} onValueChange={setPassengers}>
            <SelectTrigger id="passengers" className="pl-10">
              <SelectValue placeholder="Nombre de passagers" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num > 1 ? "passagers" : "passager"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="md:col-span-4">
        <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">
          Rechercher
        </Button>
      </div>
    </form>
  )
}
