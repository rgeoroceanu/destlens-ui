import Accommodation from "./Accommodation";

interface AccommodationMatch {
  accommodation: Accommodation;
  score: number;
  checkinDate: Date;
  checkoutDate: Date;
  startingPrice: number;
  currency: string
}

export default AccommodationMatch;