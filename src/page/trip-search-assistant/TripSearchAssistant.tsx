import React, {Component} from 'react';
import './TripSearchAssistant.css';
import TripSearch from "../../model/TripSearch";
import withRouter from "../../helper/WithRouter";
import ChatThread from "../../model/ChatThread";
import Chat from "../../component/chat/Chat";
import {Container} from "@mui/material";

class TripSearchAssistant extends Component<any, any> {

  constructor(props: any) {
    super(props);
    const tripSearch = props.location?.state?.tripSearch;
    const chatThread = props.location?.state?.chatThread ? props.location?.state?.chatThread : new ChatThread();
    chatThread.messages = [
      {
        text: 'Test message',
        own: false,

      },
      {
        text: 'Munich',
        own: true
      }
    ];
    this.state = {
      tripSearch: tripSearch ? tripSearch : new TripSearch(),
      thread: chatThread
    };
  }

  render() {
    return (
      <Container className={"content-wrapper"}>
        <Chat thread={this.state.thread}></Chat>
      </Container>
    );
  }
}

export default withRouter(TripSearchAssistant);
