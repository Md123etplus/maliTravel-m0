import {
  databases,
  DATABASE_ID,
  COLLECTION_BOOKINGS,
  COLLECTION_BOOKING_SEATS,
  COLLECTION_TRIPS,
  COLLECTION_ROUTES,
  COLLECTION_DESTINATIONS,
  COLLECTION_VEHICLES,
  COLLECTION_SEATS,
  COLLECTION_PAYMENTS,
  ID,
} from "./config"
import { Query } from "appwrite"
import type { Booking, Trip, BookingSeat, Payment } from "./types"

// Récupérer les réservations d'un utilisateur avec toutes les données associées
export async function getUserBookings(userId: string): Promise<Booking[]> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_BOOKINGS, [
      Query.equal("user_id", userId),
      Query.orderDesc("booking_date"),
    ])

    // Si aucune réservation trouvée, retourner un tableau vide
    if (response.documents.length === 0) {
      return []
    }

    // Récupérer les détails complets pour chaque réservation
    const bookingsWithDetails = await Promise.all(
      response.documents.map(async (booking) => {
        try {
          // Récupérer le voyage principal
          const trip = await getTripWithDetails(booking.trip_id)

          // Récupérer le voyage retour si applicable
          let returnTrip = null
          if (booking.return_trip_id) {
            returnTrip = await getTripWithDetails(booking.return_trip_id)
          }

          // Récupérer les sièges réservés
          const seatsResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_BOOKING_SEATS, [
            Query.equal("booking_id", booking.$id),
          ])

          const seats = await Promise.all(
            seatsResponse.documents.map(async (bookingSeat) => {
              try {
                const seat = await databases.getDocument(DATABASE_ID, COLLECTION_SEATS, bookingSeat.seat_id)
                return {
                  ...bookingSeat,
                  seat,
                } as unknown as BookingSeat
              } catch (error) {
                return bookingSeat as unknown as BookingSeat
              }
            }),
          )

          // Récupérer les informations de paiement
          let payment = null
          try {
            const paymentResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_PAYMENTS, [
              Query.equal("booking_id", booking.$id),
            ])
            if (paymentResponse.documents.length > 0) {
              payment = paymentResponse.documents[0] as unknown as Payment
            }
          } catch (error) {
            console.error("Erreur lors de la récupération du paiement:", error)
          }

          return {
            ...booking,
            trip,
            return_trip: returnTrip,
            seats,
            payment,
          } as unknown as Booking
        } catch (error) {
          console.error("Erreur lors de la récupération des détails de réservation:", error)
          return booking as unknown as Booking
        }
      }),
    )

    return bookingsWithDetails
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error)
    return [] // Retourner un tableau vide au lieu de faire planter l'app
  }
}

// Récupérer un voyage avec tous ses détails (route, destinations, véhicule)
async function getTripWithDetails(tripId: string): Promise<Trip | null> {
  try {
    const trip = await databases.getDocument(DATABASE_ID, COLLECTION_TRIPS, tripId)

    // Récupérer la route
    const route = await databases.getDocument(DATABASE_ID, COLLECTION_ROUTES, trip.route_id)

    // Récupérer les destinations
    const origin = await databases.getDocument(DATABASE_ID, COLLECTION_DESTINATIONS, route.origin_id)
    const destination = await databases.getDocument(DATABASE_ID, COLLECTION_DESTINATIONS, route.destination_id)

    // Récupérer le véhicule
    const vehicle = await databases.getDocument(DATABASE_ID, COLLECTION_VEHICLES, trip.vehicle_id)

    return {
      ...trip,
      route: {
        ...route,
        origin,
        destination,
      },
      vehicle,
    } as unknown as Trip
  } catch (error) {
    console.error("Erreur lors de la récupération du voyage:", error)
    return null
  }
}

