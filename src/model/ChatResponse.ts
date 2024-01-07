import ChatMessage from "./ChatMessage";
import ChatOutcomeStatus from "./ChatOutcomeStatus";

class ChatResponse {
  message?: ChatMessage;
  status?: ChatOutcomeStatus
}

export default ChatResponse;