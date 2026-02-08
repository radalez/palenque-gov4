"use client"

import { Bell, Mail, MessageSquare } from "lucide-react"
import { useAppStore } from "@/lib/store"

interface NotificationsScreenProps {
  onBack: () => void
}

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const { notifications, updateNotifications } = useAppStore()

  const notificationTypes = [
    {
      id: "email",
      label: "Notificaciones por Email",
      description: "Recibe actualizaciones sobre reservas, pools y promociones",
      icon: Mail,
    },
    {
      id: "sms",
      label: "Notificaciones por SMS",
      description: "Alertas instantáneas en tu teléfono",
      icon: MessageSquare,
    },
    {
      id: "push",
      label: "Notificaciones Push",
      description: "Recordatorios y avisos en la app",
      icon: Bell,
    },
  ]

  const alertSettings = [
    { label: "Nuevas ofertas y Remates Flow", enabled: true },
    { label: "Actualizaciones de mis Pools", enabled: true },
    { label: "Confirmación de reservas", enabled: true },
    { label: "Safe-Flow y alertas de seguridad", enabled: true },
    { label: "Ingresos de mis recomendaciones", enabled: true },
    { label: "Cambios de precios en servicios favoritos", enabled: false },
    { label: "Mensajes de soporte", enabled: true },
  ]

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 px-4 pt-12 pb-6">
        <button onClick={onBack} className="mb-4 text-primary-foreground hover:opacity-80">
          ← Atrás
        </button>
        <h1 className="text-2xl font-bold text-primary-foreground">Notificaciones</h1>
        <p className="text-primary-foreground/80 text-sm mt-2">Configura tus preferencias de alertas</p>
      </div>

      {/* Notification Channels */}
      <div className="px-4 py-6 space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">CANALES DE NOTIFICACION</h3>

        {notificationTypes.map((type) => {
          const Icon = type.icon
          const isEnabled = notifications[type.id as keyof typeof notifications]
          return (
            <div key={type.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg mt-0.5">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{type.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
              </div>
              <button
                onClick={() =>
                  updateNotifications({
                    [type.id]: !isEnabled,
                  })
                }
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  isEnabled ? "bg-primary" : "bg-muted border border-border"
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    isEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          )
        })}

        {/* Alert Preferences */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">QUE DESEAS RECIBIR</h3>
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {alertSettings.map((alert, idx) => (
              <div key={idx} className="p-4 flex items-center gap-3">
                <input type="checkbox" defaultChecked={alert.enabled} className="w-4 h-4 accent-primary cursor-pointer" />
                <span className="text-sm text-foreground">{alert.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4 mt-6">
          <p className="text-xs text-muted-foreground">
            Las notificaciones de seguridad (Safe-Flow) siempre estarán activas para proteger tu experiencia en Palenque Go.
          </p>
        </div>
      </div>

      <div className="pb-24" />
    </div>
  )
}
