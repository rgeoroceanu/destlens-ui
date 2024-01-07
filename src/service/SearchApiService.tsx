import axios from "axios";
import Destination from "../model/Destination";
import Accommodation from "../model/Accommodation";
import ChatMessage from "../model/ChatMessage";
import ChatResponse from "../model/ChatResponse";
import ChatThread from "../model/ChatThread";

class SearchApiService {

  private http = axios.create({
    //baseURL: "http://localhost:8080/",
    baseURL: "https://api.destlens.com/",
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

  findMatchingAccommodations(thread: ChatThread, count: number): Promise<Accommodation[]> {
    const request = {
      thread: thread,
      count
    };
    return this.http.post<Accommodation[]>("/accommodation/matching", request)
      .then(res => res.data);
  }
}

export default SearchApiService;