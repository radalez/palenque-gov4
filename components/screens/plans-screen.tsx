"use client"

import { Crown, Star, Zap, Gem, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"

interface PlansScreenProps {
  onBack: () => void
}

export function PlansScreen({ onBack }: PlansScreenProps) {
  const { userPlan, upgradePlan } = useAppStore()

  const plans = [
    {
      id: "FREE",
      name: "Plan Gratis",
      icon: Zap,
      price: "$0",
      period: "Siempre gratis",
      description: "Perfecto para explorar",
      features: [
        "Acceso a Marketplace",
        "Crear y unirse a Pools",
        "7% de comisión en recomendaciones",
        "Safe-Flow básico",
        "Soporte por email",
      ],
      color: "from-blue-50 to-blue-100 border-blue-200",
    },
    {
      id: "ORO",
      name: "Partner ORO",
      icon: Star,
      price: "$29",
      period: "mes",
      description: "Para gestores de activos",
      features: [
        "Todo del Plan Gratis",
        "Gestión multi-activo",
        "Crear y activar Remates Flow",
        "Crear paquetes de experiencias",
        "Dashboard de ventas",
        "Soporte prioritario",
        "8% comisión en recomendaciones",
      ],
      color: "from-amber-50 to-amber-100 border-amber-200",
    },
    {
      id: "PLATINO",
      name: "Partner PLATINO",
      icon: Crown,
      price: "$99",
      period: "mes",
      description: "Para socios VIP y logística",
      features: [
        "Todo de Partner ORO",
        "Crear y gestionar Rutas Abiertas",
        "Comisión de red en rutas",
        "Análisis avanzado de mercado",
        "API integración",
        "Gestor de cuenta dedicado",
        "10% comisión en recomendaciones",
      ],
      color: "from-purple-50 to-purple-100 border-purple-200",
    },
    {
      id: "PRO",
      name: "Soporte PRO",
      icon: Gem,
      price: "$49",
      period: "mes",
      description: "Para profesionales y servicios",
      features: [
        "Todo del Plan Gratis",
        "Directorio profesional destacado",
        "Visibilidad en Marketplace Capa 3",
        "Herramientas de contratos",
        "Estadísticas detalladas",
        "Soporte 24/7",
        "9% comisión en recomendaciones",
      ],
      color: "from-pink-50 to-pink-100 border-pink-200",
    },
  ]

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 px-4 pt-12 pb-6">
        <button onClick={onBack} className="mb-4 text-primary-foreground hover:opacity-80">
          ← Atrás
        </button>
        <h1 className="text-2xl font-bold text-primary-foreground">Planes y Membresías</h1>
        <p className="text-primary-foreground/80 text-sm mt-2">Elige el plan perfecto para ti</p>
      </div>

      {/* Plans Grid */}
      <div className="px-4 py-6 space-y-4 pb-24">
        {plans.map((plan) => {
          const Icon = plan.icon
          const isCurrentPlan = userPlan === plan.id
          return (
            <div
              key={plan.id}
              className={`bg-gradient-to-br ${plan.color} rounded-2xl p-6 border-2 transition-all ${
                isCurrentPlan ? "ring-2 ring-primary" : "hover:shadow-lg"
              }`}
            >
              {/* Plan Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/80 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">{plan.description}</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <p className="text-3xl font-bold text-foreground">
                  {plan.price}
                  <span className="text-sm text-muted-foreground ml-1">/ {plan.period}</span>
                </p>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-6">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              {isCurrentPlan ? (
                <Button disabled className="w-full bg-primary/50 text-primary-foreground">
                  Plan Actual
                </Button>
              ) : (
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => upgradePlan(plan.id as "ORO" | "PLATINO" | "PRO")}
                >
                  Actualizar a {plan.name}
                </Button>
              )}
            </div>
          )
        })}
      </div>

      {/* Info Box */}
      <div className="px-4 pb-6 mt-4">
        <div className="bg-muted/50 border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground">
            Todos los planes incluyen acceso completo a Palenque Go. Cancela en cualquier momento sin penalidades. Los precios pueden variar según tu ubicación.
          </p>
        </div>
      </div>
    </div>
  )
}
