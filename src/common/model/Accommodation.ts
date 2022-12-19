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
  totalStayPrice: number
  currency: string
  url: string
}

export default Accommodation;