"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, User, Phone, Mail, Eye, Edit, Trash2 } from "lucide-react"
import { getBookings, updateBooking, deleteBooking } from "@/lib/appwrite/admin"
import { useToast } from "@/components/ui/use-toast"

export default function BookingsManager() {
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPayment, setFilterPayment] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      setIsLoading(true)
      const data = await getBookings()
      setBookings(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await updateBooking(bookingId, { status: newStatus })
      setBookings(bookings.map((booking) => (booking.$id === bookingId ? { ...booking, status: newStatus } : booking)))
      toast({
        title: "Success",
        description: "Booking status updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      })
    }
  }

  const handlePaymentStatusChange = async (bookingId: string, newPaymentStatus: string) => {
    try {
      await updateBooking(bookingId, { payment_status: newPaymentStatus })
      setBookings(
        bookings.map((booking) =>
          booking.$id === bookingId ? { ...booking, payment_status: newPaymentStatus } : booking,
        ),
      )
      toast({
        title: "Success",
        description: "Payment status updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (bookingId: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteBooking(bookingId)
        setBookings(bookings.filter((booking) => booking.$id !== bookingId))
        toast({
          title: "Success",
          description: "Booking deleted successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete booking",
          variant: "destructive",
        })
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      confirmed: { color: "bg-blue-100 text-blue-800", label: "Confirmed" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getPaymentBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-orange-100 text-orange-800", label: "Pending" },
      paid: { color: "bg-green-100 text-green-800", label: "Paid" },
      refunded: { color: "bg-gray-100 text-gray-800", label: "Refunded" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.$id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus
    const matchesPayment = filterPayment === "all" || booking.payment_status === filterPayment
    return matchesSearch && matchesStatus && matchesPayment
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#23282d]">Bookings Management</h1>
        </div>
        <div className="text-center py-8">Loading bookings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#23282d]">Bookings Management</h1>
        <div className="text-sm text-[#666]">Total: {bookings.length} bookings</div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by customer name, email, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={filterPayment} onValueChange={setFilterPayment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="pending">Payment Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings ({filteredBookings.length})</CardTitle>
          <CardDescription>Manage customer bookings and reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.$id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-lg">#{booking.$id}</span>
                      {getStatusBadge(booking.status || "pending")}
                      {getPaymentBadge(booking.payment_status || "pending")}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      {/* Customer Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-[#666]" />
                          <span className="font-medium">{booking.user_name || "Unknown User"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#666]">
                          <Mail className="h-4 w-4" />
                          <span>{booking.user_email || "No email"}</span>
                        </div>
                        {booking.user_phone && (
                          <div className="flex items-center gap-2 text-sm text-[#666]">
                            <Phone className="h-4 w-4" />
                            <span>{booking.user_phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Trip Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-[#666]" />
                          <span className="font-medium">
                            {booking.origin_name || "Unknown"} → {booking.destination_name || "Unknown"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#666]">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {booking.departure_time ? new Date(booking.departure_time).toLocaleDateString() : "No date"}{" "}
                            at{" "}
                            {booking.departure_time
                              ? new Date(booking.departure_time).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "No time"}
                          </span>
                        </div>
                        <div className="text-sm text-[#666]">
                          Vehicle: {booking.vehicle_license || "Unknown"} ({booking.vehicle_model || "Unknown"})
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#666] mb-3">
                      <div>
                        <span className="font-medium">Seats:</span> {booking.selected_seats || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Total:</span> {(booking.total_amount || 0).toLocaleString()} FCFA
                      </div>
                      <div>
                        <span className="font-medium">Booked:</span> {new Date(booking.$createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="text-sm bg-gray-50 p-2 rounded mb-3">
                        <span className="font-medium">Notes:</span> {booking.notes}
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Select
                        value={booking.status || "pending"}
                        onValueChange={(value) => handleStatusChange(booking.$id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={booking.payment_status || "pending"}
                        onValueChange={(value) => handlePaymentStatusChange(booking.$id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Payment Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(booking.$id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
