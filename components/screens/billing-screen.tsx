"use client"

import { useState } from "react"
import { ArrowLeft, Download, FileText, Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface BillingScreenProps {
  onBack: () => void
}

export function BillingScreen({ onBack }: BillingScreenProps) {
  const { bookings } = useAppStore()
  const [selectedFilter, setSelectedFilter] = useState<"all" | "reservas" | "pools">("all")
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  // Create billing history from bookings
  const billingHistory = bookings.map((booking) => ({
    id: booking.id,
    type: booking.poolId ? "pool" : "reserva",
    serviceName: booking.service.name,
    date: booking.date,
    amount: booking.totalPrice,
    status: booking.status,
    qrCode: booking.qrCode,
    details: {
      guests: booking.guests,
      time: booking.time,
      extras: booking.extras,
    },
  }))

  // Add some mock historical data if no bookings exist
  const mockHistory =
    billingHistory.length === 0
      ? [
          {
            id: 1001,
            type: "reserva",
            serviceName: "Hotel Vista al Volcan",
            date: "10 Ene",
            amount: 170,
            status: "COMPLETADO",
            qrCode: "PGO-DEMO1",
            details: { guests: 2, time: "14:00", extras: ["Desayuno incluido"] },
          },
          {
            id: 1002,
            type: "pool",
            serviceName: "Surf Experience El Tunco",
            date: "8 Ene",
            amount: 45,
            status: "COMPLETADO",
            qrCode: "PGO-DEMO2",
            details: { guests: 1, time: "09:00", extras: [] },
          },
          {
            id: 1003,
            type: "reserva",
            serviceName: "Ruta del Cafe Premium",
            date: "5 Ene",
            amount: 70,
            status: "COMPLETADO",
            qrCode: "PGO-DEMO3",
            details: { guests: 2, time: "10:00", extras: ["Degustacion premium"] },
          },
        ]
      : []

  const allBillings = [...billingHistory, ...mockHistory]

  const filteredBillings = allBillings.filter((b) => {
    if (selectedFilter === "all") return true
    if (selectedFilter === "reservas") return b.type === "reserva"
    if (selectedFilter === "pools") return b.type === "pool"
    return true
  })

  const totalSpent = allBillings.reduce((acc, b) => acc + b.amount, 0)

  const handleDownloadPDF = async (billing: (typeof allBillings)[0]) => {
    setDownloadingId(billing.id)

    // Simulate PDF generation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Create a simple text-based "PDF" content
    const pdfContent = `
PALENQUE GO - FACTURA
=====================

Codigo: ${billing.qrCode}
Fecha: ${billing.date}
Servicio: ${billing.serviceName}
Tipo: ${billing.type === "pool" ? "Compra en Grupo (Pool)" : "Reserva Individual"}

DETALLES
--------
Personas: ${billing.details.guests}
Hora: ${billing.details.time}
${billing.details.extras.length > 0 ? `Extras: ${billing.details.extras.join(", ")}` : ""}

TOTAL: $${billing.amount}

Estado: ${billing.status}

---
Gracias por usar Palenque GO
Economia Circular - Turismo Sostenible
    `.trim()

    // Create and download the file
    const blob = new Blob([pdfContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `PalenqueGO-Factura-${billing.qrCode}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setDownloadingId(null)
  }

  const handleDownloadAll = async () => {
    setDownloadingId(-1) // Special ID for "all"

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const allContent = filteredBillings
      .map(
        (billing) => `
FACTURA: ${billing.qrCode}
Fecha: ${billing.date}
Servicio: ${billing.serviceName}
Total: $${billing.amount}
Estado: ${billing.status}
-------------------`,
      )
      .join("\n")

    const fullContent = `
PALENQUE GO - RESUMEN DE FACTURAS
=================================

Total de facturas: ${filteredBillings.length}
Total gastado: $${totalSpent}

DETALLE DE FACTURAS
-------------------
${allContent}

---
Gracias por usar Palenque GO
    `.trim()

    const blob = new Blob([fullContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `PalenqueGO-Resumen-Facturas.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setDownloadingId(null)
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Mis Facturas</h1>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-4 text-primary-foreground">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Total gastado</span>
            <Badge className="bg-white/20 text-white border-0">{allBillings.length} facturas</Badge>
          </div>
          <p className="text-3xl font-bold">${totalSpent}</p>
          <p className="text-sm opacity-80 mt-1">Enero 2025</p>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-3 flex items-center gap-2 border-b border-border bg-card">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {["all", "reservas", "pools"].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter as typeof selectedFilter)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
              selectedFilter === filter ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            {filter === "all" ? "Todos" : filter === "reservas" ? "Reservas" : "Pools"}
          </button>
        ))}
      </div>

      {/* Download All Button */}
      {filteredBillings.length > 0 && (
        <div className="px-4 py-3">
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={handleDownloadAll}
            disabled={downloadingId === -1}
          >
            {downloadingId === -1 ? (
              <>
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                Generando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Descargar todas las facturas
              </>
            )}
          </Button>
        </div>
      )}

      {/* Billing List */}
      <div className="flex-1 px-4 pb-24">
        {filteredBillings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Sin facturas</h3>
            <p className="text-sm text-muted-foreground">Tus facturas apareceran aqui cuando realices reservas</p>
          </div>
        ) : (
          <div className="space-y-3 mt-3">
            {filteredBillings.map((billing) => (
              <div key={billing.id} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        billing.type === "pool" ? "bg-secondary/20" : "bg-primary/20",
                      )}
                    >
                      <FileText
                        className={cn("w-5 h-5", billing.type === "pool" ? "text-secondary" : "text-primary")}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{billing.serviceName}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant={billing.type === "pool" ? "secondary" : "default"} className="text-xs">
                          {billing.type === "pool" ? "Pool" : "Reserva"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{billing.qrCode}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">${billing.amount}</p>
                    <p className="text-xs text-muted-foreground">{billing.date}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{billing.details.time}</span>
                    <span className="mx-1">•</span>
                    <span>{billing.details.guests} persona(s)</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-primary hover:text-primary hover:bg-primary/10"
                    onClick={() => handleDownloadPDF(billing)}
                    disabled={downloadingId === billing.id}
                  >
                    {downloadingId === billing.id ? (
                      <>
                        <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin mr-1" />
                        <span className="text-xs">Descargando</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3 mr-1" />
                        <span className="text-xs">PDF</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
