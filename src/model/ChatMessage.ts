import ChatParticipant from "./ChatParticipant";

class ChatMessage {
  own: boolean = true;
  text: string = '';
  sender: ChatParticipant | null = null;
}

export default ChatMessage;