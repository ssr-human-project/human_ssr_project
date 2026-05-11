import { useState } from 'react';
import { Search, Calendar, Users, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState('오늘');
  const [guests, setGuests] = useState('2인 + 1마리');

  return (
    <section className="relative h-[500px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1601758004484-733647916908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Dog Cafe"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative max-w-[1440px] mx-auto px-10 h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            반려견과 함께하는<br />
            특별한 카페 시간
          </h1>
          <p className="text-xl text-white/90 mb-12">
            전국 애견카페 예약을 한 곳에서 간편하게
          </p>

          {/* Search Box */}
          
        </div>
      </div>
    </section>
  );
}
