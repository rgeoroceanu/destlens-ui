import TripPurpose from "./TripPurpose";

class TripType {
  purpose: TripPurpose | undefined
  accommodation: boolean | undefined;
  flight: boolean | undefined;
  transfer: boolean | undefined;
  carRental: boolean | undefined;
}

export default TripType;