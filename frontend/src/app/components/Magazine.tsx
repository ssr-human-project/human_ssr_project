import { motion } from 'motion/react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

const articles = [
  {
    id: 1,
    title: '강남 핫플 애견카페',
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    category: '강남',
    categoryColor: 'bg-[#ff6b33]',
  },
  {
    id: 2,
    title: '주말 나들이 스팟',
    image: 'https://images.unsplash.com/photo-1567880905822-56f8e06fe630?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    category: '추천',
    categoryColor: 'bg-[#ff6b33]',
  },
  {
    id: 3,
    title: '대형견 환영 카페',
    image: 'https://images.unsplash.com/photo-1687957773831-4fbfbbc9e6fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    category: '대형견',
    categoryColor: 'bg-[#ff6b33]',
  },
  {
    id: 4,
    title: '반려견 식단 관리법',
    image: 'https://images.unsplash.com/photo-1659692679001-fe4d900fab9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    category: '건강',
    categoryColor: 'bg-[#ff6b33]',
  },
];

export function Magazine() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">주말엔 뭐하지?</h2>
          <p className="text-gray-500">애견과 함께 즐기는 문화생활</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article, index) => (
            <motion.a
              key={article.id}
              href="#"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge className={`${article.categoryColor} text-white border-0 text-xs`}>
                      {article.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{article.title}</h3>
                </div>
              </Card>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
