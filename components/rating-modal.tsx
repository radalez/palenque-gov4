"use client"

import { useState } from "react"
import { Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"

interface RatingModalProps {
  serviceId: number
  serviceName: string
  currentRating: number
  currentReviews: number
  onClose: () => void
}

export function RatingModal({
  serviceId,
  serviceName,
  currentRating,
  currentReviews,
  onClose,
}: RatingModalProps) {
  const [selectedStars, setSelectedStars] = useState<number | null>(null)
  const [hoveredStars, setHoveredStars] = useState<number | null>(null)
  const { rateService } = useAppStore()

  const handleSubmitRating = () => {
    if (selectedStars !== null) {
      rateService(serviceId, selectedStars)
      onClose()
    }
  }

  const displayStars = hoveredStars || selectedStars

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl max-w-sm w-full shadow-2xl p-6 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground">Calificar Servicio</h2>
            <p className="text-sm text-muted-foreground mt-1">{serviceName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Current Rating Display */}
        <div className="bg-muted/50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Calificación Actual</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">{currentRating}</span>
                <span className="text-sm text-muted-foreground">({currentReviews} calificaciones)</span>
              </div>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4"
                  fill={i < Math.floor(currentRating) ? "#f59e0b" : "none"}
                  stroke={i < Math.floor(currentRating) ? "#f59e0b" : "#ccc"}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Rating Stars Selection */}
        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-4">Tu Calificación</p>
          <div className="flex justify-center gap-3">
            {[5, 4, 3, 2, 1].map((stars) => (
              <button
                key={stars}
                onMouseEnter={() => setHoveredStars(stars)}
                onMouseLeave={() => setHoveredStars(null)}
                onClick={() => setSelectedStars(stars)}
                className="group relative p-3 rounded-lg transition-all duration-200 hover:bg-primary/10"
              >
                <div className="flex flex-col items-center gap-1">
                  <Star
                    className={`w-8 h-8 transition-all duration-200 ${
                      (displayStars || 0) >= stars
                        ? "fill-primary stroke-primary"
                        : "stroke-muted-foreground fill-none"
                    }`}
                  />
                  <span className="text-xs font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {stars}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview of New Average */}
        {selectedStars !== null && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
            <p className="text-xs text-muted-foreground mb-2">Nueva Calificación Promedio</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                {(
                  (currentRating * currentReviews + selectedStars) /
                  (currentReviews + 1)
                ).toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({currentReviews + 1} calificaciones)
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-transparent"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmitRating}
            disabled={selectedStars === null}
            className="flex-1"
          >
            Enviar Calificación
          </Button>
        </div>
      </div>
    </div>
  )
}
