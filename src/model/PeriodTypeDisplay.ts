import PeriodType from "./PeriodType";

class PeriodTypeDisplay {

  static of(period: PeriodType): string {
    switch (period) {
      case PeriodType.fall:
        return "Fall";
      case PeriodType.spring:
        return "Spring";
      case PeriodType.summer:
        return "Summer";
      case PeriodType.winter:
        return "Winter";
    }
  }
}

export default PeriodTypeDisplay;