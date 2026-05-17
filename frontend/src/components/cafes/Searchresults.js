import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CafeListItem from "./Cafelistitem";
import "../../styles/cafes/Searchresults.css";

const PET_TYPES = ["전체", "소형견", "중형견", "대형견"];
const FACILITIES = [
  "드라이룸",
  "실내수영장",
  "애견수영장",
  "애견운동장",
  "애견놀이터",
  "잔디마당",
  "주차가능",
];

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPetType, setSelectedPetType] = useState("전체");
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [maxWeight, setMaxWeight] = useState(100);
  const [filterOpen, setFilterOpen] = useState(true);

  const regionId = searchParams.get("regionId");
  const regionName = searchParams.get("regionName") || "전체";

  const [searchKeyword, setSearchKeyword] = useState("");

  // 💡 [수정] 대소문자 구문 및 공백 에러 방지를 포함한 완벽한 실시간 필터링
  const filteredCafes = cafes.filter((cafe) => {
    if (!cafe || !cafe.cafeName) return false;
    return cafe.cafeName
      .toLowerCase()
      .includes(searchKeyword.toLowerCase().trim());
  });

  // 💡 [수정] 입력창 조작 시 백엔드를 다시 때리지 않고 입력 값 상태만 변경합니다.
  const handleKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  // 💡 [수정] 통합 데이터 로더 (지역 ID가 있으면 지역 목록, 없으면 전체 목록을 무조건 처음에 가져옴)
  const fetchCafes = useCallback(
    async (petType) => {
      setLoading(true);
      try {
        let url = `http://localhost:8111/api/cafes`;
        let params = {};

        // regionId가 존재할 때만 파라미터에 추가
        if (regionId) {
          params.regionId = regionId;
        }

        // petType 또는 maxWeight 필터가 활성화되어 있으면 search API 사용
        if (petType !== "전체" || maxWeight < 50) {
          url = `http://localhost:8111/api/cafes/search`;
          if (petType !== "전체") params.petTypes = petType;
          if (maxWeight < 50) params.maxWeight = maxWeight;
        }
        // regionId도 없고 특별한 필터도 없다면 전체 목록 API로 선회
        else if (!regionId) {
          url = `http://localhost:8111/api/cafes/all`;
        }

        const res = await axios.get(url, { params });
        setCafes(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setCafes([]);
      } finally {
        setLoading(false);
      }
    },
    [regionId, maxWeight],
  );

  // 첫 로딩 시 및 사이드바 필터 클릭 시 작동
  useEffect(() => {
    fetchCafes(selectedPetType);
  }, [regionId, selectedPetType, fetchCafes]);

  const toggleFacility = (f) =>
    setSelectedFacilities((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );

  return (
    <div className="sr-wrapper">
      {/* ── 사이드바 필터 ── */}
      <aside className={`sr-sidebar ${filterOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">필터</span>
          <button
            className="sidebar-toggle"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            {filterOpen ? "숨기기" : "열기"}
          </button>
        </div>

        {filterOpen && (
          <>
            {/* 반려동물 */}
            <div className="filter-section">
              <div className="filter-label">
                반려동물 <span className="chevron">∨</span>
              </div>
              {["강아지", "소형견", "중형견", "대형견", "맹견가능"].map((t) => (
                <label className="filter-check" key={t}>
                  <input
                    type="checkbox"
                    checked={
                      selectedPetType === t ||
                      (t === "강아지" && selectedPetType === "전체")
                    }
                    onChange={() =>
                      setSelectedPetType(t === "강아지" ? "전체" : t)
                    }
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>

            {/* 반려동물 시설 */}
            <div className="filter-section">
              <div className="filter-label">반려동물 시설</div>
              <div className="facility-tags">
                {FACILITIES.map((f) => (
                  <button
                    key={f}
                    className={`facility-tag ${selectedFacilities.includes(f) ? "active" : ""}`}
                    onClick={() => toggleFacility(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* 가격 슬라이더 */}
            <div className="filter-section">
              <div className="filter-label">최대 몸무게</div>
              <input
                type="range"
                min={0}
                max={50}
                value={maxWeight}
                onChange={(e) => setMaxWeight(Number(e.target.value))}
                className="price-slider"
              />
              <div className="price-range-labels">
                <span>0kg</span>
                <span>{maxWeight}kg</span>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* ── 메인 콘텐츠 ── */}
      <main className="sr-main">
        <div className="search-bar-wrap">
          <input
            className="search-bar-input"
            type="text"
            placeholder="카페 이름으로 검색"
            value={searchKeyword}
            onChange={handleKeywordChange}
          />
        </div>
        {/* 카페 목록 */}
        <div className="cafe-list">
          {loading ? (
            <div className="status-msg">조건에 맞는 카페를 찾는 중... 🐾</div>
          ) : filteredCafes.length > 0 ? (
            filteredCafes.map((cafe) => (
              <CafeListItem key={cafe.cafeId || cafe.id} cafe={cafe} />
            ))
          ) : (
            <div className="status-msg">
              앗! 조건에 맞는 반려견 카페가 없어요. 🐶
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
