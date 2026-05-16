import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 공통 컴포넌트 (첫 번째 코드 기준)
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// 메인 페이지 섹션 (첫 번째 코드 기준)
import HeroSection from "./components/section/HeroSection";
import PopularRegions from "./components/section/PopularRegions";
import CommunitySection from "./components/section/CommunitySection";

// 추가된 기능 컴포넌트 (두 번째 코드에서 가져옴)
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import ReviewList from './components/community/ReviewList';
import WriteReview from './components/community/WriteReview';
import Review from './components/community/Review';
import PostList from './components/community/PostList';
import Post from './components/community/Post';
import WritePost from './components/community/WritePost';
import PetsitterList from './components/community/PetsitterList';
import Petsitter from './components/community/Petsitter';
import WritePetsitter from './components/community/WritePetsitter';
import Board from './components/community/Board';
import EditPetsitter from './components/community/EditPetsitter';
// 스타일 시트 (첫 번째 코드 기준 유지)
import "./styles/index.css";
import "./styles/layout/Header.css";
import "./styles/section/HeroSection.css";
import "./styles/section/PopularRegions.css";
import "./styles/section/CommunitySection.css";
import "./styles/layout/Footer.css";
//import "./App.css"; // 두 번째 코드의 기본 스타일이 필요할 경우 추가

function App() {
  return (
    <BrowserRouter>
      <div>
        {/* 첫 번째 코드의 레이아웃: 헤더는 항상 상단에 */}
        <Header />

        <Routes>
          {/* 메인 루트(/): 첫 번째 코드의 메인 구성을 그대로 유지 */}
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

          {/* 리뷰 게시판 확장 */}
          <Route path="/reviews" element={<ReviewList />} />
          <Route path="/reviews/:id" element={<Review />} />
          <Route path="/write-review" element={<WriteReview />} />

          {/* 자유 게시판 확장 */}
          <Route path="/posts" element={<PostList />} />
          <Route path="/posts/:id" element={<Post />} />
          <Route path="/write-post" element={<WritePost />} />

          {/* 펫시터 게시판 확장 */}
          <Route path="/petsitters" element={<PetsitterList />} />
          <Route path="/petsitters/:id" element={<Petsitter />} />
          <Route path="/write-petsitter" element={<WritePetsitter />} />
          <Route path="/edit-petsitter/:id" element={<EditPetsitter />} />


          {/* 게시판 전체 목록 */}
          <Route path="/boards" element={<Board />} />

          {/* 정의되지 않은 경로는 메인으로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* 첫 번째 코드의 레이아웃: 푸터는 항상 하단에 */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;