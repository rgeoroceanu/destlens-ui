import React from 'react';
import './App.css';
import {ThemeProvider} from "@mui/material";
import {theme} from './theme/Theme'
import Header from "./component/header/Header";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import TripSearchResults from "./page/trip-search-results/TripSearchResults";
import TripSearchAssistant from "./page/trip-search-assistant/TripSearchAssistant";
import {registerLocale} from "react-datepicker";
import de from 'date-fns/locale/de';
import ro from 'date-fns/locale/ro';

export const SUPPORTED_LOCALES = ["de", "ro", "en"]

function App() {
  if (navigator.language.split('-')[0] === 'de') {
    registerLocale('de', de);
  } else if (navigator.language.split('-')[0] === 'ro') {
    registerLocale('ro', ro);
  }

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
