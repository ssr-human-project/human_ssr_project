import { Star, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const reviews = [
  {
    id: 1,
    cafeName: '더펀팀',
    location: '서울 강남구',
    rating: 5,
    date: '2026-05-05',
    content: '정말 좋았어요! 직원분들도 친절하시고 우리 뭉치도 너무 좋아했어요. 다음에 또 방문할게요.',
    images: ['https://images.unsplash.com/photo-1601758004484-733647916908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'],
  },
  {
    id: 2,
    cafeName: '댕댕이카페',
    location: '서울 홍대',
    rating: 4,
    date: '2026-05-01',
    content: '분위기 좋고 커피도 맛있어요. 강아지 놀이공간이 넓어서 좋았습니다.',
    images: [],
  },
  {
    id: 3,
    cafeName: '반려견천국',
    location: '경기 성남시',
    rating: 5,
    date: '2026-04-28',
    content: '최고의 애견카페! 시설도 깨끗하고 강아지 간식도 제공되어서 만족스러웠어요.',
    images: ['https://images.unsplash.com/photo-1712746438528-f725ba394f10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'],
  },
];

export function MyReviews() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">내가 작성한 리뷰</h2>

      {reviews.length === 0 ? (
        <div className="text-center py-20">
          <Star className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">작성한 리뷰가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold mb-1">{review.cafeName}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{review.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{review.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 mb-4">{review.content}</p>

                {review.images.length > 0 && (
                  <div className="flex gap-2">
                    {review.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Review ${idx + 1}`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
