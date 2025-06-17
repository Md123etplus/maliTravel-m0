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

export async function signUp({ email, password, name, phone }: SignUpData) {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name)

    if (newAccount) {
      await databases.createDocument(DATABASE_ID, COLLECTION_USERS, newAccount.$id, {
        name,
        email,
        phone: phone || "",
        role: "client",
        created_at: new Date().toISOString(),
      })

      await signIn({ email, password })
      return newAccount
    }
  } catch (error) {
    console.error("Signup error:", error)
    throw error
  }
}

export async function signIn({ email, password }: SignInData) {
  try {
    const session = await account.createEmailPasswordSession(email, password)
    const user = await account.get()

    localStorage.setItem(
      "user",
      JSON.stringify({
        id: user.$id,
        email: user.email,
        name: user.name,
        isLoggedIn: true,
      }),
    )

    document.cookie = `session=${user.$id}; path=/; max-age=86400; secure; samesite=strict`
    document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400; secure; samesite=strict`

    return session
  } catch (error) {
    localStorage.removeItem("user")
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    throw error
  }
}

export async function signOut() {
  try {
    localStorage.removeItem("user")
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    return await account.deleteSession("current")
  } catch (error) {
    console.error("Logout error:", error)
    throw error
  }
}

export async function getCurrentUser() {
  try {
    return await account.get()
  } catch (error) {
    return null
  }
}

export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const profile = await databases.getDocument(DATABASE_ID, COLLECTION_USERS, userId)
    return profile as unknown as User
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}

export async function updateUserProfile(userId: string, data: Partial<User>) {
  try {
    return await databases.updateDocument(DATABASE_ID, COLLECTION_USERS, userId, data)
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error
  }
}

export async function sendPasswordRecovery(email: string) {
  try {
    return await account.createRecovery(email, `${window.location.origin}/reset-password`)
  } catch (error) {
    console.error("Error sending recovery:", error)
    throw error
  }
}

export async function resetPassword(userId: string, secret: string, password: string) {
  try {
    return await account.updateRecovery(userId, secret, password)
  } catch (error) {
    console.error("Error resetting password:", error)
    throw error
  }
}