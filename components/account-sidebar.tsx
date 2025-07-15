"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, CreditCard, MapPin, Settings, Star, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface AccountSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function AccountSidebar({ activeTab, setActiveTab }: AccountSidebarProps) {
  const { logout } = useAuth()

  const menuItems = [
    { id: "profile", label: "Profil", icon: User },
    { id: "bookings", label: "Mes réservations", icon: MapPin },
    { id: "reviews", label: "Mes avis", icon: Star },
    { id: "payments", label: "Paiements", icon: CreditCard },
    { id: "settings", label: "Paramètres", icon: Settings },
  ]

  return (
    <Card>
      <CardContent className="p-0">
        <div className="space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </div>
        <Separator />
        <div className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
