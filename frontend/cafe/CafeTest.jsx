import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllCafes } from "../lib/cafeUtils.js";
import { api } from "../AxiosApi.js";
import {
  Star,
  MapPin,
  Phone,
  Globe,
  Share2,
  Heart,
  Info,
  MessageCircle,
  Send,
  Edit2,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function CafeTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCafe = async () => {
      setLoading(true);
      try {
        const data = await api.cafes.getById(id);
        // Normalize API data to match frontend expectations
        const normalized = {
          ...data,
          id: data.cafeId || data.id,
          title: data.cafeName || data.title,
          content: data.description || data.content,
          image:
            data.image ||
            data.cafeThumbnail ||
            (data.cafeImages && data.cafeImages[0]),
          weightLimit: data.maxWeight
            ? `최대 ${data.maxWeight}kg`
            : data.weightLimit,
          facilities: data.allowedPetTypes
            ? data.allowedPetTypes.split(",")
            : data.facilities || [],
        };
        setCafe(normalized);
      } catch (err) {
        console.error("Fetch error:", err);
        const all = getAllCafes();
        const foundCafe = all.find((c) => String(c.id) === String(id));
        if (foundCafe) setCafe(foundCafe);
      }
      setLoading(false);
      window.scrollTo(0, 0);
    };
    fetchCafe();
  }, [id]);

  useEffect(() => {
    if (!cafe) return;
    const scriptId = "naver-maps-script";
    let script = document.getElementById(scriptId);

    const initMap = () => {
      const naver = window.naver;
      const mapContainer = document.getElementById("map");
      if (!naver?.maps || !mapContainer) return;

      const mapOptions = {
        center: new naver.maps.LatLng(
          cafe.latitude || 37.5665,
          cafe.longitude || 126.978,
        ),
        zoom: 15,
        mapTypeControl: true,
      };
      const map = new naver.maps.Map(mapContainer, mapOptions);

      if (naver.maps.Service?.geocode) {
        const queries = [`${cafe.title} ${cafe.address}`, cafe.address];

        const tryGeocode = (queryIndex) => {
          if (queryIndex >= queries.length) {
            const coord = new naver.maps.LatLng(
              cafe.latitude || 37.5665,
              cafe.longitude || 126.978,
            );
            map.setCenter(coord);
            new naver.maps.Marker({ position: coord, map });
            return;
          }

          naver.maps.Service.geocode(
            { query: queries[queryIndex] },
            (status, response) => {
              if (
                status === naver.maps.Service.Status.OK &&
                response.v2.addresses.length > 0
              ) {
                const item = response.v2.addresses[0];
                const coord = new naver.maps.Point(item.x, item.y);
                map.setCenter(coord);
                new naver.maps.Marker({ position: coord, map });
              } else {
                tryGeocode(queryIndex + 1);
              }
            },
          );
        };

        tryGeocode(0);
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${import.meta.env?.VITE_NAVER_MAPS_CLIENT_ID || "YOUR_CLIENT_ID"}&submodules=geocoder`;
      script.async = true;
      document.head.appendChild(script);
      script.onload = initMap;
    } else {
      if (window.naver && window.naver.maps) {
        initMap();
      } else {
        script.onload = initMap;
      }
    }
  }, [cafe?.address, cafe?.latitude, cafe?.longitude, cafe?.title]);

  const [isWished, setIsWished] = React.useState(false);

  useEffect(() => {
    if (!cafe) return;
    const wishlistKey = "petapp_wishlist";
    const saved = localStorage.getItem(wishlistKey);
    const list = saved ? JSON.parse(saved) : [];
    setIsWished(list.includes(cafe.id) || list.includes(String(cafe.id)));
  }, [cafe?.id]);

  const [reviewList, setReviewList] = useState([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewImage, setReviewImage] = useState(null);

  useEffect(() => {
    if (!cafe?.id) return;
    const fetchReviews = async () => {
      const reviews = await api.reviews.getByCafe(cafe.id);
      setReviewList(reviews);
    };
    fetchReviews();
  }, [cafe?.id]);

  const averageRating =
    reviewList.length > 0
      ? (
          reviewList.reduce((acc, r) => acc + (r.rating || 0), 0) /
          reviewList.length
        ).toFixed(1)
      : "0.0";

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateCafeStats = (updatedReviews) => {
    const cafeReviews = updatedReviews.filter(
      (r) => String(r.cafeId) === String(cafe.id),
    );
    const newCount = cafeReviews.length;
    const newRating =
      newCount > 0
        ? parseFloat(
            (
              cafeReviews.reduce((acc, r) => acc + (r.rating ?? 0), 0) /
              newCount
            ).toFixed(1),
          )
        : 0;

    const allCafes = getAllCafes();
    const updatedCafes = allCafes.map((c) =>
      String(c.id) === String(cafe.id)
        ? { ...c, rating: newRating, reviewCount: newCount }
        : c,
    );
    localStorage.setItem("petapp_cafes", JSON.stringify(updatedCafes));

    // Update local state to reflect the new stats
    setCafe((prev) => ({ ...prev, rating: newRating, reviewCount: newCount }));
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !user) return navigate("/auth");

    const newReview = {
      cafeId: cafe.id,
      memberId: user.id, // Backend uses memberId
      nickname: user.nickname,
      rating: newReviewRating,
      title: `${cafe.title} 리뷰`, // Title might be required in Board
      content: newReviewText,
      category: "REVIEW",
      image_url: reviewImage || undefined,
    };

    try {
      const savedReview = await api.reviews.create(newReview);
      setReviewList((prev) => [savedReview, ...prev]);
      setNewReviewText("");
      setNewReviewRating(5);
      setReviewImage(null);
      // Re-fetch reviews to update stats if necessary
      const refreshedReviews = await api.reviews.getByCafe(cafe.id);
      setReviewList(refreshedReviews);
    } catch (err) {
      console.error("Review creation failed:", err);
      alert("리뷰 등록에 실패했습니다.");
    }
  };

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewRating, setEditReviewRating] = useState(5);

  const startEditReview = (review) => {
    setEditingReviewId(review.review_id);
    setEditReviewText(review.content);
    setEditReviewRating(review.rating || 5);
  };

  const saveEditReview = () => {
    if (!editingReviewId) return;
    const jsonReviews = localStorage.getItem("petapp_reviews");
    const savedReviews = jsonReviews ? JSON.parse(jsonReviews) : [];
    const updated = savedReviews.map((r) =>
      (r.review_id || r.id) === editingReviewId
        ? { ...r, content: editReviewText, rating: editReviewRating }
        : r,
    );
    localStorage.setItem("petapp_reviews", JSON.stringify(updated));
    updateCafeStats(updated);
    setReviewList(updated.filter((r) => String(r.cafeId) === String(cafe.id)));
    setEditingReviewId(null);
    alert("리뷰가 수정되었습니다.");
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm("리뷰를 삭제하시겠습니까?")) return;

    await api.reviews.delete(reviewId);

    const refreshedReviews = await api.reviews.getByCafe(cafe.id);
    updateCafeStats(refreshedReviews);
    setReviewList(refreshedReviews);
    alert("리뷰가 삭제되었습니다.");
  };

  const toggleWish = () => {
    if (!isAuthenticated || !user) return navigate("/auth");
    const wishlistKey = "petapp_wishlist";
    const saved = localStorage.getItem(wishlistKey);
    let list = saved ? JSON.parse(saved) : [];
    const isPresent = list.includes(cafe.id) || list.includes(String(cafe.id));
    if (isPresent) {
      list = list.filter((pid) => String(pid) !== String(cafe.id));
    } else {
      list.push(cafe.id);
    }
    localStorage.setItem(wishlistKey, JSON.stringify(list));
    setIsWished(!isPresent);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="text-6xl">🔍</div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900">
            카페를 찾을 수 없습니다
          </h2>
          <p className="text-gray-400 font-bold mt-2">
            존재하지 않거나 삭제된 카페입니다.
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="bg-[#FF6B35] text-white px-8 py-3 rounded-2xl font-black shadow-lg"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Single Main Image */}
        <div className="w-full h-[400px] md:h-[600px] rounded-[40px] overflow-hidden mb-12 shadow-2xl relative group bg-gray-100">
          <img
            src={cafe.images?.[0] || cafe.image}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
            alt="Main"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-6 right-6">
            <a
              href={`https://search.naver.com/search.naver?where=image&query=${encodeURIComponent(cafe.title)}`}
              target="_blank"
              rel="noreferrer"
              className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl text-xs font-black text-gray-900 border border-gray-100 flex items-center gap-2 hover:bg-[#FF6B35] hover:text-white transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              사진 더보기
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                    {cafe.title}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{cafe.address}</span>
                    <a
                      href={
                        cafe.mapUrl ||
                        `https://map.naver.com/v5/search/${encodeURIComponent(cafe.address)}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#FF6B35] font-black hover:underline"
                    >
                      지도에서 위치 보기 {">"}
                    </a>
                  </div>
                </div>
                <div className="flex gap-2">
                  {(isAdmin || (user && user.id === cafe.userId)) && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/cafe/edit/${cafe.id}`)}
                        className="flex items-center gap-2 p-3 border rounded-xl hover:bg-blue-50 border-blue-100 transition-all shadow-sm text-blue-600 font-bold"
                      >
                        <Edit2 className="w-5 h-5" />
                        <span className="hidden sm:inline">수정하기</span>
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm("정말 이 카페를 삭제하시겠습니까?")
                          ) {
                            const allCafes = getAllCafes();
                            const updated = allCafes.filter(
                              (c) => c.id !== cafe.id,
                            );
                            localStorage.setItem(
                              "petapp_cafes",
                              JSON.stringify(updated),
                            );
                            alert("카페가 삭제되었습니다.");
                            navigate("/search");
                          }
                        }}
                        className="flex items-center gap-2 p-3 border rounded-xl hover:bg-red-50 border-red-100 transition-all shadow-sm text-red-600 font-bold"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span className="hidden sm:inline">삭제하기</span>
                      </button>
                    </div>
                  )}
                  <button
                    onClick={toggleWish}
                    className={cn(
                      "p-3 border rounded-xl transition-all shadow-sm",
                      isWished
                        ? "bg-red-50 border-red-100"
                        : "hover:bg-gray-50",
                    )}
                  >
                    <Heart
                      className={cn(
                        "w-5 h-5",
                        isWished
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600",
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Facility Info Grid (The requested style) */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                시설 정보
                <Info className="w-4 h-4 text-[#FF6B35]" />
              </h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col items-center gap-2 group cursor-default">
                  <div className="w-14 h-14 bg-gray-50 border rounded-2xl flex items-center justify-center text-xl group-hover:bg-[#FF6B35]/10 group-hover:border-[#FF6B35]/30 transition-all duration-300 shadow-sm">
                    📍
                  </div>
                  <span className="text-xs text-gray-500 font-bold text-center">
                    주차{" "}
                    {cafe.facilities?.includes("주차가능") ? "가능" : "불가"}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 group cursor-default">
                  <div className="w-14 h-14 bg-gray-50 border rounded-2xl flex items-center justify-center text-xl group-hover:bg-[#FF6B35]/10 group-hover:border-[#FF6B35]/30 transition-all duration-300 shadow-sm">
                    🐶
                  </div>
                  <span className="text-xs text-gray-500 font-bold text-center">
                    {cafe.weightLimit || "소형견 동반 가능"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-4 pt-8 border-t">
              <h3 className="text-xl font-bold">카페 안내</h3>
              <p className="text-gray-600 leading-relaxed">{cafe.content}</p>
              {cafe.notice && (
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-[#FF6B35]" />
                    <span className="font-black text-[#FF6B35]">이용 안내</span>
                  </div>
                  <p className="text-sm font-bold text-gray-700 leading-relaxed whitespace-pre-line">
                    {cafe.notice}
                  </p>
                </div>
              )}
            </div>

            {/* Menu Section */}
            <div className="space-y-6 pt-10 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-6 bg-[#FF6B35] rounded-full" />
                <h3 className="font-black text-xl text-gray-900">
                  메뉴 및 가격
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cafe.menu && cafe.menu.length > 0 ? (
                  cafe.menu.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all group"
                    >
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900 group-hover:text-[#FF6B35] transition-colors">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex-1 border-b border-gray-100 border-dotted mx-4 mb-1" />
                      <span className="font-black text-gray-900">
                        {item.price}원
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="md:col-span-2 py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
                    <Info className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-gray-400 font-bold">
                      등록된 메뉴 정보가 없습니다.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section - MOVED ABOVE RECOMMENDATIONS */}
            <div className="pt-12 border-t space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black flex items-center gap-2">
                    방문자 리뷰{" "}
                    <MessageCircle className="w-6 h-6 text-[#FF6B35]" />
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-black text-gray-900">
                      {averageRating}
                    </span>
                    <span className="text-xs font-bold text-gray-400">
                      ({reviewList.length})
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/reviews/write?cafeId=${id}`)}
                  className="bg-[#1a1a1a] text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-[#FF6B35] transition-all shadow-lg"
                >
                  <Edit2 className="w-4 h-4" />
                  상세 리뷰 쓰기
                </button>
              </div>

              {/* Review Form */}
              {isAuthenticated ? (
                <form
                  onSubmit={handleAddReview}
                  className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6"
                >
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-1">
                      별점 선택
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className={cn(
                            "p-2 transition-all",
                            newReviewRating >= star
                              ? "text-yellow-400 scale-110"
                              : "text-gray-200",
                          )}
                        >
                          <Star
                            className={cn(
                              "w-8 h-8",
                              newReviewRating >= star ? "fill-yellow-400" : "",
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-1">
                      사진 추가
                    </label>
                    <div className="flex gap-4">
                      <label className="w-24 h-24 bg-white border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#FF6B35] transition-all group shrink-0 overflow-hidden">
                        {reviewImage ? (
                          <img
                            src={reviewImage}
                            className="w-full h-full object-cover"
                            alt="Review Preview"
                          />
                        ) : (
                          <>
                            <ImageIcon className="w-6 h-6 text-gray-300 group-hover:text-[#FF6B35]" />
                            <span className="text-[10px] font-bold text-gray-400">
                              추가하기
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                      {reviewImage && (
                        <button
                          type="button"
                          onClick={() => setReviewImage(null)}
                          className="text-xs text-red-500 font-bold self-end mb-1"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-1">
                      내용
                    </label>
                    <textarea
                      placeholder="우리 아이와 어땠나요? 방문 후기를 공유해주세요."
                      className="w-full h-32 bg-white border-none rounded-2xl p-6 font-bold outline-none ring-2 ring-transparent focus:ring-[#FF6B35]/20 transition-all resize-none shadow-inner"
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full h-14 bg-gray-900 text-white rounded-2xl font-black hover:bg-[#FF6B35] transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-900/10"
                  >
                    <Send className="w-5 h-5" /> 리뷰 등록하기
                  </button>
                </form>
              ) : (
                <div className="bg-gray-50 p-10 rounded-[40px] border-2 border-dashed border-gray-100 text-center space-y-4">
                  <p className="text-gray-400 font-bold">
                    리뷰를 작성하려면 로그인이 필요합니다.
                  </p>
                  <button
                    onClick={() => navigate("/auth")}
                    className="bg-white text-gray-900 px-8 py-3 rounded-2xl border-2 border-gray-100 font-black hover:bg-gray-50 transition-all"
                  >
                    로그인하기
                  </button>
                </div>
              )}

              {/* Review List */}
              <div className="space-y-6">
                {reviewList.map((review) => (
                  <div
                    key={review.id || review.reviewId}
                    className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm space-y-4 relative group"
                  >
                    {(isAdmin ||
                      user?.id === (review.memberId || review.user_id)) && (
                      <div className="absolute top-8 right-8 flex gap-3">
                        <button
                          onClick={() => startEditReview(review)}
                          className="text-xs font-black text-blue-300 hover:text-blue-500 uppercase tracking-widest transition-colors"
                        >
                          수정
                        </button>
                        <button
                          onClick={() =>
                            deleteReview(review.id || review.reviewId)
                          }
                          className="text-xs font-black text-red-300 hover:text-red-500 uppercase tracking-widest transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-[#FF6B35] text-xl border border-gray-100">
                          {review.nickname
                            ? review.nickname[0]
                            : review.writer
                              ? review.writer[0]
                              : "U"}
                        </div>
                        <div>
                          <div className="font-black text-gray-900">
                            {review.nickname || review.writer}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-300 font-black uppercase tracking-widest">
                            {review.createdAt
                              ? new Date(review.createdAt).toLocaleDateString()
                              : review.created_at?.split("T")[0]}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3.5 h-3.5",
                              i <
                                (editingReviewId ===
                                (review.id || review.reviewId)
                                  ? editReviewRating
                                  : review.rating || 5)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-200",
                            )}
                            onClick={() => {
                              if (
                                editingReviewId ===
                                (review.id || review.reviewId)
                              ) {
                                setEditReviewRating(i + 1);
                              }
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    {editingReviewId === review.review_id ? (
                      <div className="space-y-4 pt-2">
                        <textarea
                          value={editReviewText}
                          onChange={(e) => setEditReviewText(e.target.value)}
                          className="w-full h-24 bg-gray-50 border-none rounded-xl p-4 font-bold outline-none ring-2 ring-[#FF6B35]/20"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingReviewId(null)}
                            className="px-4 py-2 bg-gray-100 text-gray-500 rounded-xl text-[10px] font-black uppercase"
                          >
                            취소
                          </button>
                          <button
                            onClick={saveEditReview}
                            className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase"
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-600 font-medium leading-relaxed">
                          {review.content}
                        </p>
                        {review.image_url && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            <img
                              src={review.image_url}
                              className="w-32 h-32 object-cover rounded-2xl border border-gray-100"
                              alt="Review"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
                {reviewList.length === 0 && (
                  <div className="text-center py-20 bg-gray-50/50 rounded-[40px] border border-gray-50">
                    <p className="text-gray-300 font-bold">
                      아직 등록된 리뷰가 없습니다.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Cafes Section - MOVED DOWN */}
            <div className="space-y-8 pt-12 border-t">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">인기 추천 카페</h3>
                <button
                  onClick={() => navigate("/search")}
                  className="text-sm font-bold text-[#FF6B35] hover:underline"
                >
                  더보기
                </button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {getAllCafes()
                  .filter((c) => String(c.id) !== String(cafe.id))
                  .slice(0, 4)
                  .map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => navigate(`/cafe/${rec.id}`)}
                      className="group cursor-pointer space-y-3"
                    >
                      <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-md relative">
                        <img
                          src={rec.image}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          alt={rec.title}
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                          <span className="text-[10px] font-bold text-gray-900">
                            {rec.category?.split(" ")[0]}
                          </span>
                        </div>
                      </div>
                      <div className="px-1">
                        <h4 className="font-bold text-gray-900 group-hover:text-[#FF6B35] transition-colors line-clamp-1">
                          {rec.title || rec.name}
                        </h4>
                        <p className="text-xs text-gray-400 line-clamp-1">
                          {rec.address?.split(" ").slice(0, 2).join(" ")}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar Right */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="p-8 border rounded-3xl shadow-xl space-y-8 bg-white">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-medium">연락처</span>
                    <span className="font-bold">{cafe.phone}</span>
                  </div>
                  {cafe.businessHours && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-medium">영업일</span>
                      <span className="font-bold text-right text-sm">
                        {cafe.businessHours}
                      </span>
                    </div>
                  )}
                  <div className="pt-4 space-y-4">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      위치안내
                    </span>
                    <p className="font-bold text-gray-900 leading-snug">
                      {cafe.address}
                    </p>
                    <div
                      id="map"
                      className="h-48 w-full bg-gray-100 rounded-2xl overflow-hidden mt-4 border border-gray-100 shadow-inner"
                    />
                    <a
                      href={
                        cafe.mapUrl ||
                        `https://map.naver.com/v5/search/${encodeURIComponent(cafe.title + " " + cafe.address)}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="w-full h-14 bg-white border-2 border-[#FF6B35] text-[#FF6B35] rounded-2xl flex items-center justify-center font-bold gap-2 hover:bg-[#FF6B35] hover:text-white transition-all shadow-md active:scale-[0.98]"
                    >
                      <MapPin className="w-5 h-5" />
                      네이버 지도로 길찾기
                    </a>
                  </div>
                </div>
                <div className="text-center">
                  <button className="text-xs text-gray-400 font-medium border-b border-gray-200">
                    판매자 정보 안내
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center gap-3 z-50 safe-area-inset-bottom">
        <button
          onClick={toggleWish}
          className={cn(
            "p-4 border rounded-2xl transition-all",
            isWished ? "bg-red-50 border-red-100" : "bg-gray-50",
          )}
        >
          <Heart
            className={cn(
              "w-6 h-6",
              isWished ? "fill-red-500 text-red-500" : "text-gray-400",
            )}
          />
        </button>
        <a
          href={`tel:${cafe.phone}`}
          className="flex-1 bg-[#FF6B35] text-white h-14 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg active:scale-95 transition-transform"
        >
          전화하기
        </a>
      </div>
    </div>
  );
}
