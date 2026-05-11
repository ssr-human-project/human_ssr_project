import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback } from 'react';
import { Button } from './ui/button';

const regions = [
  {
    name: '서울',
    image: 'https://images.unsplash.com/photo-1506816561089-5cc37b3aa9b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: '부산',
    image: 'https://images.unsplash.com/photo-1702040093537-b8c34eaa0f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: '대구',
    image: 'https://images.unsplash.com/photo-1541694764078-df09dec4f9c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: '인천',
    image: 'https://images.unsplash.com/photo-1668737488609-68b4f816dfe3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: '광주',
    image: 'https://images.unsplash.com/photo-1630135199928-55a43e87350d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: '대전',
    image: 'https://images.unsplash.com/photo-1483628529892-5436eb24f89a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: '울산',
    image: 'https://images.unsplash.com/photo-1597230887809-b2d4800bc2a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: '세종',
    image: 'https://images.unsplash.com/photo-1637070897574-3f91218a182d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: '경기',
    image: 'https://images.unsplash.com/photo-1637073759450-546b5006d107?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: '강원',
    image: 'https://images.unsplash.com/photo-1676815598457-5f2392ad3312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: '충북',
    image: 'https://images.unsplash.com/photo-1676815491548-4324e4d1b29f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: '충남',
    image: 'https://images.unsplash.com/photo-1676815536300-84729899c764?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: '전북',
    image: 'https://images.unsplash.com/photo-1644373653266-edcc0e58cc4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: '전남',
    image: 'https://images.unsplash.com/photo-1669303215070-151cc2e5887e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: '경북',
    image: 'https://images.unsplash.com/photo-1722084426182-b88c8e217f10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: '경남',
    image: 'https://images.unsplash.com/photo-1748696009709-ffd507a4ef61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: '제주',
    image: 'https://images.unsplash.com/photo-1680002529460-b6b5acf0aa37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
];

export function PopularRegions() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">지역</h2>
          <p className="text-gray-500 text-sm">원하시는 지역의 애견카페를 찾아보세요</p>
        </div>

        <div className="relative group">
          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {regions.map((region) => (
                <a
                  key={region.name}
                  href="#"
                  className="flex-[0_0_auto] w-[140px] group/item cursor-pointer"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                    <img
                      src={region.image}
                      alt={region.name}
                      className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="mt-3">
                    <h3 className="font-semibold text-gray-900 text-sm">{region.name}</h3>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            className="absolute -left-5 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white shadow-lg border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            className="absolute -right-5 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white shadow-lg border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
