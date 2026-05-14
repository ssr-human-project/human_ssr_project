import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import PopularRegions from "./components/PopularRegions";
import CommunitySection from "./components/CommunitySection";
import Footer from "./components/Footer";

import Login from "./components/Login";
import Signup from "./components/Signup";

import "./styles/index.css";
import "./styles/Header.css";
import "./styles/HeroSection.css";
import "./styles/PopularRegions.css";
import "./styles/CommunitySection.css";
import "./styles/Footer.css";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <PopularRegions />
                <CommunitySection />
              </>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;