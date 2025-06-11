"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Calendar, Star, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface AccountSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function AccountSidebar({ activeTab, setActiveTab }: AccountSidebarProps) {
  const router = useRouter()

  const handleLogout = () => {
    // Simuler la déconnexion
    setTimeout(() => {
      router.push("/")
    }, 500)
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col items-center mb-6">
        <Avatar className="h-20 w-20 mb-4">
          <AvatarImage src="/placeholder.svg?height=100&width=100" alt="Amadou Diallo" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        <h2 className="text-lg font-semibold">Amadou Diallo</h2>
        <p className="text-sm text-slate-500">amadou.diallo@example.com</p>
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
        <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </Card>
  )
}
