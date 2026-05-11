import { motion } from 'motion/react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

const newCafes = [
  {
    id: 1,
    name: '펑펑스테이',
    price: '18,000원',
    image: 'https://images.unsplash.com/photo-1534243420028-d7b79ea1c703?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    id: 2,
    name: '호두키친',
    price: '15,000원',
    image: 'https://images.unsplash.com/photo-1749280447572-de42562eb4f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    id: 3,
    name: '댕댕스파',
    price: '20,000원',
    image: 'https://images.unsplash.com/photo-1671586088197-26d07db05107?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    id: 4,
    name: '포포펜션',
    price: '16,000원',
    image: 'https://images.unsplash.com/photo-1594997359546-a7eef7006343?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    id: 5,
    name: '멍즐비카페',
    price: '14,000원',
    image: 'https://images.unsplash.com/photo-1516755594799-4e41b3066883?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
];

export function NewCafes() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">🆕 새로 오픈한 카페</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {newCafes.map((cafe, index) => (
            <motion.a
              key={cafe.id}
              href="#"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={cafe.image}
                    alt={cafe.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-red-500 text-white border-0 font-semibold">
                      새로 오픈
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2">{cafe.name}</h3>
                  <p className="text-sm font-bold text-[#ff6b33]">{cafe.price}</p>
                </CardContent>
              </Card>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
