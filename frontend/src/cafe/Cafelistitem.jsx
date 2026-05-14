import { useNavigate } from "react-router-dom";
import { Star, MapPin, Heart } from "lucide-react";
import { cn } from "../lib/utils";

export default function CafeListItem({ cafe }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/cafe/${cafe.id}`)}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col sm:flex-row group"
    >
      {/* 이미지 */}
      <div className="sm:w-56 sm:h-44 h-48 shrink-0 overflow-hidden bg-gray-100">
        <img
          src={
            cafe.image ||
            cafe.images?.[0] ||
            "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80"
          }
          alt={cafe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* 정보 */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-black text-[#FF6B35] uppercase tracking-widest">
                {cafe.category}
              </span>
              <h3 className="text-xl font-black text-gray-900 group-hover:text-[#FF6B35] transition-colors mt-0.5">
                {cafe.title}
              </h3>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-black text-gray-900">
                {cafe.rating || "0.0"}
              </span>
              <span className="text-xs text-gray-400">
                ({cafe.reviewCount || 0})
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {cafe.address}
          </p>

          {cafe.content && (
            <p className="text-sm text-gray-400 line-clamp-2">{cafe.content}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {(cafe.facilities || []).slice(0, 4).map((f) => (
            <span
              key={f}
              className="text-[10px] px-3 py-1 bg-gray-50 text-gray-500 rounded-full font-bold border border-gray-100"
            >
              {f}
            </span>
          ))}
          {cafe.weightLimit && (
            <span className="text-[10px] px-3 py-1 bg-orange-50 text-[#FF6B35] rounded-full font-bold border border-orange-100">
              🐾 {cafe.weightLimit}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
