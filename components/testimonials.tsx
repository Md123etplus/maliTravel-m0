import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

// Données simulées pour les témoignages
const testimonials = [
  {
    id: "1",
    name: "Amadou Diallo",
    role: "Voyageur d'affaires",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    comment:
      "Je voyage régulièrement entre Bamako et Ségou pour mes affaires, et Mali Voyages est devenu mon transporteur de confiance. Les bus sont toujours à l'heure, propres et confortables. Le service client est également excellent.",
  },
  {
    id: "2",
    name: "Fatoumata Coulibaly",
    role: "Touriste",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    comment:
      "J'ai utilisé Mali Voyages pour mon circuit touristique à travers le Mali et j'ai été impressionnée par la qualité du service. Les chauffeurs sont professionnels et connaissent bien les routes. Je recommande vivement!",
  },
  {
    id: "3",
    name: "Ibrahim Touré",
    role: "Étudiant",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4,
    comment:
      "En tant qu'étudiant, j'apprécie les tarifs abordables de Mali Voyages et leur programme de fidélité qui me permet d'économiser sur mes trajets réguliers. Les bus sont confortables et équipés de WiFi, ce qui est un plus pour moi.",
  },
]

export function Testimonials() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id}>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center">
              <Avatar className="mr-4 h-12 w-12">
                <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{testimonial.name}</h4>
                <p className="text-sm text-slate-500">{testimonial.role}</p>
              </div>
            </div>
            <div className="mb-3 flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < testimonial.rating ? "fill-amber-500 text-amber-500" : "text-slate-300"}`}
                />
              ))}
            </div>
            <p className="text-slate-600">"{testimonial.comment}"</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
