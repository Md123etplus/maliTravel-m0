"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Fonction pour vérifier si l'écran est mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Vérifier au chargement
    checkMobile()

    // Ajouter un écouteur d'événement pour le redimensionnement
    window.addEventListener("resize", checkMobile)

    // Nettoyer l'écouteur d'événement
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

// Ajouter un alias pour compatibilité
export const useIsMobile = useMobile
