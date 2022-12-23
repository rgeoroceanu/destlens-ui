import axios from "axios";
import Destination from "../../common/model/Destination";
import Accommodation from "../../common/model/Accommodation";
import TripSearch from "../../common/model/TripSearch";
import MatchResult from "../../common/model/MatchResult";

class SearchApiService {

  private http = axios.create({
    baseURL: "http://localhost:8080/",
    //baseURL: "https://api.tripwizard.io/",
    headers: {
      "Content-Type": "application/json"
    }
  });

  searchDestination(text: string): Promise<Array<Destination>> {
    return this.http.get<Array<Destination>>("/destination/search", {params: {text: text}})
      .then(res => res.data);
  }

  searchAccommodation(text: string): Promise<Array<Accommodation>> {
    return this.http.get<Array<Accommodation>>("/accommodation/searchByText", {params: {text: text}})
      .then(res => res.data);
  }

  findMatchingAccommodations(tripSearch: TripSearch): Promise<MatchResult> {
    const checkinDate = tripSearch.tripTerms?.startDate;
    const checkoutDate = tripSearch.tripTerms?.endDate;
    const request = {
      destinationId: tripSearch.destination?.externalId,
      destinationType: tripSearch.destination?.type,
      purpose: tripSearch.tripType?.purpose,
      accommodationSearch: tripSearch.tripType?.accommodation,
      flightSearch: tripSearch.tripType?.flight,
      transferSearch: tripSearch.tripType?.transfer,
      carRentalSearch: tripSearch.tripType?.carRental,
      checkinDate: this.formatDate(checkinDate),
      checkoutDate: this.formatDate(checkoutDate),
      adults: tripSearch.tripTerms?.adults,
      children: tripSearch.tripTerms?.children,
      childrenAges: tripSearch.tripTerms?.childrenAges,
      rooms: tripSearch.tripTerms?.rooms,
      previousAccommodationIds: tripSearch.previousLocations?.locations.map(l => l.externalId),
    };

    return this.http.post<MatchResult>("/accommodation/matching", request)
      .then(res => res.data);
  }

  private formatDate(date: Date | undefined): string | null {
    if (!date) return null;
    const mm = date.getMonth() + 1; // getMonth() is zero-based
    const dd = date.getDate();
    return [date.getFullYear(),
      (mm>9 ? '' : '0') + mm,
      (dd>9 ? '' : '0') + dd
    ].join('-');
  }
}

export default SearchApiService;