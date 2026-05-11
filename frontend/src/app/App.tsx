import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { MyPage } from './components/MyPage';
import { CommunityBoard } from './components/CommunityBoard';
import { CommunityDetail } from './components/CommunityDetail';
import { CommunityWrite } from './components/CommunityWrite';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Layout with Header and Footer */}
          <Route
            path="/"
            element={
              <div className="min-h-screen bg-white">
                <Header />
                <HomePage />
                <Footer />
              </div>
            }
          />

          {/* MyPage with Header */}
          <Route
            path="/mypage"
            element={
              <div className="min-h-screen bg-white">
                <Header />
                <MyPage />
              </div>
            }
          />

          {/* Community Pages with Header */}
          <Route
            path="/community"
            element={
              <div className="min-h-screen bg-white">
                <Header />
                <CommunityBoard />
              </div>
            }
          />

          <Route
            path="/community/write"
            element={
              <div className="min-h-screen bg-white">
                <Header />
                <CommunityWrite />
              </div>
            }
          />

          <Route
            path="/community/:id"
            element={
              <div className="min-h-screen bg-white">
                <Header />
                <CommunityDetail />
              </div>
            }
          />

          {/* Auth Pages without Header/Footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
