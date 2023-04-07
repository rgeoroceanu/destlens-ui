import Nameable from "./Nameable";

interface Accommodation extends Nameable {
  name: string
  externalId: string
  photos: string[]
  city: string
  country: string
  ratingValue: number
  reviewCount: number
  url: string
  tripadvisorUrl: string
  ratingImageUrl: string
  priceLevel: number
}

export default Accommodation;