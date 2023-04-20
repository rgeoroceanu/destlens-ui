import ChatMessage from "./ChatMessage";
import ChatOutcomeStatus from "./ChatOutcomeStatus";
import ChatOutcome from "./ChatOutcome";

class ChatResponse {
  message?: ChatMessage;
  outcome?: ChatOutcome;
  status?: ChatOutcomeStatus
}

export default ChatResponse;