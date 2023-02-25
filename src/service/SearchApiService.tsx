import axios from "axios";
import Destination from "../model/Destination";
import Accommodation from "../model/Accommodation";
import TripSearch from "../model/TripSearch";
import TagCategory from "../model/TagCategory";
import AccommodationMatch from "../model/AccommodationMatch";

const TAG_CATEGORIES = [
  {
    name: 'General',
    tags: ['City center', 'Metro nearby', 'Beach nearby', 'Ski slope nearby', 'No meals included',
    'Breakfast Included', 'Breakfast + dinner or lunch included', 'Breakfast, lunch and dinner included',
    'All-inclusive', 'No card required', 'Free cancellation', 'Pay now', 'Pay on the spot', 'Clean', 'Luxury',
    'Friendly']
  },
  {
    name: 'Accommodation',
    tags: ['Hotel', 'Hostel', 'Apartment', 'Apartment hotel', 'Guesthouse', 'Villa', 'Bungalows', 'Camping',
      'Glamping', 'Free Internet', 'Transfer', 'Parking', 'Swimming Pool', 'Fitness centre', 'Bar or restaurant',
      'Conference hall', 'Spa Services', 'Jacuzzi', 'Electric car charging', 'Adults-only', 'Pets-allowed']

  },
  {
    name: 'Room',
    tags: ['Air-conditioning', 'Private Bathroom', 'Window in the room', 'Kitchen', 'Balcony', 'View from the window',
    'Double bed', 'Separate beds']
  },
  {
    name: 'Rating',
    tags: ['Super', 'Excellent', 'Very good', 'Good', 'Fairly good', '5-Stars' , '4 Stars', '3-Stars', '2-Stars', '1-Star']
  },
];

const MOCK_RESULT =
  {
    accommodation: {
      name: 'Eurostars Book Hotel\n',
      externalSourceType: 'ZENHOTELS',
      externalId: '7696138',
      images: ['https://cdn.worldota.net/t/640x400/content/06/9e/069e6cf3ea97cfbefec441eb2e2fab9bd7614977.jpeg', 'https://cdn.worldota.net/t/240x240/content/f8/1d/f81df4144ecb53ca0ec3b4a7e9607b6a8afa721e.jpeg'],
      city: 'Munich',
      country: 'Germany',
      ratingValue: 8.7,
      ratingDisplay: 'Hervorragend',
      reviewCount: 1416,
      priceLevelDisplay: '$$$',
      currency: 'EUR',
      url: 'https://www.zenhotels.com/hotel/germany/munich/mid7696138/eurostars_book_hotel/?q=2452&dates=04.02.2023-05.02.2023&guests=2&price=one&room=s-ff48fdfe-5bc4-52c3-b854-ceccf01d191a&serp_price=eurostars_book_hotel.572.RON.h-c1e98324-2f52-5743-ae73-545c93ac43fd&sid=389b201e-92d5-446c-b12e-f9963bd2c2f1',
      ratingImageUrl: 'https://www.tripadvisor.com/img/cdsi/img2/ratings/traveler/4.0-18579-5.svg',
      pricePerNight: 65
    },
    score: 0.7
  };

class SearchApiService {

  private http = axios.create({
    //baseURL: "http://localhost:8080/",
    baseURL: "https://api.tripwizard.io/",
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
      destinationType: tripSearch.tripDetails.destination?.type,
      purpose: tripSearch.tripDetails?.category,
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
    };

    //return this.http.post<MatchResult>("/accommodation/matching", request)
    //  .then(res => res.data);

    const result = [MOCK_RESULT, MOCK_RESULT, MOCK_RESULT, MOCK_RESULT,
        MOCK_RESULT, MOCK_RESULT, MOCK_RESULT, MOCK_RESULT, MOCK_RESULT, MOCK_RESULT, MOCK_RESULT,
        MOCK_RESULT, MOCK_RESULT, MOCK_RESULT, MOCK_RESULT, MOCK_RESULT, MOCK_RESULT, MOCK_RESULT];

    return new Promise((resolveInner) => {
      setTimeout(() => resolveInner(result), 3000);
    });
  }

  public getTagCategories(): TagCategory[] {
    return TAG_CATEGORIES;
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