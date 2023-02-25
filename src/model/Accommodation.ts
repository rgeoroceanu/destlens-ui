import Nameable from "./Nameable";

interface Accommodation extends Nameable {
  name: string
  externalSourceType: string
  externalId: string
  images: string[]
  city: string
  country: string
  ratingValue: number
  ratingDisplay: string
  reviewCount: number
  priceLevelDisplay: string
  currency: string
  url: string
  ratingImageUrl: string
  pricePerNight: number
}

export default Accommodation;