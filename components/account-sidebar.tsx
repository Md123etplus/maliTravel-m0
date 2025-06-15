"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Calendar, Star, Settings, LogOut, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"

interface AccountSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function AccountSidebar({ activeTab, setActiveTab }: AccountSidebarProps) {
  const router = useRouter()
  const { user, logout } = useAuth()
  // If loading is needed, define it here or get it from another source
  const loading = !user; // Example: treat as loading if user is not yet loaded

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      // Fallback: redirect anyway
      router.push("/")
    }
  }

  // Generate initials from user name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex flex-col items-center mb-6">
          <div className="h-20 w-20 mb-4 rounded-full bg-slate-200 animate-pulse" />
          <div className="h-4 w-24 bg-slate-200 animate-pulse rounded mb-2" />
          <div className="h-3 w-32 bg-slate-200 animate-pulse rounded" />
        </div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-200 animate-pulse rounded" />
          ))}
        </div>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="p-4">
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-slate-500 mb-4">Utilisateur non connecté</p>
          <Button onClick={() => router.push("/login")}>Se connecter</Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col items-center mb-6">
        <Avatar className="h-20 w-20 mb-4">
          <AvatarImage src={user.profile_image || "/placeholder.svg?height=100&width=100"} alt={user.name || "User"} />
          <AvatarFallback className="text-lg font-semibold">{user.name ? getInitials(user.name) : "U"}</AvatarFallback>
        </Avatar>
        <h2 className="text-lg font-semibold text-center">{user.name || "Utilisateur"}</h2>
        <p className="text-sm text-slate-500 text-center break-all">{user.email}</p>
      </div>

      <nav className="space-y-1">
        <Button
          variant={activeTab === "dashboard" ? "default" : "ghost"}
          className={`w-full justify-start ${activeTab === "dashboard" ? "bg-amber-500 hover:bg-amber-600" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <User className="mr-2 h-4 w-4" />
          Tableau de bord
        </Button>
        <Button
          variant={activeTab === "bookings" ? "default" : "ghost"}
          className={`w-full justify-start ${activeTab === "bookings" ? "bg-amber-500 hover:bg-amber-600" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Mes réservations
        </Button>
        <Button
          variant={activeTab === "loyalty" ? "default" : "ghost"}
          className={`w-full justify-start ${activeTab === "loyalty" ? "bg-amber-500 hover:bg-amber-600" : ""}`}
          onClick={() => setActiveTab("loyalty")}
        >
          <Star className="mr-2 h-4 w-4" />
          Programme fidélité
        </Button>
        <Button
          variant={activeTab === "profile" ? "default" : "ghost"}
          className={`w-full justify-start ${activeTab === "profile" ? "bg-amber-500 hover:bg-amber-600" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Paramètres du profil
        </Button>
      </nav>

      <div className="mt-6 pt-6 border-t">
        <Button variant="outline" className="w-full justify-start" onClick={handleLogout} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
          Déconnexion
        </Button>
      </div>
    </Card>
  )
}
