"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { databases, DATABASE_ID, COLLECTION_BOOKINGS, COLLECTION_BOOKING_SEATS } from "@/lib/appwrite/config"
import { Query } from "appwrite"
import { cn } from "@/lib/utils"

interface SeatSelectorProps {
  tripId: string
  maxSeats?: number
  onSeatSelection: (seats: number[]) => void
  selectedSeats: number[]
}

export function SeatSelector({ tripId, maxSeats = 4, onSeatSelection, selectedSeats }: SeatSelectorProps) {
  const [occupiedSeats, setOccupiedSeats] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load occupied seats from database
  useEffect(() => {
    const loadOccupiedSeats = async () => {
      try {
        setIsLoading(true)

        // Get all confirmed bookings for this trip
        const bookingsResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_BOOKINGS, [
          Query.equal("trip_id", tripId),
          Query.equal("status", "confirmé"),
        ])

        const bookingIds = bookingsResponse.documents.map((booking) => booking.$id)

        if (bookingIds.length > 0) {
          // Get all seat bookings for these bookings
          const seatBookingsResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_BOOKING_SEATS, [
            Query.equal("booking_id", bookingIds),
          ])

          // Extract seat numbers from seat_id (format: "seat_1", "seat_2", etc.)
          const occupied = seatBookingsResponse.documents
            .map((seatBooking) => {
              const seatId = seatBooking.seat_id as string
              const seatNumber = Number.parseInt(seatId.replace("seat_", ""))
              return isNaN(seatNumber) ? null : seatNumber
            })
            .filter((seat): seat is number => seat !== null)

          setOccupiedSeats(occupied)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des sièges occupés:", error)
        // Fallback to some default occupied seats if database query fails
        setOccupiedSeats([5, 12, 18, 23, 31, 44])
        toast({
          title: "Avertissement",
          description: "Impossible de charger l'état des sièges. Certains sièges peuvent ne pas être à jour.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadOccupiedSeats()
  }, [tripId, toast])

  const handleSeatClick = (seatNumber: number) => {
    if (occupiedSeats.includes(seatNumber)) return

    let newSelectedSeats: number[]

    if (selectedSeats.includes(seatNumber)) {
      // Deselect seat
      newSelectedSeats = selectedSeats.filter((seat) => seat !== seatNumber)
    } else {
      // Select seat (check max limit)
      if (selectedSeats.length >= maxSeats) {
        toast({
          title: "Limite atteinte",
          description: `Vous ne pouvez sélectionner que ${maxSeats} siège(s) maximum.`,
          variant: "destructive",
        })
        return
      }
      newSelectedSeats = [...selectedSeats, seatNumber].sort((a, b) => a - b)
    }

    onSeatSelection(newSelectedSeats)
  }

  const getSeatStatus = (seatNumber: number) => {
    if (occupiedSeats.includes(seatNumber)) return "occupied"
    if (selectedSeats.includes(seatNumber)) return "selected"
    return "available"
  }

  const getSeatColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "bg-red-500 text-white cursor-not-allowed"
      case "selected":
        return "bg-amber-500 text-white cursor-pointer hover:bg-amber-600"
      case "available":
      default:
        return "bg-gray-200 text-gray-700 cursor-pointer hover:bg-gray-300"
    }
  }

  // Generate seat layout (4 seats per row, 12 rows = 48 seats total)
  const generateSeats = () => {
    const seats = []
    for (let row = 0; row < 12; row++) {
      const rowSeats = []
      for (let col = 0; col < 4; col++) {
        const seatNumber = row * 4 + col + 1
        const status = getSeatStatus(seatNumber)

        rowSeats.push(
          <Button
            key={seatNumber}
            variant="outline"
            size="sm"
            className={cn("h-10 w-10 p-0 text-xs", getSeatColor(status))}
            onClick={() => handleSeatClick(seatNumber)}
            disabled={status === "occupied" || isLoading}
          >
            {seatNumber}
          </Button>,
        )

        // Add aisle space after 2nd seat
        if (col === 1) {
          rowSeats.push(<div key={`aisle-${row}`} className="w-4" />)
        }
      }

      seats.push(
        <div key={row} className="flex items-center justify-center gap-2">
          {rowSeats}
        </div>,
      )
    }
    return seats
  }

  const availableSeatsCount = 48 - occupiedSeats.length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Chargement des sièges...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-gray-200"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-amber-500"></div>
          <span>Sélectionné</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-red-500"></div>
          <span>Occupé</span>
        </div>
      </div>

      {/* Bus front indicator */}
      <div className="text-center">
        <div className="mx-auto w-32 rounded-t-full border-2 border-gray-300 bg-gray-100 p-2 text-xs font-medium">
          Avant du bus
        </div>
      </div>

      {/* Seat grid */}
      <div className="space-y-2">{generateSeats()}</div>

      {/* Selection info */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-gray-50 p-4">
        <div className="text-sm">
          <p className="font-medium">Sièges disponibles: {availableSeatsCount}</p>
          <p className="text-gray-600">Maximum {maxSeats} sièges par réservation</p>
        </div>
        {selectedSeats.length > 0 && (
          <div className="text-sm">
            <p className="font-medium">Sièges sélectionnés:</p>
            <div className="flex flex-wrap gap-1">
              {selectedSeats.map((seat) => (
                <Badge key={seat} variant="secondary" className="bg-amber-100 text-amber-800">
                  {seat}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