// Récupérer une réservation spécifique
export async function getBooking(bookingId: string): Promise<Booking | null> {
  try {
    const booking = await databases.getDocument(DATABASE_ID, COLLECTION_BOOKINGS, bookingId)

    // Récupérer les détails du voyage
    const trip = await getTripWithDetails(booking.trip_id)

    // Récupérer le voyage retour si applicable
    let returnTrip = null
    if (booking.return_trip_id) {
      returnTrip = await getTripWithDetails(booking.return_trip_id)
    }

    // Récupérer les sièges
    const seatsResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_BOOKING_SEATS, [
      Query.equal("booking_id", booking.$id),
    ])

    const seats = await Promise.all(
      seatsResponse.documents.map(async (bookingSeat) => {
        try {
          const seat = await databases.getDocument(DATABASE_ID, COLLECTION_SEATS, bookingSeat.seat_id)
          return {
            ...bookingSeat,
            seat,
          } as unknown as BookingSeat
        } catch (error) {
          return bookingSeat as unknown as BookingSeat
        }
      }),
    )

    // Récupérer le paiement
    let payment = null
    try {
      const paymentResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_PAYMENTS, [
        Query.equal("booking_id", booking.$id),
      ])
      if (paymentResponse.documents.length > 0) {
        payment = paymentResponse.documents[0] as unknown as Payment
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du paiement:", error)
    }

    return {
      ...booking,
      trip,
      return_trip: returnTrip,
      seats,
      payment,
    } as unknown as Booking
  } catch (error) {
    console.error("Erreur lors de la récupération de la réservation:", error)
    return null
  }
}

// Créer une nouvelle réservation
export async function createBooking(bookingData: Omit<Booking, "$id" | "booking_date">) {
  try {
    const booking = await databases.createDocument(DATABASE_ID, COLLECTION_BOOKINGS, ID.unique(), {
      ...bookingData,
      booking_date: new Date().toISOString(),
    })

    return booking
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error)
    throw error
  }
}

// Annuler une réservation
export async function cancelBooking(bookingId: string) {
  try {
    return await databases.updateDocument(DATABASE_ID, COLLECTION_BOOKINGS, bookingId, {
      status: "annulé",
      payment_status: "refunded",
    })
  } catch (error) {
    console.error("Erreur lors de l'annulation de la réservation:", error)
    throw error
  }
}

// Calculer les points de fidélité basés sur l'historique des réservations
export async function calculateLoyaltyPoints(userId: string): Promise<number> {
  try {
    const bookingsResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_BOOKINGS, [
      Query.equal("user_id", userId),
      Query.equal("status", "confirmé"),
    ])

    // 1 point pour chaque 1000 FCFA dépensés
    const totalPoints = bookingsResponse.documents.reduce((total, booking) => {
      return total + Math.floor(booking.total_price / 1000)
    }, 0)

    // Bonus de 100 points pour l'inscription
    return totalPoints + 100
  } catch (error) {
    console.error("Erreur lors du calcul des points de fidélité:", error)
    return 100 // Points de base
  }
}

// Obtenir les statistiques utilisateur
export async function getUserStats(userId: string) {
  try {
    const bookingsResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_BOOKINGS, [
      Query.equal("user_id", userId),
    ])

    const totalBookings = bookingsResponse.documents.length
    const upcomingBookings = bookingsResponse.documents.filter((b) => b.status === "confirmé").length
    const completedBookings = bookingsResponse.documents.filter((b) => b.status === "confirmé").length // Vous pourriez avoir un statut "terminé"
    const totalSpent = bookingsResponse.documents.reduce((total, booking) => total + booking.total_price, 0)

    return {
      totalBookings,
      upcomingBookings,
      completedBookings,
      totalSpent,
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error)
    return {
      totalBookings: 0,
      upcomingBookings: 0,
      completedBookings: 0,
      totalSpent: 0,
    }
  }
}

// Récupérer l'historique des paiements d'un utilisateur
export async function getUserPayments(userId: string): Promise<Payment[]> {
  try {
    // D'abord récupérer toutes les réservations de l'utilisateur
    const bookingsResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_BOOKINGS, [
      Query.equal("user_id", userId),
    ])

    if (bookingsResponse.documents.length === 0) {
      return []
    }

    // Récupérer tous les paiements pour ces réservations
    const bookingIds = bookingsResponse.documents.map((booking) => booking.$id)
    const paymentsResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_PAYMENTS, [
      Query.equal("booking_id", bookingIds),
      Query.orderDesc("payment_date"),
    ])

    // Enrichir chaque paiement avec les détails de la réservation et du voyage
    const paymentsWithDetails = await Promise.all(
      paymentsResponse.documents.map(async (payment) => {
        try {
          // Trouver la réservation correspondante
          const booking = bookingsResponse.documents.find((b) => b.$id === payment.booking_id)

          if (booking) {
            // Récupérer les détails du voyage
            const trip = await getTripWithDetails(booking.trip_id)

            return {
              ...payment,
              booking: {
                ...booking,
                trip,
              },
            } as unknown as Payment
          }

          return payment as unknown as Payment
        } catch (error) {
          console.error("Erreur lors de la récupération des détails du paiement:", error)
          return payment as unknown as Payment
        }
      }),
    )

    return paymentsWithDetails
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements:", error)
    return []
  }
}
