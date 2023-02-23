import Destination from "./Destination";
import TripDetails from "./TripDetails";
import TripTerms from "./TripTerms";
import PreviousLocations from "./PreviousLocations";
import TripTags from "./TripTags";

class TripSearch {
  tripType: TripDetails = new TripDetails();
  tripTerms: TripTerms = new TripTerms();
  previousLocations: PreviousLocations = new PreviousLocations();
  tags: TripTags = new TripTags();
}

export default TripSearch;