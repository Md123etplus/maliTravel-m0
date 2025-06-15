"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Client, Account } from "appwrite"
// import { useToast } from "@/components/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/account"
  const registrationSuccess = searchParams.get("registration_success")
  // const { toast } = useToast()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(registrationSuccess ? "Registration successful! Please login." : "")

  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")

  const account = new Account(client)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await account.getSession("current")
        if (session) {
          router.push(redirect)
        }
      } catch (error) {
        // No active session, continue with login page
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [router, redirect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Use createEmailPasswordSession as in your working example
      await account.createEmailPasswordSession(email, password)
      const user = await account.get()

      // Store user data in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.$id,
          email: user.email,
          name: user.name,
          isLoggedIn: true,
        })
      )

      // Set cookies as in your working example
      document.cookie = `session=${user.$id}; path=/; max-age=86400; secure; samesite=strict`
      document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400; secure; samesite=strict`

      // toast({
      //   title: "Login successful",
      //   description: "Welcome back!",
      // })

      setSuccess("Login successful! Redirecting...")
      setTimeout(() => router.push(redirect), 1000)

    } catch (err: any) {
      console.error("Login error:", err)
      
      if (err.type === 'user_invalid_credentials') {
        setError("Invalid email or password")
      } else if (err.code === 401) {
        setError("Authentication failed. Please check your credentials.")
      } else {
        setError(err.message || "Login failed. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50 text-green-800">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Don't have an account?</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link href={`/register?redirect=${encodeURIComponent(redirect)}`} className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}