// import { databases } from "./config"
import { Query } from "appwrite"

// const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
// const TRIPS_COLLECTION_ID = process.env.COLLECTION_TRIPS!
// const ROUTES_COLLECTION_ID = process.env.COLLECTION_ROUTES!
// const VEHICLES_COLLECTION_ID = process.env.COLLECTION_VEHICLES!
// const USERS_COLLECTION_ID = process.env.COLLECTION_USERS!
// const BOOKINGS_COLLECTION_ID = process.env.COLLECTION_BOOKINGS!

// const DATABASE_ID ="6849f32c0004d098ab7e"
const TRIPS_COLLECTION_ID ="6849f4000034dd8c4216"
const ROUTES_COLLECTION_ID ="6849f438000b0d502a06"
const VEHICLES_COLLECTION_ID ="6849f429001a8c71f6c2"
const USERS_COLLECTION_ID ="6849f34c0038fcad73c9"
const BOOKINGS_COLLECTION_ID ="6849f3f6000254bb9cd6"
const CITIES_COLLECTION_ID = "6849f446002baa3c8780"
// Trips Management
import {
  databases,
//   Query,
  DATABASE_ID,
  COLLECTION_DESTINATIONS,
  COLLECTION_ROUTES,
  COLLECTION_VEHICLES,
  COLLECTION_USERS,
  COLLECTION_BOOKINGS,
  COLLECTION_TRIPS,
  COLLECTION_PAYMENTS, // Declare COLLECTION_PAYMENTS here
} from "./config"

// Destinations Management
export const getDestinations = async () => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_DESTINATIONS, [
      Query.orderAsc("name"),
      Query.limit(100),
    ])
    return response.documents
  } catch (error) {
    console.error("Error fetching destinations:", error)
    throw error
  }
}

export const createDestination = async (destinationData: any) => {
  try {
    const response = await databases.createDocument(DATABASE_ID, COLLECTION_DESTINATIONS, "unique()", destinationData)
    return response
  } catch (error) {
    console.error("Error creating destination:", error)
    throw error
  }
}

export const updateDestination = async (destinationId: string, destinationData: any) => {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_DESTINATIONS,
      destinationId,
      destinationData,
    )
    return response
  } catch (error) {
    console.error("Error updating destination:", error)
    throw error
  }
}

export const deleteDestination = async (destinationId: string) => {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_DESTINATIONS, destinationId)
  } catch (error) {
    console.error("Error deleting destination:", error)
    throw error
  }
}

// Trips Management
export const getTrips = async () => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_TRIPS, [
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ])
    return response.documents
  } catch (error) {
    console.error("Error fetching trips:", error)
    throw error
  }
}

export const createTrip = async (tripData: any) => {
  try {
    const response = await databases.createDocument(DATABASE_ID, COLLECTION_TRIPS, "unique()", tripData)
    return response
  } catch (error) {
    console.error("Error creating trip:", error)
    throw error
  }
}

export const updateTrip = async (tripId: string, tripData: any) => {
  try {
    const response = await databases.updateDocument(DATABASE_ID, COLLECTION_TRIPS, tripId, tripData)
    return response
  } catch (error) {
    console.error("Error updating trip:", error)
    throw error
  }
}

export const deleteTrip = async (tripId: string) => {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_TRIPS, tripId)
  } catch (error) {
    console.error("Error deleting trip:", error)
    throw error
  }
}

// Routes Management
export const getRoutes = async () => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ROUTES, [Query.orderDesc("$createdAt")])
    return response.documents
  } catch (error) {
    console.error("Error fetching routes:", error)
    throw error
  }
}

export const createRoute = async (routeData: any) => {
  try {
    const response = await databases.createDocument(DATABASE_ID, COLLECTION_ROUTES, "unique()", routeData)
    return response
  } catch (error) {
    console.error("Error creating route:", error)
    throw error
  }
}

export const updateRoute = async (routeId: string, routeData: any) => {
  try {
    const response = await databases.updateDocument(DATABASE_ID, COLLECTION_ROUTES, routeId, routeData)
    return response
  } catch (error) {
    console.error("Error updating route:", error)
    throw error
  }
}

export const deleteRoute = async (routeId: string) => {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ROUTES, routeId)
  } catch (error) {
    console.error("Error deleting route:", error)
    throw error
  }
}

// Vehicles Management
export const getVehicles = async () => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_VEHICLES, [Query.orderDesc("$createdAt")])
    return response.documents
  } catch (error) {
    console.error("Error fetching vehicles:", error)
    throw error
  }
}

export const createVehicle = async (vehicleData: any) => {
  try {
    const response = await databases.createDocument(DATABASE_ID, COLLECTION_VEHICLES, "unique()", vehicleData)
    return response
  } catch (error) {
    console.error("Error creating vehicle:", error)
    throw error
  }
}

export const updateVehicle = async (vehicleId: string, vehicleData: any) => {
  try {
    const response = await databases.updateDocument(DATABASE_ID, COLLECTION_VEHICLES, vehicleId, vehicleData)
    return response
  } catch (error) {
    console.error("Error updating vehicle:", error)
    throw error
  }
}

export const deleteVehicle = async (vehicleId: string) => {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_VEHICLES, vehicleId)
  } catch (error) {
    console.error("Error deleting vehicle:", error)
    throw error
  }
}

// Users Management
export const getUsers = async () => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_USERS, [
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ])
    return response.documents
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

export const updateUser = async (userId: string, userData: any) => {
  try {
    const response = await databases.updateDocument(DATABASE_ID, COLLECTION_USERS, userId, userData)
    return response
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

export const deleteUser = async (userId: string) => {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_USERS, userId)
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}

// Bookings Management
export const getBookings = async () => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_BOOKINGS, [
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ])
    return response.documents
  } catch (error) {
    console.error("Error fetching bookings:", error)
    throw error
  }
}

export const updateBooking = async (bookingId: string, bookingData: any) => {
  try {
    const response = await databases.updateDocument(DATABASE_ID, COLLECTION_BOOKINGS, bookingId, bookingData)
    return response
  } catch (error) {
    console.error("Error updating booking:", error)
    throw error
  }
}

export const deleteBooking = async (bookingId: string) => {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_BOOKINGS, bookingId)
  } catch (error) {
    console.error("Error deleting booking:", error)
    throw error
  }
}

// Payments Management
export const getPayments = async () => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_PAYMENTS, [
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ])
    return response.documents
  } catch (error) {
    console.error("Error fetching payments:", error)
    throw error
  }
}

export const updatePayment = async (paymentId: string, paymentData: any) => {
  try {
    const response = await databases.updateDocument(DATABASE_ID, COLLECTION_PAYMENTS, paymentId, paymentData)
    return response
  } catch (error) {
    console.error("Error updating payment:", error)
    throw error
  }
}

export const deletePayment = async (paymentId: string) => {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_PAYMENTS, paymentId)
  } catch (error) {
    console.error("Error deleting payment:", error)
    throw error
  }
}
