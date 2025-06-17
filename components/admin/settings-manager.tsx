"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Save, Shield, Bell, Globe } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsManager() {
  const [settings, setSettings] = useState({
    // General Settings
    companyName: "Mali Transport",
    companyEmail: "contact@malitransport.ml",
    companyPhone: "+223 20 XX XX XX",
    companyAddress: "Bamako, Mali",

    // Booking Settings
    maxAdvanceBookingDays: 30,
    cancellationDeadlineHours: 24,
    autoConfirmBookings: false,
    requireIdVerification: true,

    // Payment Settings
    enableOrangeMoney: true,
    enableWave: true,
    enableCreditCard: false,
    paymentTimeoutMinutes: 15,

    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    adminAlerts: true,

    // System Settings
    defaultLanguage: "fr",
    timezone: "Africa/Bamako",
    dateFormat: "DD/MM/YYYY",
    currency: "FCFA",

    // Security Settings
    requireStrongPasswords: true,
    sessionTimeoutMinutes: 60,
    enableTwoFactor: false,
    maxLoginAttempts: 5,

    // Maintenance
    maintenanceMode: false,
    maintenanceMessage: "Le système est en maintenance. Veuillez réessayer plus tard.",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [activeSection, setActiveSection] = useState("general")
  const { toast } = useToast()

  const handleSave = async (section?: string) => {
    try {
      setIsLoading(true)

      // Here you would typically save to your database
      // For now, we'll just simulate the save
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: `${section ? section.charAt(0).toUpperCase() + section.slice(1) : "Settings"} saved successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const sections = [
    { id: "general", label: "General", icon: Settings },
    { id: "booking", label: "Booking", icon: Settings },
    { id: "payment", label: "Payment", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "system", label: "System", icon: Globe },
    { id: "security", label: "Security", icon: Shield },
    { id: "maintenance", label: "Maintenance", icon: Settings },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#23282d]">System Settings</h1>
        <Button onClick={() => handleSave()} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save All"}
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Settings Navigation */}
        <Card className="w-64">
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <Button
                    key={section.id}
                    variant="ghost"
                    className={`w-full justify-start ${
                      activeSection === section.id ? "bg-[#0073aa] text-white hover:bg-[#005a87]" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {section.label}
                  </Button>
                )
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          {/* General Settings */}
          {activeSection === "general" && (
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic company information and configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={settings.companyName}
                      onChange={(e) => updateSetting("companyName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Company Email</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={settings.companyEmail}
                      onChange={(e) => updateSetting("companyEmail", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Company Phone</Label>
                    <Input
                      id="companyPhone"
                      value={settings.companyPhone}
                      onChange={(e) => updateSetting("companyPhone", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Company Address</Label>
                  <Textarea
                    id="companyAddress"
                    value={settings.companyAddress}
                    onChange={(e) => updateSetting("companyAddress", e.target.value)}
                  />
                </div>
                <Button onClick={() => handleSave("general")} disabled={isLoading}>
                  Save General Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Booking Settings */}
          {activeSection === "booking" && (
            <Card>
              <CardHeader>
                <CardTitle>Booking Settings</CardTitle>
                <CardDescription>Configure booking rules and restrictions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxAdvanceBookingDays">Max Advance Booking (Days)</Label>
                    <Input
                      id="maxAdvanceBookingDays"
                      type="number"
                      value={settings.maxAdvanceBookingDays}
                      onChange={(e) => updateSetting("maxAdvanceBookingDays", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cancellationDeadlineHours">Cancellation Deadline (Hours)</Label>
                    <Input
                      id="cancellationDeadlineHours"
                      type="number"
                      value={settings.cancellationDeadlineHours}
                      onChange={(e) => updateSetting("cancellationDeadlineHours", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-confirm Bookings</Label>
                      <div className="text-sm text-[#666]">Automatically confirm bookings without manual review</div>
                    </div>
                    <Switch
                      checked={settings.autoConfirmBookings}
                      onCheckedChange={(checked) => updateSetting("autoConfirmBookings", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require ID Verification</Label>
                      <div className="text-sm text-[#666]">Require customers to provide ID information</div>
                    </div>
                    <Switch
                      checked={settings.requireIdVerification}
                      onCheckedChange={(checked) => updateSetting("requireIdVerification", checked)}
                    />
                  </div>
                </div>
                <Button onClick={() => handleSave("booking")} disabled={isLoading}>
                  Save Booking Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Payment Settings */}
          {activeSection === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Configure payment methods and options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Orange Money</Label>
                      <div className="text-sm text-[#666]">Enable Orange Money payments</div>
                    </div>
                    <Switch
                      checked={settings.enableOrangeMoney}
                      onCheckedChange={(checked) => updateSetting("enableOrangeMoney", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Wave</Label>
                      <div className="text-sm text-[#666]">Enable Wave payments</div>
                    </div>
                    <Switch
                      checked={settings.enableWave}
                      onCheckedChange={(checked) => updateSetting("enableWave", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Credit Card</Label>
                      <div className="text-sm text-[#666]">Enable credit card payments</div>
                    </div>
                    <Switch
                      checked={settings.enableCreditCard}
                      onCheckedChange={(checked) => updateSetting("enableCreditCard", checked)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentTimeoutMinutes">Payment Timeout (Minutes)</Label>
                  <Input
                    id="paymentTimeoutMinutes"
                    type="number"
                    value={settings.paymentTimeoutMinutes}
                    onChange={(e) => updateSetting("paymentTimeoutMinutes", Number.parseInt(e.target.value))}
                  />
                </div>
                <Button onClick={() => handleSave("payment")} disabled={isLoading}>
                  Save Payment Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeSection === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <div className="text-sm text-[#666]">Send email notifications to customers</div>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <div className="text-sm text-[#666]">Send SMS notifications to customers</div>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => updateSetting("smsNotifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <div className="text-sm text-[#666]">Send push notifications via mobile app</div>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Admin Alerts</Label>
                      <div className="text-sm text-[#666]">Send alerts for important system events</div>
                    </div>
                    <Switch
                      checked={settings.adminAlerts}
                      onCheckedChange={(checked) => updateSetting("adminAlerts", checked)}
                    />
                  </div>
                </div>
                <Button onClick={() => handleSave("notifications")} disabled={isLoading}>
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* System Settings */}
          {activeSection === "system" && (
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system-wide preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultLanguage">Default Language</Label>
                    <Select
                      value={settings.defaultLanguage}
                      onValueChange={(value) => updateSetting("defaultLanguage", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="bm">Bambara</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(value) => updateSetting("timezone", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Bamako">Africa/Bamako (GMT+0)</SelectItem>
                        <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select value={settings.dateFormat} onValueChange={(value) => updateSetting("dateFormat", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={settings.currency} onValueChange={(value) => updateSetting("currency", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FCFA">FCFA</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={() => handleSave("system")} disabled={isLoading}>
                  Save System Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeSection === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security and authentication options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Strong Passwords</Label>
                      <div className="text-sm text-[#666]">Enforce strong password requirements</div>
                    </div>
                    <Switch
                      checked={settings.requireStrongPasswords}
                      onCheckedChange={(checked) => updateSetting("requireStrongPasswords", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Two-Factor Authentication</Label>
                      <div className="text-sm text-[#666]">Require 2FA for admin accounts</div>
                    </div>
                    <Switch
                      checked={settings.enableTwoFactor}
                      onCheckedChange={(checked) => updateSetting("enableTwoFactor", checked)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeoutMinutes">Session Timeout (Minutes)</Label>
                    <Input
                      id="sessionTimeoutMinutes"
                      type="number"
                      value={settings.sessionTimeoutMinutes}
                      onChange={(e) => updateSetting("sessionTimeoutMinutes", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => updateSetting("maxLoginAttempts", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <Button onClick={() => handleSave("security")} disabled={isLoading}>
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Maintenance Settings */}
          {activeSection === "maintenance" && (
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Settings</CardTitle>
                <CardDescription>Configure maintenance mode and system messages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <div className="text-sm text-[#666]">Enable maintenance mode to prevent user access</div>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting("maintenanceMode", checked)}
                  />
                </div>
                {settings.maintenanceMode && (
                  <div className="space-y-2">
                    <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                    <Textarea
                      id="maintenanceMessage"
                      value={settings.maintenanceMessage}
                      onChange={(e) => updateSetting("maintenanceMessage", e.target.value)}
                      placeholder="Message to display during maintenance"
                    />
                  </div>
                )}
                <Button onClick={() => handleSave("maintenance")} disabled={isLoading}>
                  Save Maintenance Settings
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
