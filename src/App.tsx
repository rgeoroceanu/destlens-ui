import React from 'react';
import './App.css';
import {ThemeProvider} from "@mui/material";
import {theme} from './theme/Theme'
import Header from "./component/header/Header";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import TripSearchResults from "./page/trip-search-results/TripSearchResults";
import TripSearchAssistant from "./page/trip-search-assistant/TripSearchAssistant";

function App() {
  return (
    <ThemeProvider theme={theme} >
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TripSearchAssistant />} />
          <Route path="/trip-search-results" element={<TripSearchResults />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
);
}

export default App;
