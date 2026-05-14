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
import MyPage from "./components/MyPage";

// ✨ 인증 확인용 컴포넌트
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ✨ 마이페이지는 로그인한 사람만 들어갈 수 있게 보호 */}
          <Route
            path="/mypage"
            element={
              <PrivateRoute>
                <MyPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
>>>>>>> 0b06cbba7af6b2673f81d78f60f827529c9d0f15
  );
}

export default App;