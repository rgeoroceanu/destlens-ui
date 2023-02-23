import TripType from "./TripType";
import Destination from "./Destination";

class TripDetails {
  category: TripType = TripType.beach;
  accommodation: boolean = true;
  flight: boolean = false;
  transfer: boolean = false;
  carRental: boolean = false;
  destination: Destination | undefined;
}

export default TripDetails;