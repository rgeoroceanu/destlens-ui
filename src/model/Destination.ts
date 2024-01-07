import Nameable from "./Nameable";
import DestinationType from "./DestinationType";

class Destination implements Nameable {

  name: string = '';
  type: DestinationType = DestinationType.hotel;
}

export default Destination;