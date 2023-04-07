class ChatMessage {
  own: boolean = true;
  text: string = '';

  constructor(own: boolean, text: string) {
    this.own = own;
    this.text = text;
  }
}

export default ChatMessage;