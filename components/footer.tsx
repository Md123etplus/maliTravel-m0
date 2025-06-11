import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Bus, MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube, Send } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* À propos */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Bus className="h-6 w-6 text-amber-500" />
              <span className="text-xl font-bold">Mali Voyages</span>
            </div>
            <p className="mb-4 text-slate-300">
              Mali Voyages est le leader du transport de passagers au Mali, offrant des services de qualité,
              confortables et sécurisés pour tous vos déplacements.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="rounded-full bg-slate-800 p-2 hover:bg-amber-500">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="rounded-full bg-slate-800 p-2 hover:bg-amber-500">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="rounded-full bg-slate-800 p-2 hover:bg-amber-500">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="rounded-full bg-slate-800 p-2 hover:bg-amber-500">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-300 hover:text-amber-500">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-slate-300 hover:text-amber-500">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-slate-300 hover:text-amber-500">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-amber-500">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-amber-500">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-300 hover:text-amber-500">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-300 hover:text-amber-500">
                  Connexion
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-slate-300 hover:text-amber-500">
                  Créer un compte
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-amber-500" />
                <span className="text-slate-300">123 Avenue de l'Indépendance, Bamako, Mali</span>
              </li>
              <li className="flex items-start">
                <Phone className="mr-2 h-5 w-5 text-amber-500" />
                <span className="text-slate-300">+223 20 22 33 44</span>
              </li>
              <li className="flex items-start">
                <Mail className="mr-2 h-5 w-5 text-amber-500" />
                <span className="text-slate-300">contact@malivoyages.ml</span>
              </li>
              <li className="flex items-start">
                <Clock className="mr-2 h-5 w-5 text-amber-500" />
                <span className="text-slate-300">Lun - Sam: 7h00 - 19h00</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Newsletter</h3>
            <p className="mb-4 text-slate-300">
              Abonnez-vous à notre newsletter pour recevoir les dernières nouvelles et promotions.
            </p>
            <div className="flex">
              <Input
                type="email"
                placeholder="Votre email"
                className="rounded-r-none bg-slate-800 border-slate-700 text-white"
              />
              <Button className="rounded-l-none bg-amber-500 hover:bg-amber-600">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-slate-800" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-slate-400">&copy; {new Date().getFullYear()} Mali Voyages. Tous droits réservés.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-slate-400 hover:text-amber-500">
              Conditions d'utilisation
            </Link>
            <Link href="/privacy" className="text-sm text-slate-400 hover:text-amber-500">
              Politique de confidentialité
            </Link>
            <Link href="/cookies" className="text-sm text-slate-400 hover:text-amber-500">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
