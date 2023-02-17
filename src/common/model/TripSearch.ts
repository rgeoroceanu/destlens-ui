import Destination from "./Destination";
import TripDetails from "./TripDetails";
import TripTerms from "./TripTerms";
import PreviousLocations from "./PreviousLocations";

class TripSearch {

  destination: Destination | undefined
  tripType: TripDetails | undefined
  tripTerms: TripTerms | undefined;
  previousLocations: PreviousLocations | undefined
}

export default TripSearch;