import { MessageCircle, Eye, Calendar } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

const posts = [
  {
    id: 1,
    category: '자유게시판',
    title: '강남 애견카페 추천해주세요!',
    content: '이번 주말에 반려견과 함께 갈 카페를 찾고 있어요. 주차가 편한 곳으로 추천 부탁드립니다.',
    date: '2026-05-07',
    views: 124,
    comments: 8,
  },
  {
    id: 2,
    category: '펫시터',
    title: '주말 펫시터 구합니다',
    content: '5월 10일~11일 양일간 소형견 돌봐주실 분 구합니다. 경험 많으신 분 우대해요.',
    date: '2026-05-05',
    views: 89,
    comments: 5,
  },
  {
    id: 3,
    category: '리뷰',
    title: '홍대 댕댕이카페 다녀왔어요',
    content: '분위기도 좋고 직원분들도 친절하셨어요. 강아지 간식도 제공되고 만족스러웠습니다.',
    date: '2026-05-03',
    views: 256,
    comments: 15,
  },
];

const categoryColors: Record<string, string> = {
  자유게시판: 'bg-blue-100 text-blue-700',
  펫시터: 'bg-green-100 text-green-700',
  리뷰: 'bg-orange-100 text-orange-700',
};

export function MyPosts() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">내가 쓴 글</h2>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">작성한 게시물이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge className={categoryColors[post.category]}>
                    {post.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-2 hover:text-[#ff6b33] transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {post.content}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
