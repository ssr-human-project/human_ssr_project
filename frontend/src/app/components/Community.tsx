import { useNavigate } from 'react-router';
import { MessageCircle, Users, Star } from 'lucide-react';

const categories = [
  {
    id: 1,
    name: '자유게시판',
    icon: MessageCircle,
    color: 'bg-gradient-to-br from-blue-400 to-blue-600',
    description: '자유롭게 소통하는 공간',
  },
  {
    id: 2,
    name: '펫시터',
    icon: Users,
    color: 'bg-gradient-to-br from-green-400 to-green-600',
    description: '믿을 수 있는 펫시터 찾기',
  },
  {
    id: 3,
    name: '리뷰',
    icon: Star,
    color: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    description: '카페 방문 후기 공유',
  },
];

export function Community() {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">커뮤니티</h2>
          <p className="text-gray-500 text-sm">반려견과 함께하는 일상을 공유하세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => navigate('/community')}
                className="group flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className={`w-24 h-24 rounded-full ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-12 h-12 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">{category.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
