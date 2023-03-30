import axios from "axios";
import Destination from "../model/Destination";
import Accommodation from "../model/Accommodation";
import TripSearch from "../model/TripSearch";
import TagCategory from "../model/TagCategory";
import AccommodationMatch from "../model/AccommodationMatch";
import MatchResult from "../model/MatchResult";
import Tag from "../model/Tag";

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

  findMatchingAccommodations(tripSearch: TripSearch): Promise<AccommodationMatch[]> {
    const checkinDate = tripSearch.tripTerms?.startDate;
    const checkoutDate = tripSearch.tripTerms?.endDate;
    const request = {
      destinationId: tripSearch.tripDetails.destination?.externalId,
      purpose: tripSearch.tripDetails?.category,
      period: tripSearch.tripTerms?.period,
      duration: tripSearch.tripTerms?.duration,
      accommodationSearch: tripSearch.tripDetails?.accommodation,
      flightSearch: tripSearch.tripDetails?.flight,
      transferSearch: tripSearch.tripDetails?.transfer,
      carRentalSearch: tripSearch.tripDetails?.carRental,
      checkinDate: this.formatDate(checkinDate),
      checkoutDate: this.formatDate(checkoutDate),
      adults: tripSearch.tripTerms?.adults,
      children: tripSearch.tripTerms?.children,
      childrenAges: tripSearch.tripTerms?.childrenAges,
      rooms: tripSearch.tripTerms?.rooms,
      previousAccommodationIds: tripSearch.previousLocations?.locations.map(l => l.externalId),
      tags: tripSearch.tags?.tags,
    };

    return this.http.post<MatchResult>("/accommodation/matching", request)
      .then(res => res.data.accommodationMatches);
  }

  public getAllTags(): Promise<Tag[]> {
    return this.http.get<Array<TagCategory>>("/tags")
      .then(res => res.data)
      .then(categories => {
        const addedTags: Tag[] = [];

        for(let i=0; i<categories.length; i++) {
          const category = categories[i]
          for(let j=0; j<category.tags.length; j++) {
            const tag = category.tags[j];
            if (addedTags.filter(t => t.id === tag.id || t.name === tag.name).length === 0) {
              addedTags.push(tag);
            }
          }
        }

        return addedTags;
      });
  }

  private formatDate(date: Date | undefined | null): string | null {
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