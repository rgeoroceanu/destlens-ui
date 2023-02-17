import PeriodType from "./PeriodType";

class TripTerms {
  startDate: Date | undefined | null;
  endDate: Date | undefined | null;
  adults: number | undefined;
  children: number | undefined;
  childrenAges: number[] | undefined;
  rooms: number | undefined;
  period: PeriodType | undefined;
}

export default TripTerms;