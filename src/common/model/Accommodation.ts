import Nameable from "./Nameable";

interface Accommodation extends Nameable {
  name: string
  externalSourceType: string
  externalId: string
  smallPhotoUrl: string
  mediumPhotoUrl: string
  largePhotoUrl: string
  city: string
  country: string
  ratingValue: number
  ratingDisplay: string
  reviewCount: number
  priceLevelDisplay: string
  currency: string
  url: string
  ratingImageUrl: string
}

export default Accommodation;