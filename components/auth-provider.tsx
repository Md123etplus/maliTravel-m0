"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id: string
  email: string
  name: string
  role: "user" | "admin" | "vip"
} | null

type AuthContextType = {
  user: User
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

// Créer un contexte avec des valeurs par défaut sécurisées
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Fonction de connexion
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simuler une vérification d'identifiants
    // Dans une application réelle, cela ferait un appel API

    // Identifiants de test
    const testUsers = [
      { id: "1", email: "test@example.com", password: "password123", name: "Utilisateur Test", role: "user" as const },
      { id: "2", email: "admin@example.com", password: "admin123", name: "Administrateur", role: "admin" as const },
      { id: "3", email: "vip@example.com", password: "vip123", name: "Client VIP", role: "vip" as const },
    ]

    // Vérifier les identifiants
    const foundUser = testUsers.find((user) => user.email === email && user.password === password)

    if (foundUser) {
      // Créer un objet utilisateur sans le mot de passe
      const { password, ...userWithoutPassword } = foundUser

      // Stocker l'utilisateur dans le localStorage
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))

      // Mettre à jour l'état
      setUser(userWithoutPassword)
      return true
    }

    return false
  }

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  // et qu'il essaie d'accéder à une page protégée
  useEffect(() => {
    if (!isLoading && !user && isProtectedRoute(pathname)) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [user, isLoading, pathname, router])

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

// Fonction pour vérifier si une route est protégée
function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = ["/account", "/account/settings", "/booking", "/admin"]
  return protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}
