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
  const [maxWeight, setMaxWeight] = useState(100);
  const [filterOpen, setFilterOpen] = useState(true);

  const regionId = searchParams.get("regionId");
  const keywordParam = searchParams.get("keyword") || "";

  const [searchKeyword, setSearchKeyword] = useState(keywordParam);

  useEffect(() => {
    setSearchKeyword(keywordParam);
  }, [keywordParam]);

  const filteredCafes = cafes.filter((cafe) => {
    if (!cafe || !cafe.cafeName) return false;

    if (!searchKeyword.trim()) return true;

    return cafe.cafeName
      .toLowerCase()
      .includes(searchKeyword.toLowerCase().trim());
  });

  const handleKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const fetchCafes = useCallback(
    async (petType) => {
      setLoading(true);

      try {
        let url = "http://localhost:8111/api/cafes";
        let params = {};

        if (keywordParam.trim()) {
          url = "http://localhost:8111/api/cafes/search/keyword";
          params.keyword = keywordParam.trim();
        } else if (petType !== "전체" || maxWeight < 50) {
          url = "http://localhost:8111/api/cafes/search";

          params.regionId = regionId || 1;

          if (petType !== "전체") {
            params.petTypes = petType;
          }

          if (maxWeight < 50) {
            params.maxWeight = maxWeight;
          }
        } else if (regionId) {
          url = "http://localhost:8111/api/cafes";
          params.regionId = regionId;
        } else {
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
    [regionId, keywordParam, maxWeight],
  );

  useEffect(() => {
    fetchCafes(selectedPetType);
  }, [regionId, keywordParam, selectedPetType, fetchCafes]);

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
                <span>{maxWeight}kg</span>
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
