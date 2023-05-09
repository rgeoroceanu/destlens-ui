import axios from "axios";
import Destination from "../model/Destination";
import Accommodation from "../model/Accommodation";
import TagCategory from "../model/TagCategory";
import Tag from "../model/Tag";
import ChatMessage from "../model/ChatMessage";
import ChatResponse from "../model/ChatResponse";
import ChatOutcome from "../model/ChatOutcome";

class SearchApiService {

  private http = axios.create({
    //baseURL: "http://localhost:8080/",
    baseURL: "https://api.tripwizard.io/",
    headers: {
      "Content-Type": "application/json"
    }
  });

  processChat(messages: ChatMessage[]): Promise<ChatResponse> {
    const request = {
      messages: messages
    };
    return this.http.post<ChatResponse>("/chat", request)
      .then(res => res.data);
  }

  searchDestination(text: string): Promise<Array<Destination>> {
    return this.http.get<Array<Destination>>("/destination/search", {params: {text: text}})
      .then(res => res.data);
  }

  searchAccommodation(text: string): Promise<Array<Accommodation>> {
    return this.http.get<Array<Accommodation>>("/accommodation/searchByText", {params: {text: text}})
      .then(res => res.data);
  }

  findMatchingAccommodations(outcome: ChatOutcome): Promise<Accommodation[]> {
    const request = {
      budgetValue: outcome.budgetValue,
      destinations: outcome.destinations,
      period: outcome.period,
      adults: outcome.adults,
      children: outcome.children,
      childrenAges: outcome.childrenAges,
      accommodations: outcome.accommodations,
      budgetCurrency: outcome.budgetCurrency,
      tags: outcome.tags,
    }
    return this.http.post<Accommodation[]>("/accommodation/matching", request)
      .then(res => res.data);
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