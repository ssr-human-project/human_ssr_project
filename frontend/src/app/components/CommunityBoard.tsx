import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MessageCircle, Eye, Clock, Search, Pencil } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

type Category = 'all' | 'free' | 'petsitter' | 'review';

interface Post {
  id: number;
  category: Category;
  title: string;
  content: string;
  author: string;
  authorProfile: string;
  date: string;
  views: number;
  comments: number;
  image?: string;
  location?: string;
}

const categories = [
  { id: 'all' as Category, label: '전체' },
  { id: 'free' as Category, label: '자유게시판' },
  { id: 'petsitter' as Category, label: '펫시터 모집' },
  { id: 'review' as Category, label: '리뷰' },
];

const posts: Post[] = [
  {
    id: 1,
    category: 'free',
    title: '강남 애견카페 추천해주세요!',
    content: '이번 주말에 반려견과 함께 갈 카페를 찾고 있어요. 주차가 편한 곳으로 추천 부탁드립니다. 소형견이라 실내가 넓은 곳이면 좋겠어요.',
    author: '강아지집사',
    authorProfile: '🐕',
    date: '1시간 전',
    views: 124,
    comments: 8,
    location: '강남구',
  },
  {
    id: 2,
    category: 'petsitter',
    title: '주말 펫시터 구합니다',
    content: '5월 10일~11일 양일간 소형견 돌봐주실 분 구합니다. 경험 많으신 분 우대해요.',
    author: '뽀삐엄마',
    authorProfile: '🐶',
    date: '2시간 전',
    views: 89,
    comments: 5,
    location: '서초구',
  },
  {
    id: 3,
    category: 'review',
    title: '홍대 댕댕이카페 다녀왔어요 ⭐⭐⭐⭐⭐',
    content: '분위기도 좋고 직원분들도 친절하셨어요. 강아지 간식도 제공되고 만족스러웠습니다.',
    author: '멍멍이',
    authorProfile: '🦮',
    date: '3시간 전',
    views: 256,
    comments: 15,
    image: 'https://images.unsplash.com/photo-1601758004484-733647916908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
    location: '마포구',
  },
  {
    id: 4,
    category: 'free',
    title: '강아지 훈련 팁 공유합니다',
    content: '반려견 훈련에 도움되는 팁들을 공유합니다. 특히 산책 훈련에 효과적이에요!',
    author: '훈련왕',
    authorProfile: '🐕‍🦺',
    date: '5시간 전',
    views: 342,
    comments: 23,
    location: '송파구',
  },
  {
    id: 5,
    category: 'petsitter',
    title: '평일 낮시간 펫시터 구해요',
    content: '월~금 오전 10시부터 오후 3시까지 중형견 돌봐주실 분 찾습니다. 장기로 부탁드려요.',
    author: '골든러버',
    authorProfile: '🦴',
    date: '6시간 전',
    views: 156,
    comments: 12,
    location: '강동구',
  },
  {
    id: 6,
    category: 'review',
    title: '제주 애견동반 카페 후기',
    content: '제주도 여행 중 들른 애견카페 너무 좋았어요. 바다뷰에 강아지 놀이터까지!',
    author: '제주갈래',
    authorProfile: '🌴',
    date: '1일 전',
    views: 489,
    comments: 28,
    image: 'https://images.unsplash.com/photo-1712746438528-f725ba394f10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
    location: '제주시',
  },
];

export function CommunityBoard() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryLabel = (category: Category) => {
    const cat = categories.find((c) => c.id === category);
    return cat?.label || '';
  };

  const getCategoryColor = (category: Category) => {
    const colors = {
      free: 'bg-blue-100 text-blue-700',
      petsitter: 'bg-green-100 text-green-700',
      review: 'bg-orange-100 text-orange-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Categories */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden sticky top-24">
              <div className="p-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                <h2 className="text-xl font-bold">커뮤니티</h2>
              </div>

              <nav className="p-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all font-medium ${
                      activeCategory === category.id
                        ? 'bg-[#ff6b33] text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </nav>

              <div className="p-4 border-t">
                <Button
                  className="w-full bg-[#ff6b33] hover:bg-[#ff5722] text-white"
                  onClick={() => navigate('/community/write')}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  글쓰기
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="게시글 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-gray-50 border-0"
                />
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                  <p className="text-gray-500">게시글이 없습니다.</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/community/${post.id}`)}
                    className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="flex gap-4">
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getCategoryColor(post.category)}>
                            {getCategoryLabel(post.category)}
                          </Badge>
                          {post.location && (
                            <span className="text-sm text-gray-500">{post.location}</span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold mb-2 text-gray-900 hover:text-[#ff6b33] transition-colors">
                          {post.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {post.content}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{post.authorProfile}</span>
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{post.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                      </div>

                      {/* Thumbnail */}
                      {post.image && (
                        <div className="w-24 h-24 flex-shrink-0">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
