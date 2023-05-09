import TripDetails from "./TripDetails";
import TripCompanions from "./TripCompanions";
import PreviousLocations from "./PreviousLocations";
import TripTags from "./TripTags";

class TripSearch {
  tripDetails: TripDetails = new TripDetails();
  tripTerms: TripCompanions = new TripCompanions();
  previousLocations: PreviousLocations = new PreviousLocations();
  tags: TripTags = new TripTags();
}

export default TripSearch;