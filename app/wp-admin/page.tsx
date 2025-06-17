"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function WpAdminRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/wp-admin/login")
  }, [router])

  return null
}
