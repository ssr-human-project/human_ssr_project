import { Routes, Route } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import HeroSection from "../components/section/HeroSection";
import PopularRegions from "../components/section/PopularRegions";
import CommunitySection from "../components/section/CommunitySection";

import Login from "../components/pages/Login";
import Signup from "../components/pages/Signup";
import MyPage from "../components/pages/MyPage";

function AppRouter() {
  return (
    <>
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
        <Route path="/mypage" element={<MyPage />} />
      </Routes>

      <Footer />
    </>
  );
}

export default AppRouter;