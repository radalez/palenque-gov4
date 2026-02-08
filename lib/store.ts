import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Rating {
  userId: string
  userName: string
  stars: number
  date: Date
}

export interface Service {
  id: number
  name: string
  category: string
  location: string
  rating: number
  reviews: number
  price: number
  image: string
  isRemate?: boolean
  discount?: number
  allowsPool: boolean
  spotsLeft: number
  description?: string
  capacityMin?: number
  capacityMax?: number
  extras?: { name: string; price: number }[]
  ratings?: Rating[]
  linkTypes?: ("oferta" | "descuento" | "feriado")[]
}

export interface PoolMember {
  name: string
  avatar: string
  paid: boolean
}

export interface PoolPayment {
  memberId: string
  name: string
  amount: number
  status: "PENDIENTE" | "PAGADO"
  paymentDate?: Date
}

export interface Pool {
  id: number
  serviceName: string
  serviceId: number
  location: string
  image: string
  leader: { name: string; avatar: string }
  currentMembers: number
  targetMembers: number
  totalPrice: number
  pricePerMember?: number
  deadline: string
  status: "ABIERTO" | "LLENO" | "PAGADO" | "FINALIZADO"
  members: PoolMember[]
  payments: PoolPayment[]
  qrCodes?: { [key: string]: string }
  createdAt: Date
}

export interface Route {
  id: number
  name: string
  pathSvg: string
  colorHex: string
  stops: { latitude: number; longitude: number; order: number }[]
}

export interface Transportation {
  id: number
  route: Route
  drivers: string[]
  currentLocation: { latitude: number; longitude: number }
  status: "EN_RUTA" | "TALLER" | "ESPERA"
}

export interface Booking {
  id: number
  service: Service
  date: string
  time: string
  guests: number
  extras: string[]
  totalPrice: number
  status: "PENDIENTE" | "CONFIRMADO" | "COMPLETADO"
  qrCode: string
  poolId?: number
}

export interface UserFavorite {
  serviceId: number
  preference: "me_gusta" | "me_gusta_mas"
  selectedForTrip: boolean
  addedAt: Date
}

export interface RecommendationStats {
  clicks: number
  purchases: number
  totalEarned: number
  paymentStatus: "PENDIENTE" | "PAGADO"
  lastPaymentDate?: Date
}

export interface Recommendation {
  id: string
  name: string
  link: string
  type: "oferta" | "descuento" | "feriado"
  serviceId: number
  createdAt: Date
  stats: RecommendationStats
}

interface AppState {
  services: Service[]
  pools: Pool[]
  bookings: Booking[]
  favorites: number[]
  userFavorites: UserFavorite[]
  recommendations: Recommendation[]
  routes: Route[]
  currentUser: { name: string; avatar: string }
  isAuthenticated: boolean
  hasCompletedOnboarding: boolean
  userPlan: "FREE" | "ORO" | "PLATINO" | "PRO"
  paymentMethods: Array<{ id: string; type: string; last4: string; isDefault: boolean }>
  notifications: { email: boolean; sms: boolean; push: boolean }
  poolPaymentPending: { poolId: number; options: "FULL" | "PERSONAL" }[]

  toggleFavorite: (id: number) => void
  addPool: (pool: Omit<Pool, "id" | "createdAt">) => Pool
  joinPool: (poolId: number) => void
  addBooking: (booking: Omit<Booking, "id" | "qrCode">) => Booking
  updatePoolStatus: (poolId: number, status: Pool["status"]) => void
  login: (username: string, password: string) => boolean
  completeOnboarding: () => void
  logout: () => void
  upgradePlan: (plan: "ORO" | "PLATINO" | "PRO") => void
  addPaymentMethod: (method: { type: string; last4: string }) => void
  updateNotifications: (settings: { email?: boolean; sms?: boolean; push?: boolean }) => void
  rateService: (serviceId: number, stars: number) => void
  toggleFavoritePreference: (serviceId: number) => void
  setFavoritePreference: (serviceId: number, preference: "me_gusta" | "me_gusta_mas") => void
  selectTripFavorite: (serviceId: number) => void
  addRecommendation: (recommendation: Omit<Recommendation, "id"> | Recommendation) => Recommendation
  updateRecommendationStats: (recommendationId: string, stats: Partial<RecommendationStats>) => void
  markRecommendationAsPaid: (recommendationId: string) => void
  payPool: (poolId: number, paymentType: "FULL" | "PERSONAL") => void
}

