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

  // Fonction pour récupérer le profil complet de l'utilisateur
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
      console.error("Erreur lors de la récupération du profil:", error)
      return {
        $id: currentUser.$id,
        email: currentUser.email,
        name: currentUser.name,
        emailVerification: currentUser.emailVerification,
        profile: undefined,
        loyaltyPoints: 100,
        created_at: currentUser.created_at || new Date().toISOString(),
        phone: "",
        role: "client" as "client",
        profile_image: "",
      }
    }
  }

  // Fonction de connexion avec Appwrite
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      await signIn({ email, password })

      // Récupérer les informations de l'utilisateur après connexion
      const currentUser = await getCurrentUser()

      if (currentUser) {
        const userWithProfile = await fetchUserProfile(currentUser)
        setUser(userWithProfile)
        return true
      }

      return false
    } catch (error) {
      console.error("Erreur de connexion:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction de déconnexion avec Appwrite
  const logout = async () => {
    try {
      await signOut()
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Erreur de déconnexion:", error)
      // Même en cas d'erreur, on déconnecte localement
      setUser(null)
      router.push("/")
    }
  }

  // Fonction pour rafraîchir le profil utilisateur
  const refreshProfile = async () => {
    if (user) {
      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          const userWithProfile = await fetchUserProfile(currentUser)
          setUser(userWithProfile)
        }
      } catch (error) {
        console.error("Erreur lors du rafraîchissement du profil:", error)
      }
    }
  }

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser()

        if (currentUser) {
          const userWithProfile = await fetchUserProfile(currentUser)
          setUser(userWithProfile)
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'utilisateur:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [])

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  // et qu'il essaie d'accéder à une page protégée
  useEffect(() => {
    if (!isLoading && !user && isProtectedRoute(pathname)) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [user, isLoading, pathname, router])

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isAuthenticated, refreshProfile }}>
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

// Fonction pour vérifier si une route est protégée
function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = ["/account", "/booking", "/admin"]
  return protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}
