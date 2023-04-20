import React, {Component} from 'react';
import './Chat.css';
import ChatMessage from "../../model/ChatMessage";
import TextField from "@mui/material/TextField";
import {Refresh, Send, SkipNext} from "@mui/icons-material";
import {TypeAnimation} from "react-type-animation";
import {Button, IconButton} from "@mui/material";
import {withTranslation} from "react-i18next";
import ChatMessageRole from "../../model/ChatMessageRole";

class Chat extends Component<any, any> {

  render() {
    const { t } = this.props;
    const component = this.props.inputComponent ? this.props.inputComponent : this.getDefaultInputComponent();
    const loading = this.props.loading ? this.props.loading : false;
    const sendClickListener = this.props.sendClickListener ? this.props.sendClickListener : undefined;
    const restartClickListener = this.props.restartClickListener ? this.props.restartClickListener : undefined;
    const skipClickListener = this.props.skipClickListener ? this.props.skipClickListener : undefined;
    const skipButtonVisible = this.props.skipButtonVisible;
    return (
      <div className={"chat-wrapper"}>
        { this.getMessagesComponent(this.props.thread.messages, loading) }
        {
          <div className={"chat-state-buttons-wrapper"}>
            { restartClickListener ? <Button onClick={restartClickListener}
                                             color="primary"
                                             className={"chat-state-button"}
                                             variant="outlined"
                                             startIcon={<Refresh />}>
              <span className={"chat-state-button-label"}>{t('general.restart')}</span>
            </Button> : null }
            { skipClickListener && skipButtonVisible ? <Button onClick={skipClickListener}
                                              color="primary"
                                              className={"chat-state-button"}
                                              variant="outlined"
                                              startIcon={<SkipNext />}>
              <span className={"chat-state-button-label"}>{t('general.skip')}</span>
            </Button> : null }
          </div>
        }
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

  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
    const messagesWrapper = document.getElementById("chat-messages");
    if (messagesWrapper) {
      messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
    }
  }

  private getDefaultInputComponent() {
    return <TextField className={"chat-write-field"}></TextField>;
  }

  private getMessagesComponent(messages: ChatMessage[], loading: boolean) {
    const messsageComponents = messages.map((m, i) => this.getMessageComponent(m, i));
    return <div id="chat-messages" className={"chat-messages"}>
      { messsageComponents }
      { loading ? this.getTypingAnimation() : null}
    </div>;
  }

  private getTypingAnimation() {
    return <TypeAnimation
      sequence={['.  ', 100, '.. ', 200, '...', 400, () => {}]}
      wrapper="div"
      cursor={false}
      repeat={Infinity}
      className={"chat-loading"}
      style={{ textAlign: 'right', fontSize: '1.5em' }}
    />;
  }

  private getMessageComponent(message: ChatMessage, index: number) {
    return <div id={"chat-message-" + index}
                key={"chat-message-" + index}
                className={"chat-message " + (message.role === ChatMessageRole.user ? "chat-message-own" : "chat-message-another")}>
      {message.content}
    </div>
  }
}

export default withTranslation()(Chat);