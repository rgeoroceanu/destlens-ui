import PeriodType from "./PeriodType";
import DurationType from "./DurationType";

const initialStartDate = new Date();
const initialEndDate = new Date();
initialEndDate.setDate(initialStartDate.getDate() + 1);

class TripTerms {
  startDate: Date | undefined | null = initialStartDate;
  endDate: Date | undefined | null = initialEndDate;
  adults: number | undefined = 2;
  children: number | undefined = 0;
  childrenAges: number[] | undefined = [];
  rooms: number | undefined = 1;
  period: PeriodType | undefined = undefined;
  duration: DurationType | undefined = undefined;
}

export default TripTerms;