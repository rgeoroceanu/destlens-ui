import DurationType from "./DurationType";

class DurationTypeDisplay {

  static of(duration: DurationType): string {
    switch (duration) {
      case DurationType.weekend:
        return "Over the weekend";
      case DurationType.week:
        return "One week";
      case DurationType.month:
        return "Whole month";
    }
  }
}

export default DurationTypeDisplay;