import React, { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRouter from "./routes/AppRouter";

import "./styles/index.css";
import "./styles/layout/Header.css";
import "./styles/section/HeroSection.css";
import "./styles/section/PopularRegions.css";
import "./styles/section/CommunitySection.css";
import "./styles/layout/Footer.css";

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname, search]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
