import React, {Component} from 'react';
import './Chat.css';
import ChatMessage from "../../model/ChatMessage";
import TextField from "@mui/material/TextField";
import ChatThread from "../../model/ChatThread";

interface ChatInput {
  thread: ChatThread
}

class Chat extends Component<any, any> {

  constructor(props: ChatInput) {
    super(props);
    this.state = {
      thread: props.thread
    };
  }

  render() {
    console.log(this.state.thread.messages)
    return (
      <div className={"chat-wrapper"}>
        { this.getMessagesComponent(this.state.thread.messages) }
        <div className={"chat-write-wrapper"}>
          <TextField className={"chat-write-field"}>

          </TextField>
        </div>
      </div>
    );
  }

  private getMessagesComponent(messages: ChatMessage[]) {
    return <div className={"chat-messages"}>
      { messages.map(m => this.getMessageComponent(m)) }
    </div>
  }

  private getMessageComponent(message: ChatMessage) {
    return <div className={"chat-message " + message.own ? "chat-message-own" : "chat-message-another"}>
      {message.text}
    </div>
  }
}

export default Chat;