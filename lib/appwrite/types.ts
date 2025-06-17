// Types basés sur votre structure de base de données

export interface User {
  $id: string
  name: string
  email: string
  phone: string
  role: "client" | "admin"
  created_at: string
  profile_image?: string
}

export interface Destination {
  $id: string
  name: string
  city: string
  region: string
  country: string
  description: string
  image: string
  popular: boolean
  coordinates: string
}

export interface Route {
  $id: string
  origin_id: string
  destination_id: string
  distance: number
  duration: number
  price: number
  active: boolean
  origin?: Destination
  destination?: Destination
}

export interface Vehicle {
  $id: string
  name: string
  type: "bus" | "minibus"
  registration: string
  capacity: number
  features: string[]
  image: string
  active: boolean
}

export interface SeatLayout {
  $id: string
  vehicle_id: string
  name: string
  rows: number
  columns: number
  layout_data: any
}

export interface Seat {
  $id: string
  layout_id: string
  seat_number: string
  row: number
  column: number
  type: "standard" | "premium" | "handicapé"
  price_modifier: number
}

export interface Trip {
  $id: string
  route_id: string
  vehicle_id: string
  departure_time: string
  arrival_time: string
  status: "planifié" | "en cours" | "terminé" | "annulé"
  price: number
  available_seats: number
  route?: Route
  vehicle?: Vehicle
}

export interface Booking {
  vehicle_id: string
  $id: string
  user_id: string
  trip_id: string
  booking_date: string
  trip_type: "aller simple" | "aller-retour"
  return_trip_id?: string
  total_price: number
  status: "confirmé" | "en attente" | "annulé"
  payment_status: "pending" | "paid" | "refunded"
  trip?: Trip
  return_trip?: Trip
  seats?: BookingSeat[]
  payment?: Payment
}

export interface BookingSeat {
  $id: string
  booking_id: string
  seat_id: string
  passenger_name: string
  passenger_id_type: string
  passenger_id_number: string
  seat?: Seat
}

export interface Payment {
  $id: string
  booking_id: string
  amount: number
  payment_method: "Orange Money" | "Wave" | "carte bancaire"
  transaction_id: string
  status: "pending" | "completed" | "failed"
  payment_date: string
}

export interface Review {
  $id: string
  user_id: string
  trip_id: string
  rating: number
  comment: string
  created_at: string
}