const initialServices: Service[] = [
  {
    id: 1,
    name: "Hotel Vista al Volcán",
    category: "hotel",
    location: "Santa Ana",
    rating: 4.9,
    reviews: 127,
    price: 85,
    // IMAGEN REAL DE UN HOTEL CON VISTA:
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
    isRemate: true,
    discount: 30,
    allowsPool: true,
    spotsLeft: 3,
    description: "Disfruta de vistas impresionantes al volcán desde tu habitación con todas las comodidades modernas.",
    capacityMin: 1,
    capacityMax: 4,
    extras: [
      { name: "Desayuno incluido", price: 15 },
      { name: "Tour al volcán", price: 45 },
      { name: "Spa & masajes", price: 35 },
    ],
    ratings: [],
    linkTypes: ["oferta", "descuento"],
  },
  {
    id: 2,
    name: "Surf Experience El Tunco",
    category: "surf",
    location: "El Tunco",
    rating: 4.8,
    reviews: 89,
    price: 45,
    // IMAGEN REAL DE SURF:
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=1000",
    isRemate: false,
    allowsPool: true,
    spotsLeft: 5,
    description:
      "Clases de surf para todos los niveles con instructores certificados en la mejor playa de El Salvador.",
    capacityMin: 1,
    capacityMax: 6,
    extras: [
      { name: "Alquiler de tabla", price: 20 },
      { name: "Sesión de fotos", price: 25 },
      { name: "Almuerzo playero", price: 12 },
    ],
    ratings: [],
    linkTypes: ["oferta"],
  },
  {
    id: 3,
    name: "Ruta del Café Premium",
    category: "cafe",
    location: "Ataco",
    rating: 5.0,
    reviews: 64,
    price: 35,
    // IMAGEN REAL DE CAFE:
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=1000",
    isRemate: false,
    allowsPool: true,
    spotsLeft: 8,
    description: "Recorre las fincas de café más exclusivas y aprende todo sobre el proceso del grano a la taza.",
    capacityMin: 2,
    capacityMax: 8,
    extras: [
      { name: "Degustación premium", price: 15 },
      { name: "Bolsa de café 1lb", price: 18 },
      { name: "Almuerzo típico", price: 12 },
    ],
    ratings: [],
    linkTypes: ["feriado"],
  },
  {
    id: 4,
    name: "Parque El Imposible Trek",
    category: "eco",
    location: "Ahuachapán",
    rating: 4.7,
    reviews: 156,
    price: 55,
    // IMAGEN REAL DE MONTAÑA/BOSQUE:
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000",
    isRemate: true,
    discount: 20,
    allowsPool: true,
    spotsLeft: 4,
    description: "Aventura en el bosque nuboso más biodiverso de El Salvador con guías expertos.",
    capacityMin: 2,
    capacityMax: 10,
    extras: [
      { name: "Guía privado", price: 30 },
      { name: "Equipo de camping", price: 25 },
      { name: "Comida orgánica", price: 15 },
    ],
    ratings: [],
    linkTypes: ["descuento", "feriado"],
  },
  {
    id: 5,
    name: "Pupusería La Abuela",
    category: "food",
    location: "San Salvador",
    rating: 4.9,
    reviews: 312,
    price: 12,
    // IMAGEN REAL DE COMIDA TÍPICA:
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1000",
    isRemate: false,
    allowsPool: false,
    spotsLeft: 0,
    description: "Las mejores pupusas tradicionales de El Salvador, receta de tres generaciones.",
    capacityMin: 1,
    capacityMax: 20,
    ratings: [],
    linkTypes: ["oferta"],
  },
  {
    id: 6,
    name: "Festival del Añil",
    category: "events",
    location: "Suchitoto",
    rating: 4.6,
    reviews: 78,
    price: 25,
    // IMAGEN REAL DE FESTIVAL:
    image: "https://res.cloudinary.com/djpzii4u9/image/upload/v1770576350/302751817_604425074541457_8228080554450174779_n_nhgwlx.jpg",
    
    isRemate: true,
    discount: 15,
    allowsPool: true,
    spotsLeft: 12,
    description: "Vive la tradición del añil con talleres, música y gastronomía local.",
    capacityMin: 1,
    capacityMax: 15,
    extras: [
      { name: "Taller de teñido", price: 20 },
      { name: "Comida tradicional", price: 10 },
    ],
    ratings: [],
    linkTypes: ["feriado"],
  },
]

