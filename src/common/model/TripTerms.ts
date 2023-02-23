import PeriodType from "./PeriodType";

class TripTerms {
  startDate: Date | undefined | null;
  endDate: Date | undefined | null;
  adults: number | undefined = 1;
  children: number | undefined = 0;
  childrenAges: number[] | undefined = [];
  rooms: number | undefined = 1;
  period: PeriodType = PeriodType.summer;
}

export default TripTerms;