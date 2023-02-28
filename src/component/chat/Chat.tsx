import React, {Component} from 'react';
import './Chat.css';
import ChatMessage from "../../model/ChatMessage";
import TextField from "@mui/material/TextField";
import {Send} from "@mui/icons-material";
import {TypeAnimation} from "react-type-animation";
import {IconButton} from "@mui/material";

class Chat extends Component<any, any> {

  render() {
    const component = this.props.inputComponent ? this.props.inputComponent : this.getDefaultInputComponent();
    const loading = this.props.loading ? this.props.loading : false;
    const sendClickListener = this.props.sendClickListener ? this.props.sendClickListener : undefined;
    return (
      <div className={"chat-wrapper"}>
        { this.getMessagesComponent(this.props.thread.messages, loading) }
        <div className={"chat-write-wrapper"}>
          {component}
          <IconButton
            onClick={sendClickListener}
            color="primary"
            className={"chat-write-button"}>
            <Send className={"chat-write-icon"}></Send>
          </IconButton>
        </div>
      </div>
    );
  }

  private getDefaultInputComponent() {
    return <TextField className={"chat-write-field"}></TextField>;
  }

  private getMessagesComponent(messages: ChatMessage[], loading: boolean) {
    return <div className={"chat-messages"}>
      { messages.map((m, i) => this.getMessageComponent(m, i)) }
      { loading ? this.getTypingAnimation() : null}
    </div>
  }

  private getTypingAnimation() {
    return <div className={"chat-message chat-message-another"}>
      <TypeAnimation
        sequence={['.', 200, '..', 300, '...', 400, () => {}]}
        wrapper="div"
        cursor={false}
        repeat={Infinity}
        style={{ textAlign: 'right', fontSize: '1.5em' }}
      /></div>
  }

  private getMessageComponent(message: ChatMessage, index: number) {
    return <div key={"chat-message" + index} className={"chat-message " + (message.own ? "chat-message-own" : "chat-message-another")}>
      {message.text}
    </div>
  }
}

export default Chat;