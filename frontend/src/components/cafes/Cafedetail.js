import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/axiosApi";
import {
  MapPin,
  Heart,
  Info,
  CheckCircle,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

import "../../styles/cafes/Cafedetail.css";

export default function CafeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cafe, setCafe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [recommendCafes, setRecommendCafes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ HTML 태그 제거 함수 (커뮤니티 리뷰의 <p> 태그 등 제거)
  const stripHtml = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // ── 데이터 로드 및 정규화 ──
  const fetchAll = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      // 카페 상세 정보와 커뮤니티 리뷰를 동시에 가져옴
      const [cafeRes, reviewRes] = await Promise.all([
        api.cafes.getById(id),
        api.reviews.getByCafe(id), // 커뮤니티 리뷰 API 호출
      ]);

      const rawData = cafeRes.cafe || cafeRes;
      if (!rawData || Object.keys(rawData).length === 0) {
        throw new Error("데이터가 비어있습니다.");
      }

      const normalized = {
        ...rawData,
        cafeId: rawData.cafeId || rawData.id,
        title: rawData.cafeName || rawData.title || "이름 없는 카페",
        images:
          rawData.imageUrls && rawData.imageUrls.length > 0
            ? rawData.imageUrls
            : [
                rawData.image ||
                  rawData.cafeThumbnail ||
                  "https://via.placeholder.com/800x600?text=No+Image",
              ],
        facilityList: rawData.facilities
          ? (typeof rawData.facilities === "string"
              ? rawData.facilities.split(",")
              : rawData.facilities
            ).map((f) => f.trim())
          : [],
      };

      setCafe(normalized);
      setReviews(
        Array.isArray(reviewRes) ? reviewRes : reviewRes.reviews || [],
      );

      const regionId = normalized.regionId;
      if (regionId) {
        const relData = await api.cafes.getAll({ regionId });
        const list = Array.isArray(relData) ? relData : relData.cafes || [];
        setRecommendCafes(
          list
            .filter((c) => String(c.cafeId || c.id) !== String(id))
            .slice(0, 4),
        );
      }
    } catch (err) {
      console.error("데이터 로딩 실패:", err);
      setCafe(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAll();
    window.scrollTo(0, 0);
  }, [fetchAll, id]);

  if (loading)
    return (
      <div className="cd-status-msg">카페 정보를 불러오는 중입니다... 🐾</div>
    );
  if (!cafe)
    return (
      <div className="cd-status-msg">
        카페 정보를 찾을 수 없습니다. (ID: {id})
      </div>
    );

  return (
    <div className="cd-container">
      {/* ── 갤러리 섹션 ── */}
      <section className="cd-gallery">
        <div className="cd-gallery-main">
          <img src={cafe.images[0]} alt="Main" />
        </div>
        <div className="cd-gallery-sub">
          {[1, 2, 3, 4].map((_, idx) => (
            <div key={idx} className="cd-gallery-item">
              {cafe.images[idx + 1] ? (
                <img src={cafe.images[idx + 1]} alt="Sub" />
              ) : (
                <div className="cd-no-img">Side {idx + 2}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="cd-layout">
        <div className="cd-main-content">
          <div className="cd-title-box">
            <h1 className="cd-name">{cafe.title}</h1>
            <Heart size={28} color="#ddd" style={{ cursor: "pointer" }} />
          </div>
          <div className="cd-addr-row">
            <MapPin size={16} /> <span>{cafe.address}</span>
            <span
              className="cd-map-link"
              onClick={() =>
                window.open(
                  `https://map.naver.com/v5/search/${encodeURIComponent(cafe.address)}`,
                )
              }
            >
              지도보기 &gt;
            </span>
          </div>

          <section className="cd-section">
            <h3 className="cd-section-title">
              시설 정보 <Info size={16} color="#eee" />
            </h3>
            <div className="cd-facility-grid">
              {cafe.facilityList.map((f, i) => (
                <div className="cd-facility-item" key={i}>
                  <div className="cd-icon-box">
                    <CheckCircle size={22} color="#10b981" />
                  </div>
                  <span className="cd-facility-text">{f}</span>
                </div>
              ))}
            </div>
          </section>

          <hr className="cd-line" />

          <section className="cd-section">
            <h3 className="cd-section-title">카페 안내</h3>
            <p className="cd-description-text">
              {cafe.description || "상세 안내가 없습니다."}
            </p>
          </section>

          <hr className="cd-line" />

          {/* ── 리뷰 섹션 (커뮤니티 리뷰 연동 및 태그 제거 적용) ── */}
          <section className="cd-section">
            <h3 className="cd-section-title">방문자 리뷰 ({reviews.length})</h3>

            <div className="cd-review-list">
              {reviews.length > 0 ? (
                reviews.map((r, i) => (
                  <div
                    className="cd-review-item"
                    key={i}
                    style={{
                      marginBottom: "25px",
                      paddingBottom: "15px",
                      borderBottom: "1px solid #f9f9f9",
                    }}
                  >
                    <div
                      className="cd-rev-info"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          color: "#333",
                        }}
                      >
                        닉: {r.nickname || "익명"}
                      </div>
                      <div style={{ fontSize: "14px", color: "#ffb800" }}>
                        별점: {"⭐".repeat(Math.floor(r.rating || 5))}
                      </div>
                    </div>
                    {/* ✅ stripHtml을 사용하여 커뮤니티 글의 HTML 태그를 제거하여 출력 */}
                    <p
                      style={{
                        fontSize: "14.5px",
                        color: "#555",
                        lineHeight: "1.6",
                        margin: 0,
                      }}
                    >
                      {stripHtml(r.content)}
                    </p>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    padding: "40px 0",
                    color: "#ccc",
                    textAlign: "center",
                  }}
                >
                  등록된 리뷰가 없습니다.
                </div>
              )}
            </div>

            <button
              className="cd-mypage-link"
              onClick={() => navigate("../community/reviews")}
            >
              전체 리뷰 보러가기 <ChevronRight size={18} />
            </button>
          </section>

          {/* ── 하단 추천 카페 ── */}
          {recommendCafes.length > 0 && (
            <section className="cd-rec-section">
              <div className="cd-rec-header">
                <h3 className="cd-section-title">인기 추천 카페</h3>
                <span
                  className="cd-rec-all"
                  onClick={() => navigate("/search")}
                >
                  전체보기
                </span>
              </div>
              <div className="cd-rec-grid">
                {recommendCafes.map((rec) => (
                  <div
                    className="cd-rec-card"
                    key={rec.cafeId || rec.id}
                    onClick={() => navigate(`/cafe/${rec.cafeId || rec.id}`)}
                  >
                    <div className="cd-rec-img">
                      <img
                        src={
                          rec.imageUrls?.[0] ||
                          rec.cafeThumbnail ||
                          rec.image ||
                          "https://via.placeholder.com/300"
                        }
                        alt="rec"
                      />
                    </div>
                    <p className="cd-rec-name">
                      {rec.cafeName || rec.title || "이름 없는 카페"}
                    </p>
                    <p className="cd-rec-addr">
                      {rec.address
                        ? rec.address.split(" ").slice(0, 2).join(" ")
                        : ""}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="cd-sidebar">
          <div className="cd-card">
            <div className="cd-card-row">
              <span className="k">연락처</span>
              <span className="v">{cafe.phone || "정보없음"}</span>
            </div>
            <hr />
            <p className="cd-card-addr">{cafe.address}</p>
            <div className="cd-card-map">
              <MapPin size={32} color="#f97316" />
            </div>
            <button
              className="cd-nav-btn"
              onClick={() =>
                window.open(
                  `https://map.naver.com/v5/search/${encodeURIComponent(cafe.address)}`,
                )
              }
            >
              <ExternalLink size={16} /> 네이버 지도로 보기
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}