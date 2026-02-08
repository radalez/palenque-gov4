"use client"

import { useState } from "react"
import { X, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface FilterOptions {
  ratingMin: number
  priceMin: number
  priceMax: number
  searchQuery: string
}

interface AdvancedFilterPanelProps {
  onFilter: (filters: FilterOptions) => void
  onClose: () => void
  maxPrice: number
}

export function AdvancedFilterPanel({ onFilter, onClose, maxPrice }: AdvancedFilterPanelProps) {
  const [ratingMin, setRatingMin] = useState(0)
  const [priceMin, setPriceMin] = useState(0)
  const [priceMax, setPriceMax] = useState(maxPrice)
  const [searchQuery, setSearchQuery] = useState("")

  const handleApplyFilters = () => {
    onFilter({
      ratingMin,
      priceMin,
      priceMax,
      searchQuery,
    })
    onClose()
  }

  const handleReset = () => {
    setRatingMin(0)
    setPriceMin(0)
    setPriceMax(maxPrice)
    setSearchQuery("")
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center sm:justify-center p-4">
      <div className="bg-card w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-card rounded-t-2xl z-10 flex-shrink-0">
          <h2 className="text-2xl font-bold text-foreground">Filtros</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0">
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Search by Name */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">Buscar por nombre</label>
            <Input
              placeholder="Ej: Hotel, Surf, Café..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Rating Filter */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">Calificación mínima</label>
            <div className="grid grid-cols-6 gap-2">
              {[0, 1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setRatingMin(rating)}
                  className={cn(
                    "py-2 rounded-lg transition-all flex items-center justify-center gap-1 text-xs font-medium",
                    ratingMin === rating
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {rating === 0 ? (
                    "Todos"
                  ) : (
                    <>
                      <Star className="w-3 h-3 fill-current" />
                      {rating}
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-4 block">Rango de precio</label>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs text-muted-foreground">Precio mínimo</label>
                  <span className="text-sm font-bold text-primary">${priceMin}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceMin}
                  onChange={(e) => setPriceMin(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs text-muted-foreground">Precio máximo</label>
                  <span className="text-sm font-bold text-primary">${priceMax}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Rango seleccionado</p>
                <p className="text-lg font-bold text-foreground">
                  ${priceMin} - ${priceMax}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons - Fixed */}
        <div className="p-6 border-t border-border bg-card rounded-b-2xl z-10 flex-shrink-0 space-y-2">
          <Button onClick={handleApplyFilters} className="w-full h-11 text-base font-semibold">
            Aplicar filtros
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset} 
            className="w-full h-11 text-base font-semibold bg-transparent"
          >
            Limpiar filtros
          </Button>
        </div>
      </div>
    </div>
  )
}
