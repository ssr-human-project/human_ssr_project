import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';

export function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-10 h-[70px] flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="font-bold text-2xl text-[#ff6b33]">꼬리살랑</span>
        </a>

        {/* Conditional Buttons */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-[#ff6b33] font-medium"
                onClick={() => navigate('/mypage')}
              >
                <User className="h-5 w-5 mr-2" />
                내정보
              </Button>
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-[#ff6b33] font-medium"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-[#ff6b33] font-medium"
                onClick={() => navigate('/login')}
              >
                로그인
              </Button>
              <Button
                className="bg-[#ff6b33] hover:bg-[#ff5722] text-white font-medium"
                onClick={() => navigate('/signup')}
              >
                회원가입
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
