import ChatMessageRole from "./ChatMessageRole";

class ChatMessage {
  role: ChatMessageRole = ChatMessageRole.user;
  content: string = '';

  constructor(role: ChatMessageRole, text: string) {
    this.role = role;
    this.content = text;
  }
}

export default ChatMessage;