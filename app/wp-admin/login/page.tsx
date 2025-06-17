"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function WpAdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const { login, user, isLoading } = useAuth()

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && user.role === "admin" && !isLoading) {
      router.push("/wp-admin/dashboard")
    } else if (user && user.role !== "admin" && !isLoading) {
      setError("Access denied. Administrator privileges required.")
    }
  }, [user, isLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const success = await login(email, password)

      if (success) {
        // Check if user is admin after login
        setTimeout(() => {
          if (user?.role === "admin") {
            router.push("/wp-admin/dashboard")
          } else {
            setError("Access denied. Administrator privileges required.")
          }
        }, 500)
      } else {
        setError("Invalid username or password.")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError("Invalid username or password.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f1f1]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0073aa]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center">
      <div className="w-full max-w-sm">
        {/* WordPress Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#0073aa] rounded-full mb-4">
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.158,12.786L9.46,20.625c0.806,0.237,1.657,0.366,2.54,0.366c1.047,0,2.051-0.181,2.986-0.51 c-0.024-0.038-0.046-0.079-0.065-0.123L12.158,12.786z M3.009,12c0,3.559,2.068,6.634,5.067,8.092L3.788,8.341 C3.289,9.459,3.009,10.696,3.009,12z M18.069,11.546c0-1.112-0.399-1.881-0.741-2.48c-0.456-0.741-0.883-1.368-0.883-2.109 c0-0.826,0.627-1.596,1.51-1.596c0.04,0,0.078,0.005,0.116,0.007C16.472,3.904,14.34,3.009,12,3.009 c-3.141,0-5.904,1.612-7.512,4.052c0.211,0.007,0.41,0.011,0.579,0.011c0.94,0,2.396-0.114,2.396-0.114 C7.947,6.93,8.004,7.642,7.52,7.699c0,0-0.487,0.057-1.029,0.085l3.274,9.739l1.968-5.901l-1.401-3.838 C9.848,7.756,9.389,7.699,9.389,7.699C8.904,7.642,8.961,6.93,9.446,6.958c0,0,1.484,0.114,2.368,0.114 c0.94,0,2.397-0.114,2.397-0.114c0.485-0.028,0.542,0.684,0.057,0.741c0,0-0.488,0.057-1.029,0.085l3.249,9.665l0.897-2.996 C17.676,13.284,18.069,12.316,18.069,11.546z M12,21.991c-5.522,0-10-4.477-10-10s4.478-10,10-10s10,4.477,10,10 S17.522,21.991,12,21.991z" />
            </svg>
          </div>
          <h1 className="text-2xl font-normal text-[#444] mb-2">Mali Transport</h1>
          <p className="text-sm text-[#666]">Powered by WordPress</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-[#ddd]">
          {error && (
            <Alert variant="destructive" className="mb-4 border-[#dc3232] bg-[#dc3232]/10">
              <AlertDescription className="text-[#dc3232]">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-[#444] font-medium">
                Username or Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 border-[#ddd] focus:border-[#0073aa] focus:ring-[#0073aa] rounded-sm"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-[#444] font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 border-[#ddd] focus:border-[#0073aa] focus:ring-[#0073aa] rounded-sm"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-[#0073aa] focus:ring-[#0073aa] border-[#ddd] rounded"
                disabled={isSubmitting}
              />
              <Label htmlFor="remember" className="ml-2 text-sm text-[#444]">
                Remember Me
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0073aa] hover:bg-[#005a87] text-white font-medium py-2 px-4 rounded-sm shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging In...
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <a href="/wp-admin/forgot-password" className="text-[#0073aa] hover:text-[#005a87] text-sm">
              Lost your password?
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-[#666]">
            ←{" "}
            <a href="/" className="text-[#0073aa] hover:text-[#005a87]">
              Go to Mali Transport
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