const initialPools: Pool[] = [
  {
    id: 1,
    serviceName: "Hotel Vista al Volcán",
    serviceId: 1,
    location: "Santa Ana",
    // MISMA IMAGEN QUE EL SERVICIO 1:
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
    leader: { name: "María G.", avatar: "MG" },
    currentMembers: 3,
    targetMembers: 4,
    totalPrice: 340,
    pricePerMember: 85,
    deadline: "2h 30m",
    status: "ABIERTO",
    members: [
      { name: "María G.", avatar: "MG", paid: true },
      { name: "Carlos R.", avatar: "CR", paid: true },
      { name: "Ana L.", avatar: "AL", paid: false },
    ],
    payments: [],
    createdAt: new Date(),
  },
  {
    id: 2,
    serviceName: "Surf Experience El Tunco",
    serviceId: 2,
    location: "El Tunco",
    // MISMA IMAGEN QUE EL SERVICIO 2:
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=1000",
    leader: { name: "José P.", avatar: "JP" },
    currentMembers: 5,
    targetMembers: 5,
    totalPrice: 225,
    pricePerMember: 45,
    deadline: "Cerrado",
    status: "PAGADO",
    members: [
      { name: "José P.", avatar: "JP", paid: true },
      { name: "Luis M.", avatar: "LM", paid: true },
      { name: "Sofia T.", avatar: "ST", paid: true },
      { name: "Diego V.", avatar: "DV", paid: true },
      { name: "Elena R.", avatar: "ER", paid: true },
    ],
    qrCodes: {
      "José P.": "QR-2-0-COMPLETE",
      "Luis M.": "QR-2-1-COMPLETE",
      "Sofia T.": "QR-2-2-COMPLETE",
      "Diego V.": "QR-2-3-COMPLETE",
      "Elena R.": "QR-2-4-COMPLETE",
    },
    payments: [
      { memberId: "1", name: "José P.", amount: 45, status: "PAGADO", paymentDate: new Date() },
      { memberId: "2", name: "Luis M.", amount: 45, status: "PAGADO", paymentDate: new Date() },
      { memberId: "3", name: "Sofia T.", amount: 45, status: "PAGADO", paymentDate: new Date() },
      { memberId: "4", name: "Diego V.", amount: 45, status: "PAGADO", paymentDate: new Date() },
      { memberId: "5", name: "Elena R.", amount: 45, status: "PAGADO", paymentDate: new Date() },
    ],
    createdAt: new Date(),
  },
  {
    id: 3,
    serviceName: "Ruta del Café Premium",
    serviceId: 3,
    location: "Ataco",
    // MISMA IMAGEN QUE EL SERVICIO 3:
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=1000",
    leader: { name: "Roberto S.", avatar: "RS" },
    currentMembers: 2,
    targetMembers: 6,
    totalPrice: 210,
    pricePerMember: 35,
    deadline: "5h 15m",
    status: "ABIERTO",
    members: [
      { name: "Roberto S.", avatar: "RS", paid: true },
      { name: "Carmen H.", avatar: "CH", paid: false },
    ],
    payments: [],
    createdAt: new Date(),
  },
]

