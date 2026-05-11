import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Eye, Clock, MessageCircle, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';

interface Comment {
  id: number;
  author: string;
  authorProfile: string;
  content: string;
  date: string;
}

// Mock data
const postData: Record<string, any> = {
  '1': {
    id: 1,
    category: 'free',
    categoryLabel: '자유게시판',
    title: '강남 애견카페 추천해주세요!',
    content: `이번 주말에 반려견과 함께 갈 카페를 찾고 있어요. 주차가 편한 곳으로 추천 부탁드립니다.

소형견이라 실내가 넓은 곳이면 좋겠어요. 강아지가 다른 친구들이랑 잘 놀 수 있는 환경이면 더욱 좋습니다!

강남역 근처나 신논현 쪽으로 추천 부탁드려요.`,
    author: '강아지집사',
    authorProfile: '🐕',
    date: '2026-05-11 10:30',
    views: 124,
    location: '강남구',
    hasComments: true,
  },
  '2': {
    id: 2,
    category: 'petsitter',
    categoryLabel: '펫시터 모집',
    title: '주말 펫시터 구합니다',
    content: `5월 10일~11일 양일간 소형견 돌봐주실 분 구합니다.

우리 뽀삐는 3살 포메라니안 여아입니다.
사람을 좋아하고 순한 편이에요.

경험 많으신 분 우대하며, 서초구 방배동 근처에 계신 분이면 좋겠습니다.
비용은 협의 가능합니다.`,
    author: '뽀삐엄마',
    authorProfile: '🐶',
    date: '2026-05-11 09:15',
    views: 89,
    location: '서초구',
    hasComments: true,
  },
  '3': {
    id: 3,
    category: 'review',
    categoryLabel: '리뷰',
    title: '홍대 댕댕이카페 다녀왔어요 ⭐⭐⭐⭐⭐',
    content: `홍대에 새로 생긴 애견카페 다녀왔어요!

분위기도 좋고 직원분들도 정말 친절하셨어요.
강아지 간식도 무료로 제공되고, 놀이기구도 다양해서 우리 멍멍이가 너무 좋아했어요.

커피 맛도 괜찮고, 인테리어도 깔끔해서 사진 찍기 좋았습니다.
다음에 또 방문할 예정이에요!

가격: 1인 15,000원 (음료 포함)
주차: 건물 뒷편 유료주차장 이용 가능`,
    author: '멍멍이',
    authorProfile: '🦮',
    date: '2026-05-11 08:00',
    views: 256,
    location: '마포구',
    image: 'https://images.unsplash.com/photo-1601758004484-733647916908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    hasComments: false,
  },
};

const mockComments: Record<number, Comment[]> = {
  1: [
    {
      id: 1,
      author: '카페러버',
      authorProfile: '☕',
      content: '더펀팀 추천드려요! 주차도 편하고 분위기 좋아요.',
      date: '30분 전',
    },
    {
      id: 2,
      author: '강아지천사',
      authorProfile: '😇',
      content: '신논현역 근처 댕댕이파크 어때요? 실내 넓고 좋아요!',
      date: '20분 전',
    },
    {
      id: 3,
      author: '멍멍파파',
      authorProfile: '👨',
      content: '강남 쪽은 주차가 좀 어려울 수 있어요. 평일 가시는 걸 추천드려요.',
      date: '10분 전',
    },
  ],
  2: [
    {
      id: 1,
      author: '펫시터경력5년',
      authorProfile: '⭐',
      content: '경력 5년차 펫시터입니다. 쪽지 보냈어요!',
      date: '1시간 전',
    },
    {
      id: 2,
      author: '동물사랑',
      authorProfile: '❤️',
      content: '방배동 거주중이에요. 관심 있습니다!',
      date: '40분 전',
    },
  ],
};

export function CommunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>(mockComments[Number(id)] || []);

  const post = postData[id || '1'];

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: comments.length + 1,
      author: '나',
      authorProfile: '👤',
      content: commentText,
      date: '방금',
    };

    setComments([...comments, newComment]);
    setCommentText('');
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      free: 'bg-blue-100 text-blue-700',
      petsitter: 'bg-green-100 text-green-700',
      review: 'bg-orange-100 text-orange-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[900px] mx-auto px-6 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/community')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          목록으로
        </Button>

        {/* Post Content */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Badge className={getCategoryColor(post.category)}>
                {post.categoryLabel}
              </Badge>
              {post.location && (
                <span className="text-sm text-gray-500">{post.location}</span>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-6 text-gray-900">{post.title}</h1>

            {/* Author Info */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center text-2xl">
                  {post.authorProfile}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{post.author}</p>
                  <p className="text-sm text-gray-500">{post.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views}</span>
                </div>
                {post.hasComments && (
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{comments.length}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 whitespace-pre-line text-base leading-relaxed">
                {post.content}
              </p>
            </div>

            {/* Image */}
            {post.image && (
              <div className="mb-6">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        {post.hasComments && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                댓글 {comments.length}
              </h2>

              {/* Comment Input */}
              <div className="mb-8 bg-gray-50 rounded-lg p-4">
                <Textarea
                  placeholder="댓글을 입력하세요..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="mb-3 bg-white"
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim()}
                    className="bg-[#ff6b33] hover:bg-[#ff5722]"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    댓글 작성
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center flex-shrink-0 text-lg">
                      {comment.authorProfile}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">
                          {comment.author}
                        </span>
                        <span className="text-sm text-gray-500">{comment.date}</span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
