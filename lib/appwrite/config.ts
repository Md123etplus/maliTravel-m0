import { Client, Account, Databases, Storage, ID } from "appwrite"

// Configuration Appwrite
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1"
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "6849f24b0034e830d918"

// Database et Collections IDs (selon votre structure)
export const DATABASE_ID = "6849f32c0004d098ab7e"
export const COLLECTION_USERS = "6849f34c0038fcad73c9"
export const COLLECTION_DESTINATIONS = "6849f446002baa3c8780"
export const COLLECTION_ROUTES = "6849f438000b0d502a06"
export const COLLECTION_VEHICLES = "6849f429001a8c71f6c2"
export const COLLECTION_SEAT_LAYOUTS = "6849f4190028fb99d634"
export const COLLECTION_SEATS = "6849f40c003d8b88e30b"
export const COLLECTION_TRIPS = "6849f4000034dd8c4216"
export const COLLECTION_BOOKINGS = "6849f3f6000254bb9cd6"
export const COLLECTION_BOOKING_SEATS = "6849f3e8002980432976"
export const COLLECTION_PAYMENTS = "6849f3d3000e157e759a"
export const COLLECTION_REVIEWS = "6849f3c4001454b910d7"

// Client Appwrite
export const client = new Client()

client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID)

// Services
export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)

// Helper functions
export { ID }
