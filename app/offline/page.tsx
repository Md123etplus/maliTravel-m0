"use client"

import { Button } from "@/components/ui/button"
import { WifiOff, Home, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <WifiOff className="mb-6 h-16 w-16 text-amber-500" />
      <h1 className="mb-4 text-3xl font-bold">Vous êtes hors ligne</h1>
      <p className="mb-8 max-w-md text-slate-600">
        Il semble que vous n'ayez pas de connexion Internet. Certaines fonctionnalités peuvent ne pas être disponibles.
      </p>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <Button asChild className="bg-amber-500 hover:bg-amber-600">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Link>
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="border-amber-500 text-amber-500 hover:bg-amber-50"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
      </div>
    </div>
  )
}
