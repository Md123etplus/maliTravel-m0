"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"

interface SeatSelectorProps {
  totalSeats: number
  availableSeats: number
  selectedSeats: string[]
  onSeatSelect: (seatId: string) => void
}

export function SeatSelector({ totalSeats, availableSeats, selectedSeats, onSeatSelect }: SeatSelectorProps) {
  // Générer un tableau de sièges disponibles et occupés
  const generateSeats = () => {
    const seats = []
    const occupiedSeats = []

    // Simuler des sièges occupés aléatoires
    while (occupiedSeats.length < totalSeats - availableSeats) {
      const randomSeat = Math.floor(Math.random() * totalSeats) + 1
      if (!occupiedSeats.includes(randomSeat.toString())) {
        occupiedSeats.push(randomSeat.toString())
      }
    }

    for (let i = 1; i <= totalSeats; i++) {
      const seatId = i.toString()
      const isOccupied = occupiedSeats.includes(seatId)
      const isSelected = selectedSeats.includes(seatId)

      seats.push({
        id: seatId,
        status: isOccupied ? "occupied" : isSelected ? "selected" : "available",
      })
    }

    return seats
  }

  const [seats] = useState(generateSeats)

  // Fonction pour obtenir la classe CSS en fonction du statut du siège
  const getSeatClass = (status: string) => {
    switch (status) {
      case "available":
        return "bg-white border-slate-200 hover:border-amber-500 hover:bg-amber-50"
      case "selected":
        return "bg-amber-500 border-amber-500 text-white"
      case "occupied":
        return "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
      default:
        return "bg-white border-slate-200"
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-medium">Sélectionnez vos sièges</div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white">
            {availableSeats} sièges disponibles
          </Badge>
          <Badge variant="outline" className="bg-amber-500 text-white">
            {selectedSeats.length} sélectionnés
          </Badge>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-center gap-4">
        <div className="flex items-center">
          <div className="mr-2 h-4 w-4 rounded-sm border border-slate-200 bg-white"></div>
          <span className="text-xs">Disponible</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-4 w-4 rounded-sm border border-amber-500 bg-amber-500"></div>
          <span className="text-xs">Sélectionné</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-4 w-4 rounded-sm border border-slate-200 bg-slate-100"></div>
          <span className="text-xs">Occupé</span>
        </div>
      </div>

      <div className="relative mb-8 rounded-lg border border-slate-200 bg-slate-50 p-6">
        {/* Avant du bus */}
        <div className="mb-6 flex items-center justify-center">
          <div className="h-8 w-32 rounded-t-lg bg-slate-300"></div>
        </div>

        {/* Sièges */}
        <div className="grid grid-cols-4 gap-2">
          {seats.map((seat) => (
            <Button
              key={seat.id}
              variant="outline"
              size="sm"
              className={`h-10 w-full ${getSeatClass(seat.status)}`}
              disabled={seat.status === "occupied"}
              onClick={() => onSeatSelect(seat.id)}
            >
              {seat.id}
            </Button>
          ))}
        </div>

        {/* Arrière du bus */}
        <div className="mt-6 flex items-center justify-center">
          <div className="h-4 w-32 rounded-b-lg bg-slate-300"></div>
        </div>
      </div>

      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <Info className="h-5 w-5 text-blue-500" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Information</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Les sièges à l'avant du bus offrent plus d'espace pour les jambes. Les sièges à l'arrière peuvent être
                plus bruyants en raison de la proximité du moteur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
