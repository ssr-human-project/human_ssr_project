<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import PopularRegions from "./components/PopularRegions";
import CommunitySection from "./components/CommunitySection";
import Footer from "./components/Footer";

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
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
=======
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  return (
    // 1. 모든 것의 가장 바깥은 반드시 <Router>여야 합니다!
    <Router>
      <div className="App">
        <Routes>
          {/* 2. 각 주소(path)에 맞는 컴포넌트를 연결합니다. */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
>>>>>>> 0b06cbba7af6b2673f81d78f60f827529c9d0f15
  );
}

export default App;