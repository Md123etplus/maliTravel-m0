"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calendar, Download, Route, CreditCard } from "lucide-react"
import { getBookings, getRoutes, getVehicles, getUsers, getPayments } from "@/lib/appwrite/admin"
import { useToast } from "@/components/ui/use-toast"
import { Vehicle, Booking } from "@/lib/appwrite/types"

export default function ReportsManager() {
  const [reportData, setReportData] = useState<any>({
    bookings: [],
    routes: [],
    vehicles: [],
    users: [],
    payments: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [reportType, setReportType] = useState("overview")
  const [dateRange, setDateRange] = useState("month")
  const { toast } = useToast()

  useEffect(() => {
    loadReportData()
  }, [])

  const loadReportData = async () => {
    try {
      setIsLoading(true)
      const [bookings, routes, vehicles, users, payments] = await Promise.all([
        getBookings(),
        getRoutes(),
        getVehicles(),
        getUsers(),
        getPayments(),
      ])

      setReportData({
        bookings,
        routes,
        vehicles,
        users,
        payments,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load report data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getFilteredData = (data: any[], dateField = "$createdAt") => {
    if (dateRange === "all") return data

    const now = new Date()
    const startDate = new Date()

    switch (dateRange) {
      case "today":
        startDate.setHours(0, 0, 0, 0)
        break
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "quarter":
        startDate.setMonth(now.getMonth() - 3)
        break
      case "year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    return data.filter((item) => new Date(item[dateField]) >= startDate)
  }

  const getBookingStats = () => {
    const filteredBookings = getFilteredData(reportData.bookings)

    const stats = {
      total: filteredBookings.length,
      confirmed: filteredBookings.filter((b) => b.status === "confirmed").length,
      pending: filteredBookings.filter((b) => b.status === "pending").length,
      cancelled: filteredBookings.filter((b) => b.status === "cancelled").length,
      revenue: filteredBookings
        .filter((b) => b.status === "confirmed")
        .reduce((sum, b) => sum + (b.total_amount || 0), 0),
    }

    return stats
  }

  const getPopularRoutes = () => {
    const filteredBookings = getFilteredData(reportData.bookings)
    const routeStats: { [route: string]: number } = {}

    filteredBookings.forEach((booking) => {
      const route = `${booking.origin_name || "Unknown"} → ${booking.destination_name || "Unknown"}`
      routeStats[route] = (routeStats[route] || 0) + 1
    })

    return Object.entries(routeStats)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([route, count]) => ({ route, count }))
  }

  const getVehicleUtilization = () => {
    const activeVehicles = reportData.vehicles.filter((v: { active: any }) => v.active)
    const filteredBookings = getFilteredData(reportData.bookings)

    const utilization: Record<string, number> = {}
    activeVehicles.forEach((vehicle: Vehicle) => {
      const vehicleBookings = filteredBookings.filter((b: Booking) => b.vehicle_id === vehicle.$id)
      utilization[vehicle.name || vehicle.registration] = vehicleBookings.length
    })

    return Object.entries(utilization)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([vehicle, bookings]) => ({ vehicle, bookings }))
  }

  const getPaymentStats = () => {
    const filteredPayments = getFilteredData(reportData.payments, "payment_date")

    const stats = {
      total: filteredPayments.length,
      completed: filteredPayments.filter((p) => p.status === "completed").length,
      pending: filteredPayments.filter((p) => p.status === "pending").length,
      failed: filteredPayments.filter((p) => p.status === "failed").length,
      totalAmount: filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
      completedAmount: filteredPayments
        .filter((p) => p.status === "completed")
        .reduce((sum, p) => sum + (p.amount || 0), 0),
    }

    const methodStats: Record<string, number> = {}
    filteredPayments.forEach((payment) => {
      const method = payment.payment_method || "Unknown"
      methodStats[method] = (methodStats[method] || 0) + 1
    })

    return { ...stats, methodStats }
  }

  const bookingStats = getBookingStats()
  const popularRoutes = getPopularRoutes()
  const vehicleUtilization = getVehicleUtilization()
  const paymentStats = getPaymentStats()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#23282d]">Reports & Analytics</h1>
        </div>
        <div className="text-center py-8">Loading reports...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#23282d]">Reports & Analytics</h1>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="bookings">Bookings</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="vehicles">Vehicles</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666]">Total Bookings</p>
                <p className="text-2xl font-bold text-[#23282d]">{bookingStats.total}</p>
                <p className="text-xs text-[#666]">
                  {Math.round((bookingStats.confirmed / bookingStats.total) * 100) || 0}% confirmed
                </p>
              </div>
              <Calendar className="h-8 w-8 text-[#0073aa]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666]">Revenue</p>
                <p className="text-2xl font-bold text-[#23282d]">{bookingStats.revenue.toLocaleString()} FCFA</p>
                <p className="text-xs text-[#666]">From confirmed bookings</p>
              </div>
              <TrendingUp className="h-8 w-8 text-[#00a32a]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666]">Active Routes</p>
                <p className="text-2xl font-bold text-[#23282d]">{reportData.routes.filter((r: { active: any }) => r.active).length}</p>
                <p className="text-xs text-[#666]">Available for booking</p>
              </div>
              <Route className="h-8 w-8 text-[#ff6900]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666]">Payment Rate</p>
                <p className="text-2xl font-bold text-[#23282d]">
                  {Math.round((paymentStats.completed / paymentStats.total) * 100) || 0}%
                </p>
                <p className="text-xs text-[#666]">Successfully processed</p>
              </div>
              <CreditCard className="h-8 w-8 text-[#826eb4]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Routes */}
        <Card>
          <CardHeader>
            <CardTitle>Most Popular Routes</CardTitle>
            <CardDescription>Routes with highest booking volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularRoutes.map((route, index) => (
                <div key={route.route} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#0073aa] text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{route.route}</span>
                  </div>
                  <Badge variant="outline">{route.count} bookings</Badge>
                </div>
              ))}
              {popularRoutes.length === 0 && (
                <div className="text-center py-4 text-[#666]">No booking data available</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Utilization</CardTitle>
            <CardDescription>Most utilized vehicles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vehicleUtilization.map((vehicle, index) => (
                <div key={vehicle.vehicle} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#00a32a] text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{vehicle.vehicle}</span>
                  </div>
                  <Badge variant="outline">{vehicle.bookings} trips</Badge>
                </div>
              ))}
              {vehicleUtilization.length === 0 && (
                <div className="text-center py-4 text-[#666]">No utilization data available</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Booking Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Status Distribution</CardTitle>
            <CardDescription>Breakdown of booking statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Confirmed</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{
                        width: `${bookingStats.total > 0 ? (bookingStats.confirmed / bookingStats.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">{bookingStats.confirmed}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 transition-all"
                      style={{
                        width: `${bookingStats.total > 0 ? (bookingStats.pending / bookingStats.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">{bookingStats.pending}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cancelled</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all"
                      style={{
                        width: `${bookingStats.total > 0 ? (bookingStats.cancelled / bookingStats.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">{bookingStats.cancelled}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Distribution of payment methods used</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(paymentStats.methodStats).map(([method, count]) => (
                <div key={method} className="flex items-center justify-between">
                  <span className="text-sm">{method}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{
                          width: `${paymentStats.total > 0 ? ((count as number) / paymentStats.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">{count as number}</span>
                  </div>
                </div>
              ))}
              {Object.keys(paymentStats.methodStats).length === 0 && (
                <div className="text-center py-4 text-[#666]">No payment data available</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
