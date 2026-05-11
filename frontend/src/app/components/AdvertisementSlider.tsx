import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from './ui/button';

const advertisements = [
  {
    id: 1,
    title: '🎉 오픈 기념 특별 할인',
    description: '신규 회원 가입시 첫 예약 20% 할인!',
    image: 'https://images.unsplash.com/photo-1601758004484-733647916908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    bgColor: 'from-purple-500 to-pink-500',
  },
  {
    id: 2,
    title: '🐶 강아지 동반 카페 추천',
    description: '반려견과 함께하는 특별한 시간',
    image: 'https://images.unsplash.com/photo-1765934872139-bc30de5c6fe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    bgColor: 'from-blue-500 to-cyan-500',
  },
  {
    id: 3,
    title: '☕ 주말 특가 이벤트',
    description: '주말에만 만나는 특별한 혜택',
    image: 'https://images.unsplash.com/photo-1773307404307-ceedf6d62be0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    bgColor: 'from-orange-500 to-red-500',
  },
  {
    id: 4,
    title: '🌟 인기 카페 TOP 10',
    description: '이달의 가장 사랑받는 애견 카페',
    image: 'https://images.unsplash.com/photo-1534243420028-d7b79ea1c703?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    bgColor: 'from-green-500 to-teal-500',
  },
];

export function AdvertisementSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">특별 혜택</h2>
          <p className="text-gray-500 text-sm">놓치지 마세요!</p>
        </div>

        <div className="relative group">
          {/* Carousel */}
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex">
              {advertisements.map((ad) => (
                <div
                  key={ad.id}
                  className="flex-[0_0_100%] min-w-0"
                >
                  <div className={`relative h-[400px] bg-gradient-to-r ${ad.bgColor} rounded-2xl overflow-hidden`}>
                    <div className="absolute inset-0">
                      <img
                        src={ad.image}
                        alt={ad.title}
                        className="w-full h-full object-cover opacity-40"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                    </div>

                    <div className="relative h-full flex flex-col justify-center px-16 text-white">
                      <h3 className="text-5xl font-bold mb-4">{ad.title}</h3>
                      <p className="text-2xl mb-8 opacity-90">{ad.description}</p>
                      <div>
                        <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-semibold">
                          자세히 보기
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/90 shadow-lg border-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/90 shadow-lg border-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {advertisements.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? 'w-8 bg-[#ff6b33]'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
