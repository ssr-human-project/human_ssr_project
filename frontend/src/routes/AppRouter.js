import { Routes, Route, Navigate } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import HeroSection from "../components/section/HeroSection";
import PopularRegions from "../components/section/PopularRegions";
import CommunitySection from "../components/section/CommunitySection";

import Login from "../components/pages/Login";
import Signup from "../components/pages/Signup";
import MyPage from "../components/pages/MyPage";
import ReviewList from "../components/community/ReviewList";
import WriteReview from "../components/community/WriteReview";
import Review from "../components/community/Review";
import PostList from "../components/community/PostList";
import Post from "../components/community/Post";
import WritePost from "../components/community/WritePost";
import PetsitterList from "../components/community/PetsitterList";
import Petsitter from "../components/community/Petsitter";
import WritePetsitter from "../components/community/WritePetsitter";
import Board from "../components/community/Board";
import EditPetsitter from "../components/community/EditPetsitter";
import EditReview from "../components/community/EditReview";
import EditPost from "../components/community/EditPost";
import CafeDetail from "../components/cafes/Cafedetail";
import SearchResults from "../components/cafes/Searchresults";

function AppRouter() {
  return (
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
        <Route path="/mypage" element={<MyPage />} />

        <Route path="/reviews" element={<ReviewList />} />
        <Route path="/reviews/:id" element={<Review />} />
        <Route path="/write-review" element={<WriteReview />} />
        <Route path="/edit-Review/:id" element={<EditReview />} />

        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/:id" element={<Post />} />
        <Route path="/write-post" element={<WritePost />} />
        <Route path="/edit-post/:id" element={<EditPost />} />

        <Route path="/petsitters" element={<PetsitterList />} />
        <Route path="/petsitters/:id" element={<Petsitter />} />
        <Route path="/write-petsitter" element={<WritePetsitter />} />
        <Route path="/edit-petsitter/:id" element={<EditPetsitter />} />

        <Route path="/boards" element={<Board />} />

        <Route path="/cafes" element={<SearchResults />} />
        <Route path="/cafes/:id" element={<CafeDetail />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default AppRouter;
