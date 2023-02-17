import TripType from "./TripType";
import Destination from "./Destination";

class TripDetails {
  category: TripType | undefined
  accommodation: boolean | undefined;
  flight: boolean | undefined;
  transfer: boolean | undefined;
  carRental: boolean | undefined;
  destination: Destination | undefined;
}

export default TripDetails;