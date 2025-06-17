"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getCurrentUser, signIn, signOut, getUserProfile } from "@/lib/appwrite/auth"
import { calculateLoyaltyPoints } from "@/lib/appwrite/bookings"
import type { User } from "@/lib/appwrite/types"

type AuthUser = {
  created_at: any
  $id: string
  email: string
  name: string
  emailVerification: boolean
  profile?: User
  loyaltyPoints?: number
  phone?: string
  role?: "client" | "admin"
  profile_image?: string
} | null

type AuthContextType = {
  user: AuthUser
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isLoading: boolean
  isAuthenticated: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: async () => {},
  isLoading: true,
  isAuthenticated: false,
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const fetchUserProfile = async (currentUser: any) => {
    try {
      const profile = await getUserProfile(currentUser.$id)
      const loyaltyPoints = await calculateLoyaltyPoints(currentUser.$id)

      return {
        $id: currentUser.$id,
        email: currentUser.email,
        name: currentUser.name,
        emailVerification: currentUser.emailVerification,
        profile: profile ?? undefined,
        loyaltyPoints,
        created_at: currentUser.created_at || new Date().toISOString(),
        phone: profile?.phone || "",
        role: profile?.role || "client",
        profile_image: profile?.profile_image || "",
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
      return {
        $id: currentUser.$id,
        email: currentUser.email,
        name: currentUser.name,
        emailVerification: currentUser.emailVerification,
        profile: undefined,
        loyaltyPoints: 100,
        created_at: currentUser.created_at || new Date().toISOString(),
        phone: "",
        role: "client" as const,
        profile_image: "",
      }
    }
  }

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        const userWithProfile = await fetchUserProfile(currentUser)
        setUser(userWithProfile)
        return userWithProfile
      } else {
        setUser(null)
        localStorage.removeItem("user")
        return null
      }
    } catch (error) {
      console.error("Error loading user:", error)
      setUser(null)
      localStorage.removeItem("user")
      return null
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      await signIn({ email, password })
      const userData = await loadUser()
      return !!userData
    } catch (error) {
      console.error("Login error:", error)
      setUser(null)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await signOut()
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      setUser(null)
      localStorage.removeItem("user")
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          const userWithProfile = await fetchUserProfile(currentUser)
          setUser(userWithProfile)
        }
      } catch (error) {
        console.error("Error refreshing profile:", error)
      }
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await loadUser()
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      if (!user && isProtectedRoute(pathname)) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
      }
    }
  }, [user, isLoading, pathname, router])

  const isAuthenticated = !!user && !isLoading

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        isAuthenticated,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = ["/account", "/booking", "/admin"]
  return protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}