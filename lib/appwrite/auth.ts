import { account, databases, DATABASE_ID, COLLECTION_USERS, ID } from "./config"
import type { User } from "./types"

export interface SignUpData {
  email: string
  password: string
  name: string
  phone?: string
}

export interface SignInData {
  email: string
  password: string
}

// Créer un compte utilisateur
export async function signUp({ email, password, name, phone }: SignUpData) {
  try {
    // Créer le compte dans Appwrite Auth
    const newAccount = await account.create(ID.unique(), email, password, name)

    if (newAccount) {
      // Créer le profil utilisateur dans la base de données
      await databases.createDocument(DATABASE_ID, COLLECTION_USERS, newAccount.$id, {
        name,
        email,
        phone: phone || "",
        role: "client",
        created_at: new Date().toISOString(),
      })

      // Connecter automatiquement l'utilisateur
      await signIn({ email, password })
      return newAccount
    }
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    throw error
  }
}

// Connexion utilisateur
export async function signIn({ email, password }: SignInData) {
  try {
    return await account.createSession(email, password)
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)
    throw error
  }
}

// Déconnexion
export async function signOut() {
  try {
    return await account.deleteSession("current")
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error)
    throw error
  }
}

// Récupérer l'utilisateur actuel
export async function getCurrentUser() {
  try {
    return await account.get()
  } catch (error) {
    return null
  }
}

// Récupérer le profil utilisateur complet
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const profile = await databases.getDocument(DATABASE_ID, COLLECTION_USERS, userId)
    return profile as unknown as User
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error)
    return null
  }
}

// Mettre à jour le profil utilisateur
export async function updateUserProfile(userId: string, data: Partial<User>) {
  try {
    return await databases.updateDocument(DATABASE_ID, COLLECTION_USERS, userId, data)
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error)
    throw error
  }
}

// Récupération de mot de passe
export async function sendPasswordRecovery(email: string) {
  try {
    return await account.createRecovery(email, `${window.location.origin}/reset-password`)
  } catch (error) {
    console.error("Erreur lors de l'envoi de récupération:", error)
    throw error
  }
}

// Réinitialisation de mot de passe
export async function resetPassword(userId: string, secret: string, password: string) {
  try {
    return await account.updateRecovery(userId, secret, password)
  } catch (error) {
    console.error("Erreur lors de la réinitialisation:", error)
    throw error
  }
}
