import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import CafeListItem from "./Cafelistitem";
import "../../styles/cafes/Searchresults.css";

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

  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPetType, setSelectedPetType] = useState("전체");
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [maxWeight, setMaxWeight] = useState(50);
  const [filterOpen, setFilterOpen] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState([]);

  const regionId = searchParams.get("regionId");
  const keywordParam = searchParams.get("keyword") || "";

  const [searchKeyword, setSearchKeyword] = useState(keywordParam);

  useEffect(() => {
    setSearchKeyword(keywordParam);
  }, [keywordParam]);

  const filteredCafes = cafes.filter((cafe) => {
    if (!cafe) return false;

    if (searchKeyword.trim() !== "") {
      const name = cafe.cafeName || cafe.title || "";
      if (!name.toLowerCase().includes(searchKeyword.toLowerCase().trim())) {
        return false;
      }
    }

    if (maxWeight < 50) {
      const cafeLimitWeight =
        cafe.maxWeight !== undefined && cafe.maxWeight !== null
          ? Number(cafe.maxWeight)
          : 999;

      if (cafeLimitWeight >= maxWeight) {
        return false;
      }
    }

    if (selectedFacilities.length > 0) {
      const cafeFacilities = cafe.facilities
        ? (typeof cafe.facilities === "string"
            ? cafe.facilities.split(",")
            : cafe.facilities
          ).map((f) => f.trim())
        : [];

      const hasAllFacilities = selectedFacilities.every((f) =>
        cafeFacilities.includes(f),
      );

      if (!hasAllFacilities) return false;
    }

    return true;
  });

  const handleKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const fetchCafes = useCallback(
    async (petType, currentWeight) => { // 💡 매개변수로 명확하게 받음
      setLoading(true);

      try {
        let url = "http://localhost:8111/api/cafes";
        const params = {};

        // 1순위: 검색 키워드가 있을 때 (키워드 검색)
        if (keywordParam.trim()) {
          url = "http://localhost:8111/api/cafes/search/keyword";
          params.keyword = keywordParam.trim();
        }
        // 2순위: 반려동물 타입 필터가 지정되었거나, 몸무게 필터가 변경되었을 때 (조건 검색)
        else if (petType !== "전체" || currentWeight < 50) {
          url = "http://localhost:8111/api/cafes/search";
          params.regionId = regionId ? Number(regionId) : 1; // 기본 지역 설정 필수

          if (petType !== "전체") {
            params.petTypes = petType;
          }
          if (currentWeight < 50) {
            params.maxWeight = currentWeight; // 💡 인자로 들어온 최신 무게값을 백엔드로 정확히 전달!
          }
        }
        // 3순위: 특정 지역 선택 상태일 때 (지역별 전체 조회)
        else if (regionId) {
          url = "http://localhost:8111/api/cafes";
          params.regionId = regionId;
        }
        // 4순위: 아무 조건도 없을 때 (전체 조회)
        else {
          url = "http://localhost:8111/api/cafes/all";
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
    [regionId, keywordParam], // maxWeight 의존성을 제거하여 불필요한 재렌더링 방지
  );

  useEffect(() => {
    const userId = Number(localStorage.getItem("userId"));

    if (!userId) return;

    axios
      .get(`http://localhost:8111/api/favorites/${userId}`)
      .then((res) => {
        const ids = res.data.map((f) => f.cafeId);
        setFavoriteIds(ids);
      })
      .catch((err) => console.error("찜 목록 로드 실패:", err));
  }, []);

  useEffect(() => {
    fetchCafes(selectedPetType, maxWeight);
  }, [regionId, keywordParam, selectedPetType, maxWeight, fetchCafes]);

  const toggleFacility = (f) => {
    setSelectedFacilities((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );
  };

  return (
    <div className="sr-wrapper">
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
            <div className="filter-section">
              <div className="filter-label">반려동물</div>
              {["강아지", "소형견", "중형견", "대형견"].map((t) => (
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

            <div className="filter-section">
              <div className="filter-label">반려동물 시설</div>
              <div className="facility-tags">
                {FACILITIES.map((f) => (
                  <button
                    key={f}
                    className={`facility-tag ${
                      selectedFacilities.includes(f) ? "active" : ""
                    }`}
                    onClick={() => toggleFacility(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

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
                <span style={{ color: "#ff6b35", fontWeight: "bold" }}>
                  {maxWeight}kg 이하
                </span>
              </div>
            </div>
          </>
        )}
      </aside>

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
