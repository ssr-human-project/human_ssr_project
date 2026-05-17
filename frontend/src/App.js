import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";

// 공통 컴포넌트
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// 메인 페이지 섹션
import HeroSection from "./components/section/HeroSection";
import PopularRegions from "./components/section/PopularRegions";
import CommunitySection from "./components/section/CommunitySection";

// 기능 컴포넌트
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import MyPage from "./components/pages/MyPage";
import ReviewList from "./components/community/ReviewList";
import WriteReview from "./components/community/WriteReview";
import Review from "./components/community/Review";
import PostList from "./components/community/PostList";
import Post from "./components/community/Post";
import WritePost from "./components/community/WritePost";
import PetsitterList from "./components/community/PetsitterList";
import Petsitter from "./components/community/Petsitter";
import WritePetsitter from "./components/community/WritePetsitter";
import Board from "./components/community/Board";
import EditPetsitter from "./components/community/EditPetsitter";
import EditReview from "./components/community/EditReview";
import EditPost from "./components/community/EditPost";
import CafeDetail from "./components/cafes/Cafedetail";
import CafeList from "./components/cafes/Cafelistitem";
import SearchResults from "./components/cafes/Searchresults";

// 스타일 시트
import "./styles/index.css";
import "./styles/layout/Header.css";
import "./styles/section/HeroSection.css";
import "./styles/section/PopularRegions.css";
import "./styles/section/CommunitySection.css";
import "./styles/layout/Footer.css";

function App() {
  return (
    // 💡 AuthProvider 차단막을 모두 제거하고 브라우저 라우터가 최상단으로 오도록 수정했습니다.
    <BrowserRouter>
      <div>
        <Header />

        <Routes>
          {/* 메인 루트(/) */}
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

          {/* 인증 관련 */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mypage" element={<MyPage />} />

          {/* 리뷰 게시판 확장 */}
          <Route path="/reviews" element={<ReviewList />} />
          <Route path="/reviews/:id" element={<Review />} />
          <Route path="/write-review" element={<WriteReview />} />
          <Route path="/edit-Review/:id" element={<EditReview />} />

          {/* 자유 게시판 확장 */}
          <Route path="/posts" element={<PostList />} />
          <Route path="/posts/:id" element={<Post />} />
          <Route path="/write-post" element={<WritePost />} />
          <Route path="/edit-post/:id" element={<EditPost />} />

          {/* 펫시터 게시판 확장 */}
          <Route path="/petsitters" element={<PetsitterList />} />
          <Route path="/petsitters/:id" element={<Petsitter />} />
          <Route path="/write-petsitter" element={<WritePetsitter />} />
          <Route path="/edit-petsitter/:id" element={<EditPetsitter />} />

          {/* 게시판 전체 목록 */}
          <Route path="/boards" element={<Board />} />

          {/* 카페 관련 라우트 */}
          <Route path="/cafes" element={<SearchResults />} />
          <Route path="/cafes/:id" element={<CafeDetail />} />

          {/* 정의되지 않은 경로는 메인으로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
