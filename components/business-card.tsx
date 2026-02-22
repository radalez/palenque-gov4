"use client"

import { useRouter } from "next/navigation"
import { Business } from "@/lib/store"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Star, Phone, MessageCircle, Share2, ExternalLink } from "lucide-react"

interface BusinessCardProps {
  business: Business
  onViewProfile?: (business: Business) => void
}

export function BusinessCard({ business, onViewProfile }: BusinessCardProps) {
  const router = useRouter()
 const handleWhatsApp = () => {
    // Añadimos el signo '?' después de socialLinks
    if (business.socialLinks?.whatsapp) {
      const phone = business.socialLinks.whatsapp.replace(/\D/g, "")
      window.open(`https://wa.me/${phone}`, "_blank")
    }
  }

  const handleCall = () => {
    if (business.socialLinks?.phone) {
      window.location.href = `tel:${business.socialLinks.phone}`
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: business.name,
        text: business.description,
        url: window.location.href,
      })
    } else {
      const url = `${window.location.origin}?business=${business.id}`
      navigator.clipboard.writeText(url)
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
      onViewProfile?.(business)
      router.push(`/b/${business.id}`)
    }}>
      {/* Cover Image */}
      <div className="relative w-full h-48 overflow-hidden bg-muted">
        <img
          src={business.coverImage}
          alt={business.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-3 left-3 bg-white/90 text-foreground hover:bg-white">
          {business.category}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Business Info */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{business.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{business.location}</p>
          </div>
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3Ctext x='50' y='50' font-size='40' font-weight='bold' text-anchor='middle' dy='.3em' fill='%23374151'%3E${business.logo}%3C/text%3E%3C/svg%3E`} />
            <AvatarFallback>{business.logo}</AvatarFallback>
          </Avatar>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-sm">{business.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">({business.reviews} reseñas)</span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">{business.description}</p>

        {/* Services Count */}
        <div className="text-xs text-muted-foreground">
         {/* Usamos un seguro para que si services es undefined, use un array vacío */}
        {(business.services || []).length} servicio{(business.services || []).length !== 1 ? "s" : ""} disponible{(business.services || []).length !== 1 ? "s" : ""}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-8"
            onClick={(e) => {
              e.stopPropagation()
              handleWhatsApp()
            }}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            WhatsApp
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-8"
            onClick={(e) => {
              e.stopPropagation()
              handleCall()
            }}
          >
            <Phone className="w-4 h-4 mr-1" />
            Llamar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 h-8"
            onClick={(e) => {
              e.stopPropagation()
              handleShare()
            }}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Social Links */}
        <div className="flex gap-2 pt-2 border-t">
          {/* El error ocurre aquí: añadimos '?' */}
          {business.socialLinks?.instagram && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation()
                window.open(`https://instagram.com/${business.socialLinks?.instagram}`, "_blank")
              }}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
          {business.socialLinks?.facebook && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation()
                window.open(`https://facebook.com/${business.socialLinks?.facebook}`, "_blank")
              }}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
