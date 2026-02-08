"use client"

import { useState, useEffect } from "react"
import { Star, MapPin, ChevronLeft, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { BookingModal } from "@/components/booking-modal"

interface RecommendationPageProps {
  params: {
    id: string
  }
}

export default function RecommendationPage({ params }: RecommendationPageProps) {
  const { recommendations, services } = useAppStore()
  const [showBooking, setShowBooking] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const recommendation = recommendations.find((r) => r.id === params.id)
  const service = recommendation ? services.find((s) => s.id === recommendation.serviceId) : null

  if (!recommendation || !service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Recomendación no encontrada</h1>
          <p className="text-muted-foreground">El enlace que buscas no existe o ha expirado.</p>
          <Button className="mt-6" onClick={() => window.history.back()}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    )
  }

  const typeConfig = {
    oferta: { label: "Oferta", color: "from-blue-600 to-blue-500" },
    descuento: { label: "Descuento", color: "from-green-600 to-green-500" },
    feriado: { label: "Feriado", color: "from-purple-600 to-purple-500" },
  }

  const type = recommendation.type as keyof typeof typeConfig

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className={`bg-gradient-to-br ${typeConfig[type].color} relative overflow-hidden`}>
        {/* Background Image */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${service.image || "/placeholder.svg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-10 px-4 pt-6 pb-8">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors inline-block"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-32">
        {/* Service Image */}
        <div className="relative -mt-32 mb-6">
          <img
            src={service.image || "/placeholder.svg"}
            alt={service.name}
            className="w-full h-64 rounded-2xl object-cover shadow-2xl"
          />
        </div>

        {/* Type Badge */}
        <div className={`inline-block bg-gradient-to-r ${typeConfig[type].color} text-white px-4 py-2 rounded-full font-semibold text-sm mb-4`}>
          {typeConfig[type].label}
        </div>

        {/* Service Info */}
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-foreground text-balance">{service.name}</h1>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-5 h-5" />
            <span className="text-lg">{service.location}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-amber-500 stroke-amber-500" />
              <span className="text-xl font-bold text-foreground">{service.rating}</span>
              <span className="text-muted-foreground">({service.reviews} reseñas)</span>
            </div>
          </div>

          {/* Price */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Precio por persona</p>
            <p className="text-3xl font-bold text-primary">${service.price}</p>
            {service.isRemate && (
              <p className="text-sm text-red-600 font-semibold mt-2">-{service.discount}% de descuento</p>
            )}
          </div>
        </div>

        {/* Description */}
        {service.description && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-3">Sobre esta experiencia</h2>
            <p className="text-muted-foreground leading-relaxed">{service.description}</p>
          </div>
        )}

        {/* Recommendation Info */}
        <div className="bg-muted/50 rounded-xl p-4 mb-8">
          <p className="text-sm text-muted-foreground mb-1">Te lo recomendó:</p>
          <p className="font-semibold text-foreground">{recommendation.name}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Creado: {new Date(recommendation.createdAt).toLocaleDateString("es-ES")}
          </p>
        </div>

        {/* CTA Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
          <Button
            onClick={() => setShowBooking(true)}
            className="w-full h-14 text-lg font-semibold gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Reservar Ahora
          </Button>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <BookingModal
          service={service}
          onClose={() => setShowBooking(false)}
        />
      )}
    </div>
  )
}
