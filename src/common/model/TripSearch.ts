import Destination from "./Destination";
import TripType from "./TripType";
import TripTerms from "./TripTerms";
import PreviousLocations from "./PreviousLocations";

class TripSearch {

  destination: Destination | undefined
  tripType: TripType | undefined
  tripTerms: TripTerms | undefined;
  previousLocations: PreviousLocations | undefined
}

export default TripSearch;