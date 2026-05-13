import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ReviewList from './components/ReviewList';
import WriteReview from './components/WriteReview';
import Review from './components/Review'; // 1. 이 줄을 반드시 추가하세요! (Review.js 파일이 있는 경우)

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reviews" element={<ReviewList />} />
          <Route path="/write-review" element={<WriteReview />} />

          {/* 2. 상세 페이지 연결 - Review 컴포넌트가 위에서 import 되어야 작동합니다 */}
          <Route path="/reviews/:id" element={<Review />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

