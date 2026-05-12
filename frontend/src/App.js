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
  );
}

export default App;
