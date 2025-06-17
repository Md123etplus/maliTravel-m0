"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Route, Bus, Users, Calendar, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import AdminSidebar from "@/components/admin-sidebar"
import TripsManager from "@/components/admin/trips-manager"
import RoutesManager from "@/components/admin/routes-manager"
import VehiclesManager from "@/components/admin/vehicles-manager"
import UsersManager from "@/components/admin/users-manager"
import BookingsManager from "@/components/admin/bookings-manager"
import { getBookings, getRoutes, getVehicles, getUsers } from "@/lib/appwrite/admin"
import { useToast } from "@/components/ui/use-toast"
import DestinationsManager from "@/components/admin/destinations-manager"
import PaymentsManager from "@/components/admin/payments-manager"
import ReportsManager from "@/components/admin/reports-manager"
import SettingsManager from "@/components/admin/settings-manager"

export default function WpAdminDashboard() {
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")

  const [dashboardData, setDashboardData] = useState<{
    totalBookings: number
    activeRoutes: number
    fleetSize: number
    totalUsers: number
    recentBookings: any[]
  }>({
    totalBookings: 0,
    activeRoutes: 0,
    fleetSize: 0,
    totalUsers: 0,
    recentBookings: [],
  })
  const [isLoadingData, setIsLoadingData] = useState(true)
  const { toast } = useToast()

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/wp-admin/login")
    }
  }, [user, isLoading, router])

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user || user.role !== "admin") return

      try {
        setIsLoadingData(true)
        const [bookings, routes, vehicles, users] = await Promise.all([
          getBookings(),
          getRoutes(),
          getVehicles(),
          getUsers(),
        ])

        // Get recent bookings (last 5)
        const recentBookings = bookings.slice(0, 5)

        setDashboardData({
          totalBookings: bookings.length,
          // Correction ici: utiliser le champ booléen 'active' au lieu de 'status'
          activeRoutes: routes.filter((route) => route.active === true).length,
          // Compter uniquement les véhicules actifs
          fleetSize: vehicles.filter((vehicle) => vehicle.active === true).length,
          totalUsers: users.length,
          recentBookings,
        })
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    loadDashboardData()
  }, [user, toast])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/wp-admin/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f1f1]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0073aa] rounded-full mb-4">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.158,12.786L9.46,20.625c0.806,0.237,1.657,0.366,2.54,0.366c1.047,0,2.051-0.181,2.986-0.51 c-0.024-0.038-0.046-0.079-0.065-0.123L12.158,12.786z M3.009,12c0,3.559,2.068,6.634,5.067,8.092L3.788,8.341 C3.289,9.459,3.009,10.696,3.009,12z M18.069,11.546c0-1.112-0.399-1.881-0.741-2.48c-0.456-0.741-0.883-1.368-0.883-2.109 c0-0.826,0.627-1.596,1.51-1.596c0.04,0,0.078,0.005,0.116,0.007C16.472,3.904,14.34,3.009,12,3.009 c-3.141,0-5.904,1.612-7.512,4.052c0.211,0.007,0.41,0.011,0.579,0.011c0.94,0,2.396-0.114,2.396-0.114 C7.947,6.93,8.004,7.642,7.52,7.699c0,0-0.487,0.057-1.029,0.085l3.274,9.739l1.968-5.901l-1.401-3.838 C9.848,7.756,9.389,7.699,9.389,7.699C8.904,7.642,8.961,6.93,9.446,6.958c0,0,1.484,0.114,2.368,0.114 c0.94,0,2.397-0.114,2.397-0.114c0.485-0.028,0.542,0.684,0.057,0.741c0,0-0.488,0.057-1.029,0.085l3.249,9.665l0.897-2.996 C17.676,13.284,18.069,12.316,18.069,11.546z M12,21.991c-5.522,0-10-4.477-10-10s4.478-10,10-10s10,4.477,10,10 S17.522,21.991,12,21.991z" />
            </svg>
          </div>
          <p className="text-[#666]">Loading WordPress Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      {/* WordPress Admin Bar */}
      <div className="bg-[#23282d] text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-[#0073aa] rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.158,12.786L9.46,20.625c0.806,0.237,1.657,0.366,2.54,0.366c1.047,0,2.051-0.181,2.986-0.51 c-0.024-0.038-0.046-0.079-0.065-0.123L12.158,12.786z" />
              </svg>
            </div>
            <span className="font-medium">Mali Transport</span>
          </div>
          <span className="text-[#a0a5aa]">|</span>
          <a href="/" className="text-[#a0a5aa] hover:text-white text-sm">
            Visit Site
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-[#a0a5aa]">Howdy, {user.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-[#a0a5aa] hover:text-white hover:bg-[#32373c]"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Log Out
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Dashboard Overview */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#23282d]">Dashboard</h1>
                <div className="text-sm text-[#666]">Welcome to Mali Transport Admin Panel</div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-[#0073aa]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#666]">Total Bookings</p>
                        <p className="text-2xl font-bold text-[#23282d]">
                          {isLoadingData ? "..." : dashboardData.totalBookings.toLocaleString()}
                        </p>
                      </div>
                      <Calendar className="h-8 w-8 text-[#0073aa]" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#00a32a]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#666]">Active Routes</p>
                        <p className="text-2xl font-bold text-[#23282d]">
                          {isLoadingData ? "..." : dashboardData.activeRoutes}
                        </p>
                      </div>
                      <Route className="h-8 w-8 text-[#00a32a]" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#ff6900]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#666]">Fleet Size</p>
                        <p className="text-2xl font-bold text-[#23282d]">
                          {isLoadingData ? "..." : dashboardData.fleetSize}
                        </p>
                      </div>
                      <Bus className="h-8 w-8 text-[#ff6900]" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#826eb4]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#666]">Total Users</p>
                        <p className="text-2xl font-bold text-[#23282d]">
                          {isLoadingData ? "..." : dashboardData.totalUsers.toLocaleString()}
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-[#826eb4]" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#23282d]">Recent Bookings</CardTitle>
                    <CardDescription>Latest customer bookings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingData ? (
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((item) => (
                          <div
                            key={item}
                            className="flex items-center justify-between py-2 border-b border-[#e1e1e1] last:border-b-0"
                          >
                            <div className="animate-pulse">
                              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-32"></div>
                            </div>
                            <div className="animate-pulse">
                              <div className="h-6 bg-gray-200 rounded w-16"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : dashboardData.recentBookings.length > 0 ? (
                      <div className="space-y-3">
                        {dashboardData.recentBookings.map((booking: any) => (
                          <div
                            key={booking.$id}
                            className="flex items-center justify-between py-2 border-b border-[#e1e1e1] last:border-b-0"
                          >
                            <div>
                              <p className="font-medium text-[#23282d]">
                                Booking #{booking.bookingNumber || booking.$id.slice(-6)}
                              </p>
                              <p className="text-sm text-[#666]">
                                {booking.origin} → {booking.destination}
                              </p>
                              <p className="text-xs text-[#999]">{new Date(booking.$createdAt).toLocaleDateString()}</p>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                booking.status === "confirmed"
                                  ? "text-[#00a32a] border-[#00a32a]"
                                  : booking.status === "pending"
                                    ? "text-[#ff6900] border-[#ff6900]"
                                    : booking.status === "cancelled"
                                      ? "text-[#dc3545] border-[#dc3545]"
                                      : "text-[#0073aa] border-[#0073aa]"
                              }
                            >
                              {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || "Pending"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-[#666]">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No recent bookings found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Destinations Management */}
          {activeTab === "destinations" && <DestinationsManager />}

          {/* Trips Management */}
          {activeTab === "trips" && <TripsManager />}

          {/* Routes Management */}
          {activeTab === "routes" && <RoutesManager />}

          {/* Vehicles Management */}
          {activeTab === "vehicles" && <VehiclesManager />}

          {/* Users Management */}
          {activeTab === "users" && <UsersManager />}

          {/* Bookings Management */}
          {activeTab === "bookings" && <BookingsManager />}

          {/* Payments Management */}
          {activeTab === "payments" && <PaymentsManager />}

          {/* Reports Management */}
          {activeTab === "reports" && <ReportsManager />}

          {/* Settings Management */}
          {activeTab === "settings" && <SettingsManager />}
        </div>
      </div>
    </div>
  )
}
