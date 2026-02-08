import { Metadata } from "next"
import RecommendationPage from "./recommendation-page"

export const metadata: Metadata = {
  title: "Recomendación - Palenquego",
  description: "Recomendación de experiencia",
}

export default function Page({ params }: { params: { id: string } }) {
  return <RecommendationPage params={params} />
}
