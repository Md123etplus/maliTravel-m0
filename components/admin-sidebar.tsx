"use client"

import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Route,
  Bus,
  Users,
  Calendar,
  Settings,
  BarChart3,
  FileText,
  CreditCard,
  MapPin,
} from "lucide-react"

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "destinations", label: "Destinations", icon: MapPin },
    { id: "routes", label: "Routes", icon: Route },
    { id: "trips", label: "Trips", icon: Calendar },
    { id: "vehicles", label: "Vehicles", icon: Bus },
    { id: "bookings", label: "Bookings", icon: FileText },
    { id: "users", label: "Users", icon: Users },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="w-64 bg-[#23282d] min-h-screen">
      <div className="p-4">
        <h2 className="text-white font-medium text-lg mb-4">Mali Transport</h2>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start text-left ${
                  activeTab === item.id
                    ? "bg-[#0073aa] text-white hover:bg-[#005a87]"
                    : "text-[#a0a5aa] hover:text-white hover:bg-[#32373c]"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
