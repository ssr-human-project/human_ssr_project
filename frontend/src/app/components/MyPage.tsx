import { useState } from 'react';
import { User, Heart, FileText, Star } from 'lucide-react';
import { MyProfile } from './mypage/MyProfile';
import { MyFavorites } from './mypage/MyFavorites';
import { MyPosts } from './mypage/MyPosts';
import { MyReviews } from './mypage/MyReviews';

type MenuType = 'profile' | 'favorites' | 'posts' | 'reviews';

const menuItems = [
  { id: 'profile' as MenuType, label: '내정보', icon: User },
  { id: 'favorites' as MenuType, label: '찜목록', icon: Heart },
  { id: 'posts' as MenuType, label: '내 게시물', icon: FileText },
  { id: 'reviews' as MenuType, label: '리뷰', icon: Star },
];

export function MyPage() {
  const [activeMenu, setActiveMenu] = useState<MenuType>('profile');

  const renderContent = () => {
    switch (activeMenu) {
      case 'profile':
        return <MyProfile />;
      case 'favorites':
        return <MyFavorites />;
      case 'posts':
        return <MyPosts />;
      case 'reviews':
        return <MyReviews />;
      default:
        return <MyProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-10 py-12">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden sticky top-24">
              <div className="p-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                <h2 className="text-xl font-bold">마이페이지</h2>
              </div>

              <nav className="p-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                        isActive
                          ? 'bg-[#ff6b33] text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <span className="ml-auto text-white">›</span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white rounded-2xl shadow-md p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
