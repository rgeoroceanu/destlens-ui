import React from 'react';
import './App.css';
import {ThemeProvider} from "@mui/material";
import {theme} from './theme/Theme'
import Header from "./common/component/header/Header";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import TripSearchDestination from "./wizard/page/trip-search-destination/TripSearchDestination";
import TripSearchTerms from "./wizard/page/trip-search-terms/TripSearchTerms";
import TripSearchTags from "./wizard/page/trip-search-tags/TripSearchTags";
import TripSearchHistory from "./wizard/page/trip-search-history/TripSearchHistory";
import TripSearchResults from "./wizard/page/trip-search-results/TripSearchResults";

function App() {
  return (
    <ThemeProvider theme={theme} >
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TripSearchDestination />} />
          <Route path="/trip-search-terms" element={<TripSearchTerms />} />
          <Route path="/trip-search-tags" element={<TripSearchTags />} />
          <Route path="/trip-search-history" element={<TripSearchHistory />} />
          <Route path="/trip-search-results" element={<TripSearchResults />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
);
}

export default App;
