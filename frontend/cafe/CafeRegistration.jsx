import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Image as ImageIcon,
  Plus,
  Trash2,
  Save,
  Info,
} from "lucide-react";
import { cn } from "../lib/utils.js";
import { regions } from "../data/mockData.js";
import { getAllCafes } from "../lib/cafeUtils.js";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../AxiosApi.js";

const FACILITY_OPTIONS = [
  "소형견",
  "중형견",
  "대형견",
  "실내동반",
  "야외테라스",
  "잔디마당",
  "주차가능",
  "애견운동장",
  "애견수영장",
  "애견유치원",
  "바다전망",
  "호수전망",
  "숲전망",
];
const CATEGORY_OPTIONS = [
  "감성 카페",
  "대형 카페",
  "정원 카페",
  "시내 카페",
  "루프탑 카페",
  "숲 카페",
  "비치 카페",
];
const WEIGHT_LIMIT_OPTIONS = [
  "All",
  "-5kg",
  "-10kg",
  "-12kg",
  "-15kg",
  "-20kg",
  "-25kg",
];
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&h=600&fit=crop";

const DEFAULT_FORM = {
  title: "",
  content: "",
  region: "seoul",
  address: "",
  phone: "",
  category: "감성 카페",
  weightLimit: "All",
  pet_type: "All",
  website: "",
  mapUrl: "",
  image: "",
  images: [],
  facilities: [],
  notice: "",
  businessHours: "",
  menu: [],
  latitude: 37.5665,
  longitude: 126.978,
  userId: "",
};

const inputCls =
  "w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/10 focus:border-[#FF6B35] transition-all font-bold placeholder:text-gray-300";

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-1.5 h-6 bg-[#FF6B35] rounded-full" />
      <h3 className="font-black text-xl text-gray-900">{children}</h3>
    </div>
  );
}

function Field({
  label,
  children,
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-black text-gray-700 ml-1">{label}</label>
      {children}
    </div>
  );
}

