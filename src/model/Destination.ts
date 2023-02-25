import Nameable from "./Nameable";
import DestinationType from "./DestinationType";

class Destination implements Nameable {

  name: string = '';
  externalSourceType: string = '';
  externalId: string = '';
  type: DestinationType = DestinationType.hotel;
}

export default Destination;