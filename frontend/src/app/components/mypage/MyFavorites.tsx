import { Heart, MapPin } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const favorites = [
  {
    id: 1,
    name: '더펀팀',
    location: '서울 강남구',
    image: 'https://images.unsplash.com/photo-1601758004484-733647916908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    rating: 4.8,
    price: '15,000원',
  },
  {
    id: 2,
    name: '댕댕이카페',
    location: '서울 홍대',
    image: 'https://images.unsplash.com/photo-1536783006430-a4134d1c4748?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    rating: 4.7,
    price: '12,000원',
  },
  {
    id: 3,
    name: '반려견천국',
    location: '경기 성남시',
    image: 'https://images.unsplash.com/photo-1712746438528-f725ba394f10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    rating: 4.9,
    price: '18,000원',
  },
];

export function MyFavorites() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">찜한 카페</h2>

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">찜한 카페가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((cafe) => (
            <Card key={cafe.id} className="overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={cafe.image}
                  alt={cafe.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                  <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                </button>
              </div>

              <CardContent className="p-5">
                <h3 className="text-lg font-bold mb-2">{cafe.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <MapPin className="h-4 w-4" />
                  <span>{cafe.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-500 text-sm">⭐ {cafe.rating}</span>
                  <span className="text-[#ff6b33] font-bold">{cafe.price} ~</span>
                </div>
                <Button className="w-full mt-4 bg-[#ff6b33] hover:bg-[#ff5722]">
                  예약하기
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
