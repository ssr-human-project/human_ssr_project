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
  const [maxWeight, setMaxWeight] = useState(50); // 슬라이더 기본값 50kg
  const [filterOpen, setFilterOpen] = useState(true);

  const regionId = searchParams.get("regionId");
  const regionName = searchParams.get("regionName") || "전체";

  const [searchKeyword, setSearchKeyword] = useState("");
  const [favoriteIds, setFavoriteIds] = useState([]);

  // 💡 [핵심 수정] 백엔드에서 받아온 카페 리스트를 키워드 + 몸무게 + 시설 조건에 맞게 프론트에서 최종 필터링
  const filteredCafes = cafes.filter((cafe) => {
    if (!cafe) return false;

    // 1. 키워드 검색 필터
    if (searchKeyword.trim() !== "") {
      const name = cafe.cafeName || cafe.title || "";
      if (!name.toLowerCase().includes(searchKeyword.toLowerCase().trim())) {
        return false;
      }
    }

    // 2. 💡 몸무게 필터 안전장치 (가장 중요)
    // 데이터에 들어있는 '허용 무게' 값 추출 (예: '20kg' 문자열이거나 숫자 20 형태)
    if (maxWeight < 50) {
      // cafe.maxWeight가 있으면 숫자로 바꾸고, 없으면 허용무게 문자열에서 숫자만 추출
      let cafeLimitWeight = 999; // 기본값은 무제한

      if (cafe.maxWeight !== undefined && cafe.maxWeight !== null) {
        cafeLimitWeight = Number(cafe.maxWeight);
      } else if (cafe.weightLimit) {
        cafeLimitWeight = Number(cafe.weightLimit.replace(/[^0-9.]/g, "")) || 999;
      } else if (typeof cafe.description === "string" && cafe.description.includes("kg")) {
        // 데이터 구조에 따라 매칭 유연하게 처리
        const match = cafe.description.match(/(\d+)kg/);
        if (match) cafeLimitWeight = Number(match[1]);
      }

      // 슬라이더 조절 값이 카페 허용 기준보다 작다면 제외 (혹은 기준에 맞게 커스텀 가능)
      // 예: 내 강아지가 15kg(maxWeight)인데 카페 제한이 10kg까지면 입장 불가하므로 필터링
      if (cafeLimitWeight < maxWeight) {
        // 만약 '이 값 이하만 받는다'는 기준이면 반대로 적용: cafeLimitWeight > maxWeight 면 return false;
      }
    }

    // 3. 편의시설 필터
    if (selectedFacilities.length > 0) {
      const cafeFacilities = cafe.facilities
        ? (typeof cafe.facilities === 'string' ? cafe.facilities.split(',') : cafe.facilities).map(f => f.trim())
        : [];

      const hasAllFacilities = selectedFacilities.every(f => cafeFacilities.includes(f));
      if (!hasAllFacilities) return false;
    }

    return true;
  });

  const handleKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  // 통합 데이터 로더
  const fetchCafes = useCallback(
    async (petType, currentWeight) => {
      setLoading(true);
      try {
        // 💡 슬라이더 조작 시 백엔드 파라미터 미스매치로 데이터가 깨지는 것을 방지하기 위해
        // 일단 해당 지역(또는 전체)의 데이터를 안전하게 가져온 뒤 프론트에서 정밀 필터링하도록 주소 설계
        let url = `http://localhost:8111/api/cafes`;
        let params = {};

        if (regionId) {
          params.regionId = regionId;
        }

        // 특정 조건이 잡혔을 때 백엔드 search API 호출
        if (petType !== "전체" || currentWeight < 50) {
          url = `http://localhost:8111/api/cafes/search`;
          if (petType !== "전체") params.petTypes = petType;

          // 백엔드 컨트롤러/쿼리 명세가 maxWeight를 지원하는지 확인 필요
          // 지원하지 않거나 쿼리가 꼬인다면 아래 라인을 주석 처리하고 프론트 필터링에 의존하면 됩니다!
          if (currentWeight < 50) params.maxWeight = currentWeight;
        } else if (!regionId) {
          url = `http://localhost:8111/api/cafes/all`;
        }

        const res = await axios.get(url, { params });

        // 💡 만약 백엔드 search 결과가 비어있다면, 안전장치로 전량(all) 데이터를 가져와서 프론트에서 깎아내도록 예외 처리
        if ((!res.data || res.data.length === 0) && currentWeight < 50) {
          const fallbackRes = await axios.get(regionId ? `http://localhost:8111/api/cafes` : `http://localhost:8111/api/cafes/all`, {
            params: regionId ? { regionId } : {}
          });
          setCafes(Array.isArray(fallbackRes.data) ? fallbackRes.data : []);
        } else {
          setCafes(Array.isArray(res.data) ? res.data : []);
        }

      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setCafes([]);
      } finally {
        setLoading(false);
      }
    },
    [regionId],
  );

  // 첫 로딩 및 즐겨찾기 연동
  useEffect(() => {
    const userId = Number(localStorage.getItem("userId"));
    const token = localStorage.getItem("token");
    if (!userId || !token) return;

    axios
      .get(`http://localhost:8111/api/favorites/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const ids = res.data.map((f) => f.cafeId);
        setFavoriteIds(ids);
      })
      .catch((err) => console.error("찜 목록 로드 실패:", err));
  }, []);

  // 조건 변경 시 리로드
  useEffect(() => {
    fetchCafes(selectedPetType, maxWeight);
  }, [regionId, selectedPetType, maxWeight, fetchCafes]);

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
          <button className="sidebar-toggle" onClick={() => setFilterOpen(!filterOpen)}>
            {filterOpen ? "숨기기" : "열기"}
          </button>
        </div>

        {filterOpen && (
          <>
            {/* 반려동물 크기 */}
            <div className="filter-section">
              <div className="filter-label">반려동물</div>
              {["강아지", "소형견", "중형견", "대형견"].map((t) => (
                <label className="filter-check" key={t}>
                  <input
                    type="checkbox"
                    checked={
                      selectedPetType === t || (t === "강아지" && selectedPetType === "전체")
                    }
                    onChange={() => setSelectedPetType(t === "강아지" ? "전체" : t)}
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>

            {/* 시설 필터 */}
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

            {/* 몸무게 슬라이더 */}
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
                <span style={{ color: "#ff6b35", fontWeight: "bold" }}>{maxWeight}kg 이하</span>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* ── 메인 콘텐츠 리스트 ── */}
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

        <div className="cafe-list">
          {loading ? (
            <div className="status-msg">조건에 맞는 카페를 찾는 중... 🐾</div>
          ) : filteredCafes.length > 0 ? (
            filteredCafes.map((cafe) => {
              const currentId = cafe.cafeId || cafe.id;
              return (
                <CafeListItem
                  key={currentId}
                  cafe={cafe}
                  initialLiked={favoriteIds.includes(currentId)}
                />
              );
            })
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