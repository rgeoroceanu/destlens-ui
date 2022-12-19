import React from 'react';
import './App.css';
import {ThemeProvider} from "@mui/material";
import {theme} from './theme/Theme'
import Header from "./common/component/header/Header";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import TripSearchWizard from "./wizard/page/trip-search-wizard/TripSearchWizard";

function App() {
  return (
    <ThemeProvider theme={theme} >
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TripSearchWizard />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
);
}

export default App;