export default function CafeRegistration() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAdmin } = useAuth();

  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [imageInput, setImageInput] = useState("");
  const [menuInput, setMenuInput] = useState({ name: "", price: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!id) return;
    const cafeToEdit = getAllCafes().find((c) => String(c.id) === String(id));
    if (!cafeToEdit) return;

    if (isAdmin || (user && String(cafeToEdit.userId) === String(user.id))) {
      setFormData({
        title: cafeToEdit.title ?? "",
        content: cafeToEdit.content ?? "",
        region: cafeToEdit.region ?? "seoul",
        address: cafeToEdit.address ?? "",
        phone: cafeToEdit.phone ?? "",
        category: cafeToEdit.category ?? "감성 카페",
        weightLimit: cafeToEdit.weightLimit ?? "All",
        pet_type: cafeToEdit.pet_type ?? "All",
        website: cafeToEdit.website ?? "",
        mapUrl: cafeToEdit.mapUrl ?? "",
        image: cafeToEdit.image ?? "",
        images: cafeToEdit.images ?? [],
        facilities: cafeToEdit.facilities ?? [],
        notice: cafeToEdit.notice ?? "",
        businessHours: cafeToEdit.businessHours ?? "",
        menu: cafeToEdit.menu ?? [],
        latitude: cafeToEdit.latitude ?? 37.5665,
        longitude: cafeToEdit.longitude ?? 126.978,
        userId: cafeToEdit.userId ?? "",
      });
      setIsEditMode(true);
    } else {
      alert("수정 권한이 없습니다.");
      navigate("/search");
    }
  }, [id, isAdmin, navigate, user]);

  useEffect(() => {
    if (!isAdmin && !id) {
       // Allow regular users for now or keep original logic
    }
  }, [isAdmin, navigate, id]);

  useEffect(() => {
    const scriptId = "naver-maps-script";
    if (document.getElementById(scriptId)) return;
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${import.meta.env?.VITE_NAVER_MAPS_CLIENT_ID || 'YOUR_CLIENT_ID'}&submodules=geocoder`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFacilityToggle = (facility) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const addImage = () => {
    const trimmed = imageInput.trim();
    if (!trimmed) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, trimmed],
      image: prev.image || trimmed,
    }));
    setImageInput("");
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const images = prev.images.filter((_, i) => i !== index);
      return { ...prev, images, image: images[0] ?? "" };
    });
  };

  const addMenuItem = () => {
    if (!menuInput.name.trim() || !menuInput.price.trim()) return;
    setFormData((prev) => ({
      ...prev,
      menu: [...prev.menu, { ...menuInput }],
    }));
    setMenuInput({ name: "", price: "" });
  };

  const removeMenuItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      menu: prev.menu.filter((_, i) => i !== index),
    }));
  };

  const geocodeAddress = () => {
    if (!formData.address) return;
    const naver = window.naver;
    if (!naver?.maps?.Service?.geocode) {
      alert("지도 서비스를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    naver.maps.Service.geocode(
      { query: formData.address },
      (status, response) => {
        if (
          status === naver.maps.Service.Status.OK &&
          response.v2.addresses.length > 0
        ) {
          const item = response.v2.addresses[0];
          setFormData((prev) => ({
            ...prev,
            latitude: parseFloat(item.y),
            longitude: parseFloat(item.x),
          }));
          alert("주소 변환에 성공했습니다!");
        } else {
          alert("주소를 찾을 수 없습니다. 상세 주소를 확인해주세요.");
        }
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.address.trim()) {
      alert("카페 이름과 주소는 필수입니다.");
      return;
    }
    setIsSubmitting(true);

    const cafeData = {
      ...formData,
      userId: user?.id ?? "",
      images:
        formData.images.length > 0
          ? formData.images
          : [formData.image || DEFAULT_IMAGE],
      image: formData.image || DEFAULT_IMAGE,
    };

    try {
      let savedCafe;
      if (isEditMode && id) {
        savedCafe = await api.cafes.update(id, cafeData);
      } else {
        savedCafe = await api.cafes.create(cafeData);
      }

      // Also update local storage for backward compatibility
      const allCafes = getAllCafes();
      const cafeIdToUse = (id || savedCafe.id || savedCafe.ID)?.toString();
      const updatedCafes = isEditMode
        ? allCafes.map((c) => (String(c.id) === cafeIdToUse ? { ...c, ...cafeData, id: c.id } : c))
        : [{ ...cafeData, id: cafeIdToUse }, ...allCafes];
      localStorage.setItem("petapp_cafes", JSON.stringify(updatedCafes));

      setIsSubmitting(false);
      alert(
        isEditMode ? "카페 정보가 수정되었습니다!" : "카페가 등록되었습니다!",
      );
      navigate(`/cafe/${cafeIdToUse}`);
    } catch (error) {
      console.error("Failed to save cafe:", error);
      setIsSubmitting(false);
      alert("카페 정보를 저장하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-24 px-4 overflow-x-hidden">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">
              우리 동네{" "}
              <span className="text-[#FF6B35]">
                카페 {isEditMode ? "수정" : "등록"}
              </span>
            </h1>
            <p className="text-gray-500 font-bold">
              {isEditMode
                ? "카페 정보를 업데이트해 주세요."
                : "반려견과 함께 가기 좋은 카페를 알려주세요!"}
            </p>
          </motion.div>
        </header>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="bg-[#FF6B35] p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-black text-lg">카페 정보 입력</span>
            </div>
            <Info className="w-5 h-5 text-white/50" />
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <section className="space-y-6">
              <SectionTitle>기본 정보</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="카페 이름 *">
                  <input
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="카페 이름을 입력하세요"
                    className={inputCls}
                  />
                </Field>
                <Field label="연락처 (선택)">
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="010-0000-0000"
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="카페 설명 (선택)">
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={4}
                  placeholder="카페의 특징이나 반려견 동반 시 유의사항을 적어주세요"
                  className={`${inputCls} resize-none`}
                />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="이용 안내 (선택)">
                  <input
                    name="notice"
                    value={formData.notice}
                    onChange={handleChange}
                    placeholder="노키즈존, 매너벨트 필수 등"
                    className={inputCls}
                  />
                </Field>
                <Field label="영업 시간 (선택)">
                  <input
                    name="businessHours"
                    value={formData.businessHours}
                    onChange={handleChange}
                    placeholder="매일 10:00 - 22:00"
                    className={inputCls}
                  />
                </Field>
              </div>
            </section>

            <section className="space-y-6">
              <SectionTitle>위치 가이드</SectionTitle>
              <Field label="지역 선택">
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className={inputCls}
                >
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="웹사이트/인스타그램 (선택)">
                  <input
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://..."
                    className={inputCls}
                  />
                </Field>
                <Field label="네이버 지도 URL (선택)">
                  <input
                    name="mapUrl"
                    value={formData.mapUrl}
                    onChange={handleChange}
                    placeholder="https://map.naver.com/..."
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="상세 주소 *">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF6B35] w-5 h-5" />
                    <input
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="경기도 가평군 ..."
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/10 focus:border-[#FF6B35] transition-all font-bold placeholder:text-gray-300"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={geocodeAddress}
                    className="px-6 bg-gray-900 text-white font-black rounded-2xl hover:bg-[#FF6B35] transition-all active:scale-95"
                  >
                    좌표 변환
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 font-bold ml-1 italic mt-1">
                  * 주소를 정확히 입력하고 '좌표 변환'을 클릭하면 지도에 위치가
                  연동됩니다.
                </p>
              </Field>
            </section>

            <section className="space-y-6">
              <SectionTitle>상세 분류</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="카테고리">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="제한 체중">
                  <select
                    name="weightLimit"
                    value={formData.weightLimit}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    {WEIGHT_LIMIT_OPTIONS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-gray-700 ml-1">
                  편의 시설 및 특징
                </label>
                <div className="flex flex-wrap gap-2">
                  {FACILITY_OPTIONS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => handleFacilityToggle(f)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-black transition-all border",
                        formData.facilities.includes(f)
                          ? "bg-[#FF6B35] text-white border-[#FF6B35] shadow-lg shadow-[#FF6B35]/20"
                          : "bg-white text-gray-400 border-gray-100 hover:border-[#FF6B35]/30 hover:text-gray-600",
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <SectionTitle>메뉴 및 가격</SectionTitle>
              <div className="flex gap-2">
                <input
                  value={menuInput.name}
                  onChange={(e) =>
                    setMenuInput((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="메뉴명 (예: 아메리카노)"
                  className={`flex-[2] ${inputCls}`}
                />
                <input
                  value={menuInput.price}
                  onChange={(e) =>
                    setMenuInput((p) => ({ ...p, price: e.target.value }))
                  }
                  placeholder="가격 (예: 5,000)"
                  className={`flex-1 ${inputCls}`}
                />
                <button
                  type="button"
                  onClick={addMenuItem}
                  className="p-4 bg-gray-100 text-gray-900 rounded-2xl hover:bg-gray-200 transition-all"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-2">
                {formData.menu.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="flex gap-4 items-center">
                      <span className="font-black text-gray-900">
                        {item.name}
                      </span>
                      <span className="font-bold text-[#FF6B35]">
                        {item.price}원
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMenuItem(idx)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <SectionTitle>이미지 등록</SectionTitle>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="이미지 URL을 입력하세요"
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/10 focus:border-[#FF6B35] transition-all font-bold placeholder:text-gray-300"
                  />
                </div>
                <button
                  type="button"
                  onClick={addImage}
                  className="p-4 bg-gray-100 text-gray-900 rounded-2xl hover:bg-gray-200 transition-all"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {formData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100 shadow-sm"
                  >
                    <img
                      src={img}
                      alt={`Preview ${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white rounded-lg text-[10px] font-black backdrop-blur-sm">
                      {idx === 0 ? "대표" : `${idx + 1}번`}
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 transform opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        type="button"
                        onClick={() => {
                          if (idx === 0) return;
                          setFormData(prev => {
                            const newImages = [...prev.images];
                            const temp = newImages[idx];
                            newImages[idx] = newImages[idx - 1];
                            newImages[idx - 1] = temp;
                            return { ...prev, images: newImages, image: newImages[0] };
                          });
                        }}
                        disabled={idx === 0}
                        className="p-1.5 bg-white/90 text-gray-900 rounded-lg hover:bg-[#FF6B35] hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:bg-gray-200"
                        title="앞으로 이동"
                      >
                         ←
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (idx === formData.images.length - 1) return;
                          setFormData(prev => {
                            const newImages = [...prev.images];
                            const temp = newImages[idx];
                            newImages[idx] = newImages[idx + 1];
                            newImages[idx + 1] = temp;
                            return { ...prev, images: newImages, image: newImages[0] };
                          });
                        }}
                        disabled={idx === formData.images.length - 1}
                        className="p-1.5 bg-white/90 text-gray-900 rounded-lg hover:bg-[#FF6B35] hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:bg-gray-200"
                        title="뒤로 이동"
                      >
                         →
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-lg"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
                {formData.images.length === 0 && (
                  <div className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50 flex flex-col items-center justify-center text-gray-300 gap-2 font-black text-xs uppercase px-4 text-center">
                    <ImageIcon className="w-8 h-8 opacity-50" />
                    이미지를 등록해 주세요
                  </div>
                )}
              </div>
            </section>

            <div className="pt-8 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full py-5 rounded-3xl font-black text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3",
                  isSubmitting
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#FF6B35] text-white hover:bg-[#E85D2A]",
                )}
              >
                {isSubmitting ? (
                  "처리 중..."
                ) : (
                  <>
                    <Save className="w-6 h-6" />
                    카페 {isEditMode ? "수정" : "등록"} 완료하기
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full mt-4 py-4 rounded-2xl font-black text-gray-400 hover:text-gray-600 transition-all"
              >
                취소하고 돌아가기
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
