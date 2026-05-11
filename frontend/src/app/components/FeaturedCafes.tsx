import { motion } from 'motion/react';
import { Star, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { useState } from 'react';

const cafes = [
  {
    id: 1,
    name: '더펀팀',
    rating: 4.8,
    reviews: 245,
    price: '15,000원',
    image: 'https://images.unsplash.com/photo-1601758004484-733647916908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    badge: '최고 인기',
    badgeColor: 'bg-[#ff6b33]',
    location: '서울 강남구',
  },
  {
    id: 2,
    name: '댕댕이카페',
    rating: 4.7,
    reviews: 189,
    price: '12,000원',
    image: 'https://images.unsplash.com/photo-1536783006430-a4134d1c4748?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    badge: '감성적',
    badgeColor: 'bg-[#ff6b33]',
    location: '서울 홍대',
  },
  {
    id: 3,
    name: '반려견천국',
    rating: 4.9,
    reviews: 312,
    price: '18,000원',
    image: 'https://images.unsplash.com/photo-1712746438528-f725ba394f10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    badge: '최신',
    badgeColor: 'bg-[#ff6b33]',
    location: '경기 성남시',
  },
];

export function FeaturedCafes() {
  const [likedCafes, setLikedCafes] = useState<Set<number>>(new Set());

  const toggleLike = (cafeId: number) => {
    setLikedCafes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cafeId)) {
        newSet.delete(cafeId);
      } else {
        newSet.add(cafeId);
      }
      return newSet;
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">추천 카페</h2>
          <p className="text-gray-500">반려견 친화적인 프리미엄 카페</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cafes.map((cafe, index) => (
            <motion.div
              key={cafe.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={cafe.image}
                    alt={cafe.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${cafe.badgeColor} text-white border-0`}>
                      {cafe.badge}
                    </Badge>
                  </div>
                  <button
                    onClick={() => toggleLike(cafe.id)}
                    className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        likedCafes.has(cafe.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{cafe.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{cafe.location}</p>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-gray-900">{cafe.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({cafe.reviews})</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-[#ff6b33]">{cafe.price} ~</span>
                  </div>

                  <Button className="w-full bg-[#ff6b33] hover:bg-[#ff5722] text-white font-semibold">
                    예약하기
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
