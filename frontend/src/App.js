<<<<<<< HEAD
import React from "react";
=======
>>>>>>> d51c9638d47420810ad33e5d6459fe0db79d2b57
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
<<<<<<< HEAD
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
=======

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
>>>>>>> d51c9638d47420810ad33e5d6459fe0db79d2b57
        </Routes>
      </div>
    </Router>
  );
}

export default App;
<<<<<<< HEAD

=======
>>>>>>> d51c9638d47420810ad33e5d6459fe0db79d2b57
