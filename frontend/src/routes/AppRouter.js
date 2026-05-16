import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import HeroSection from "../components/section/HeroSection";
import PopularRegions from "../components/section/PopularRegions";
import CommunitySection from "../components/section/CommunitySection";

import Login from "../components/pages/Login";
import Signup from "../components/pages/Signup";
import MyPage from "../components/pages/MyPage";

import PostList from "../components/community/PostList";
import Post from "../components/community/Post";
import ReviewList from "../components/community/ReviewList";
import Review from "../components/community/Review";
import PetsitterList from "../components/community/PetsitterList";

import WritePost from "../components/pages/community/WritePost";
import WriteReview from "../components/pages/community/WriteReview";
import WritePetsitter from "../components/pages/community/WritePetsitter";

import Petsitter from "../components/community/Petsitter";
import Board from "../components/community/Board";
import EditPetsitter from "../components/community/EditPetsitter";

function MainPage() {
  return (
    <>
      <HeroSection />
      <PopularRegions />
      <CommunitySection />
    </>
  );
}

function AppRouter() {
  return (
    <>
      <Header />

      <Routes>
        {/* 메인 */}
        <Route path="/" element={<MainPage />} />
        {/* 회원 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mypage" element={<MyPage />} />
        {/* 커뮤니티 - 자유게시판 */}
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/:id" element={<Post />} />
        <Route path="/posts/write" element={<WritePost />} />
        {/* 커뮤니티 - 리뷰 */}
        <Route path="/reviews" element={<ReviewList />} />
        <Route path="/reviews/:id" element={<Review />} />
        <Route path="/reviews/write" element={<WriteReview />} />
        {/* 커뮤니티 - 펫시터 */}
        <Route path="/petsitters" element={<PetsitterList />} />
        <Route path="/petsitters/:id" element={<Petsitter />} />{" "}
        <Route path="/petsitters/write" element={<WritePetsitter />} />

        <Route path="/write-review" element={<WriteReview />} />
        <Route path="/write-post" element={<WritePost />} />
        <Route path="/write-petsitter" element={<WritePetsitter />} />
        <Route path="/edit-petsitter/:id" element={<EditPetsitter />} />
        <Route path="/boards" element={<Board />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer />
    </>
  );
}

export default AppRouter;