const initialRoutes: Route[] = [
  {
    id: 1,
    name: "Ruta del Sol",
    pathSvg: "M10 10 L100 100 L200 50 L300 150",
    colorHex: "#F59E0B",
    stops: [
      { latitude: 13.6843, longitude: -89.2191, order: 1 },
      { latitude: 13.7339, longitude: -89.2191, order: 2 },
      { latitude: 13.7942, longitude: -89.2191, order: 3 },
    ],
  },
  {
    id: 2,
    name: "Ruta de la Costa",
    pathSvg: "M10 50 L200 100 L300 150",
    colorHex: "#06B6D4",
    stops: [
      { latitude: 13.5098, longitude: -89.6742, order: 1 },
      { latitude: 13.5098, longitude: -89.5742, order: 2 },
    ],
  },
  {
    id: 3,
    name: "Ruta de las Montañas",
    pathSvg: "M20 80 L100 20 L200 100",
    colorHex: "#10B981",
    stops: [
      { latitude: 14.0643, longitude: -89.1839, order: 1 },
      { latitude: 13.9339, longitude: -89.2339, order: 2 },
    ],
  },
]

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      services: initialServices,
      pools: initialPools,
      bookings: [],
      favorites: [],
      userFavorites: [],
      recommendations: [],
      routes: initialRoutes,
      currentUser: { name: "Juan D.", avatar: "JD" },
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      userPlan: "FREE",
      paymentMethods: [
        { id: "1", type: "Visa", last4: "4242", isDefault: true },
        { id: "2", type: "Mastercard", last4: "5555", isDefault: false },
      ],
      notifications: { email: true, sms: true, push: true },
      poolPaymentPending: [],

      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id) ? state.favorites.filter((f) => f !== id) : [...state.favorites, id],
        })),

      addPool: (poolData) => {
        const newPool: Pool = {
          ...poolData,
          id: Date.now(),
          createdAt: new Date(),
        }
        set((state) => ({ pools: [...state.pools, newPool] }))
        return newPool
      },

      joinPool: (poolId) =>
        set((state) => ({
          pools: state.pools.map((pool) => {
            if (pool.id === poolId && pool.currentMembers < pool.targetMembers) {
              const updatedPool = {
                ...pool,
                currentMembers: pool.currentMembers + 1,
                members: [...pool.members, { name: state.currentUser.name, avatar: state.currentUser.avatar, paid: false }],
              }
              if (updatedPool.currentMembers >= updatedPool.targetMembers) {
                updatedPool.status = "LLENO"
                updatedPool.deadline = "Cerrado"
              }
              return updatedPool
            }
            return pool
          }),
        })),

      addBooking: (bookingData) => {
        const newBooking: Booking = {
          ...bookingData,
          id: Date.now(),
          qrCode: `PGO-${Date.now().toString(36).toUpperCase()}`,
        }
        set((state) => ({ bookings: [...state.bookings, newBooking] }))
        return newBooking
      },

      updatePoolStatus: (poolId, status) =>
        set((state) => ({
          pools: state.pools.map((pool) => (pool.id === poolId ? { ...pool, status } : pool)),
        })),

      login: (username, password) => {
        if (username === "demo" && password === "1234") {
          set({ isAuthenticated: true })
          return true
        }
        return false
      },

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      logout: () => set({ isAuthenticated: false, hasCompletedOnboarding: false }),

      upgradePlan: (plan) => set({ userPlan: plan }),

      addPaymentMethod: (method) =>
        set((state) => ({
          paymentMethods: [
            ...state.paymentMethods.map((m) => ({ ...m, isDefault: false })),
            { id: Date.now().toString(), ...method, isDefault: true },
          ],
        })),

      updateNotifications: (settings) =>
        set((state) => ({
          notifications: { ...state.notifications, ...settings },
        })),

      rateService: (serviceId, stars) =>
        set((state) => ({
          services: state.services.map((service) => {
            if (service.id === serviceId) {
              const currentRatings = service.ratings || []
              const newRating: Rating = {
                userId: "user-" + Date.now(),
                userName: state.currentUser.name,
                stars,
                date: new Date(),
              }
              const allRatings = [...currentRatings, newRating]
              const totalStars = allRatings.reduce((sum, r) => sum + r.stars, 0)
              const averageRating = totalStars / allRatings.length
              return {
                ...service,
                rating: parseFloat(averageRating.toFixed(1)),
                reviews: allRatings.length,
                ratings: allRatings,
              }
            }
            return service
          }),
        })),

      toggleFavoritePreference: (serviceId) =>
        set((state) => {
          const existingFavorite = state.userFavorites.find((f) => f.serviceId === serviceId)
          if (existingFavorite) {
            // Si existe, lo eliminamos (deshacer corazón)
            return {
              userFavorites: state.userFavorites.filter((f) => f.serviceId !== serviceId),
            }
          } else {
            // Si no existe, lo agregamos como "me_gusta"
            return {
              userFavorites: [
                ...state.userFavorites,
                {
                  serviceId,
                  preference: "me_gusta",
                  selectedForTrip: false,
                  addedAt: new Date(),
                },
              ],
            }
          }
        }),

      setFavoritePreference: (serviceId, preference) =>
        set((state) => ({
          userFavorites: state.userFavorites.map((f) =>
            f.serviceId === serviceId ? { ...f, preference } : f,
          ),
        })),

      selectTripFavorite: (serviceId) =>
        set((state) => ({
          userFavorites: state.userFavorites.map((f) => ({
            ...f,
            selectedForTrip: f.serviceId === serviceId,
          })),
        })),

      addRecommendation: (recommendationData) => {
        const newRecommendation: Recommendation = {
          ...recommendationData,
          id: "rec-" + Date.now(),
        }
        set((state) => {
          const updated = [...state.recommendations, newRecommendation]
          if (typeof window !== "undefined") {
            localStorage.setItem("palenquego_recommendations", JSON.stringify(updated))
          }
          return { recommendations: updated }
        })
        return newRecommendation
      },

      updateRecommendationStats: (recommendationId, stats) =>
        set((state) => {
          const updated = state.recommendations.map((rec) =>
            rec.id === recommendationId
              ? {
                  ...rec,
                  stats: {
                    ...rec.stats,
                    ...stats,
                  },
                }
              : rec,
          )
          if (typeof window !== "undefined") {
            localStorage.setItem("palenquego_recommendations", JSON.stringify(updated))
          }
          return { recommendations: updated }
        }),

      markRecommendationAsPaid: (recommendationId) =>
        set((state) => {
          const updated = state.recommendations.map((rec) =>
            rec.id === recommendationId
              ? {
                  ...rec,
                  stats: {
                    ...rec.stats,
                    paymentStatus: "PAGADO",
                    lastPaymentDate: new Date(),
                  },
                }
              : rec,
          )
          if (typeof window !== "undefined") {
            localStorage.setItem("palenquego_recommendations", JSON.stringify(updated))
          }
          return { recommendations: updated }
        }),

      payPool: (poolId, paymentType) => {
        set((state) => {
          const pool = state.pools.find((p) => p.id === poolId)
          if (!pool) return state

          let updatedPools = state.pools
          let updatedPaymentPending = state.poolPaymentPending

          if (paymentType === "FULL") {
            updatedPools = updatedPools.map((p) =>
              p.id === poolId
                ? {
                    ...p,
                    status: "PAGADO",
                    members: p.members.map((m) => ({ ...m, paid: true })),
                    qrCodes: p.members.reduce(
                      (acc, member, idx) => {
                        acc[member.name] = `QR-${poolId}-${idx}-${Date.now()}`
                        return acc
                      },
                      {} as { [key: string]: string },
                    ),
                  }
                : p,
            )
          } else {
            updatedPools = updatedPools.map((p) =>
              p.id === poolId
                ? {
                    ...p,
                    members: p.members.map((m) => (m.name === state.currentUser.name ? { ...m, paid: true } : m)),
                    status:
                      p.members.every((m) => m.name === state.currentUser.name ? true : m.paid) &&
                      p.members.find((m) => m.name === state.currentUser.name)?.paid
                        ? "PAGADO"
                        : p.status,
                    qrCodes: {
                      ...p.qrCodes,
                      [state.currentUser.name]: `QR-${poolId}-user-${Date.now()}`,
                    },
                  }
                : p,
            )
          }

          return {
            pools: updatedPools,
            poolPaymentPending: updatedPaymentPending.filter((p) => p.poolId !== poolId),
          }
        })
      },
    }),
    {
      name: "app-storage",
    },
  ),
)