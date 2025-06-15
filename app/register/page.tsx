"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { UserPlus, Mail, Lock, User, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Client, Account, Databases, ID } from "appwrite"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams?.get("redirect") || "/account"

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")

  const account = new Account(client)
  const databases = new Databases(client)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const generateValidUserId = (email: string): string => {
    // Generate ID from email prefix + timestamp
    const prefix = email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_") // Replace special chars
      .replace(/^[^a-z]/, "u") // Ensure starts with letter
      .slice(0, 20) // Limit length

    const timestamp = Date.now().toString(36).slice(-6)
    const userId = `${prefix}_${timestamp}`.slice(0, 36)

    // Final validation
    return userId
      .replace(/[^a-z0-9_]/g, "_")
      .replace(/^_/, "u")
      .replace(/_$/, "0")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    if (!acceptTerms) {
      setError("You must accept the terms and conditions")
      return
    }

    setIsLoading(true)

    try {
      // 1. Create user account in Auth
      const response = await account.create(ID.unique(), formData.email, formData.password, formData.fullName)

      console.log("User created successfully:", response)

      // 2. Create user document in database
      try {
        await databases.createDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6849f32c0004d098ab7e",
          process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS || "6849f34c0038fcad73c9",
          response.$id, // Use the same ID as the Auth user
          {
            $id: generateValidUserId(response.email),
            name: formData.fullName,
            email: formData.email,
            phone: "",
            role: "client",
            created_at: new Date().toISOString(),
            profile_image: "",
            
          },
        )
        console.log("User profile created in database")
      } catch (dbError) {
        console.error("Error creating user profile:", dbError)
        // Continue even if database creation fails
      }

      // 3. Create session and redirect
      await account.createSession(formData.email, formData.password)

      // 4. Store user data
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.$id,
          email: response.email,
          name: response.name,
          isLoggedIn: true,
        }),
      )

      // 5. Redirect to account page
      router.push(redirectUrl)
    } catch (err: any) {
      console.error("Registration error:", err)

      if (err.type === "user_already_exists") {
        setError("An account with this email already exists")
      } else if (err.message.includes("credentials")) {
        setError("Invalid email or password format")
      } else {
        setError("Registration failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>Sign up to access all features</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Your full name"
                    className="pl-10"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(checked) => setAcceptTerms(!!checked)} />
                <Label htmlFor="terms" className="text-sm">
                  I accept the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    terms and conditions
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4 animate-spin" />
                    Signing up...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Already have an account?</span>
                </div>
              </div>

              <div className="mt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}>Sign In</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
