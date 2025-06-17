"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Eye, RefreshCw, Download } from "lucide-react"
import { getPayments, updatePayment } from "@/lib/appwrite/admin"
import { useToast } from "@/components/ui/use-toast"

export default function PaymentsManager() {
  const [payments, setPayments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterMethod, setFilterMethod] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    try {
      setIsLoading(true)
      const data = await getPayments()
      setPayments(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load payments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (paymentId: string, newStatus: string) => {
    try {
      await updatePayment(paymentId, { status: newStatus })
      setPayments(payments.map((payment) => (payment.$id === paymentId ? { ...payment, status: newStatus } : payment)))
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
      failed: { color: "bg-red-100 text-red-800", label: "Failed" },
      refunded: { color: "bg-gray-100 text-gray-800", label: "Refunded" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getMethodBadge = (method: string) => {
    const methodConfig = {
      "Orange Money": { color: "bg-orange-100 text-orange-800", label: "Orange Money" },
      Wave: { color: "bg-blue-100 text-blue-800", label: "Wave" },
      "carte bancaire": { color: "bg-purple-100 text-purple-800", label: "Card" },
    }
    const config = methodConfig[method as keyof typeof methodConfig] || {
      color: "bg-gray-100 text-gray-800",
      label: method,
    }
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.booking_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.$id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus
    const matchesMethod = filterMethod === "all" || payment.payment_method === filterMethod

    let matchesDate = true
    if (dateRange !== "all") {
      const paymentDate = new Date(payment.payment_date)
      const today = new Date()
      switch (dateRange) {
        case "today":
          matchesDate = paymentDate.toDateString() === today.toDateString()
          break
        case "week":
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = paymentDate >= weekAgo
          break
        case "month":
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = paymentDate >= monthAgo
          break
      }
    }

    return matchesSearch && matchesStatus && matchesMethod && matchesDate
  })

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0)
  const completedAmount = filteredPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, payment) => sum + (payment.amount || 0), 0)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#23282d]">Payments Management</h1>
        </div>
        <div className="text-center py-8">Loading payments...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#23282d]">Payments Management</h1>
        <div className="flex gap-2">
          <Button onClick={loadPayments} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666]">Total Payments</p>
                <p className="text-2xl font-bold text-[#23282d]">{filteredPayments.length}</p>
              </div>
              <CreditCard className="h-8 w-8 text-[#0073aa]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666]">Total Amount</p>
                <p className="text-2xl font-bold text-[#23282d]">{totalAmount.toLocaleString()} FCFA</p>
              </div>
              <CreditCard className="h-8 w-8 text-[#00a32a]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666]">Completed</p>
                <p className="text-2xl font-bold text-[#23282d]">{completedAmount.toLocaleString()} FCFA</p>
              </div>
              <CreditCard className="h-8 w-8 text-[#00a32a]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666]">Success Rate</p>
                <p className="text-2xl font-bold text-[#23282d]">
                  {filteredPayments.length > 0
                    ? Math.round(
                        (filteredPayments.filter((p) => p.status === "completed").length / filteredPayments.length) *
                          100,
                      )
                    : 0}
                  %
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-[#826eb4]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by transaction ID, booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-40">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-40">
              <Select value={filterMethod} onValueChange={setFilterMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="Orange Money">Orange Money</SelectItem>
                  <SelectItem value="Wave">Wave</SelectItem>
                  <SelectItem value="carte bancaire">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-32">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions ({filteredPayments.length})</CardTitle>
          <CardDescription>Manage payment transactions and statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment.$id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-lg">#{payment.transaction_id || payment.$id.slice(-8)}</span>
                      {getStatusBadge(payment.status || "pending")}
                      {getMethodBadge(payment.payment_method || "Unknown")}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="space-y-1">
                        <div className="text-sm text-[#666]">Amount</div>
                        <div className="font-medium text-lg">{(payment.amount || 0).toLocaleString()} FCFA</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-[#666]">Booking ID</div>
                        <div className="font-medium">#{payment.booking_id?.slice(-8) || "N/A"}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-[#666]">Payment Date</div>
                        <div className="font-medium">
                          {payment.payment_date
                            ? new Date(payment.payment_date).toLocaleDateString() +
                              " " +
                              new Date(payment.payment_date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-[#666] mb-3">
                      <div>
                        <span className="font-medium">Created:</span>{" "}
                        {new Date(payment.$createdAt).toLocaleDateString()}
                      </div>
                      {payment.$updatedAt !== payment.$createdAt && (
                        <div>
                          <span className="font-medium">Updated:</span>{" "}
                          {new Date(payment.$updatedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <Select
                        value={payment.status || "pending"}
                        onValueChange={(value) => handleStatusChange(payment.$id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredPayments.length === 0 && (
              <div className="text-center py-8 text-[#666]">
                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No payments found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
