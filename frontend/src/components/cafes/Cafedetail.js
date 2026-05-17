import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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

  const stripHtml = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const fetchAll = useCallback(async () => {
    if (!id) return;

    setLoading(true);

    try {
      const cafeRes = await axios.get(`http://localhost:8111/api/cafes/${id}`);

      const rawData = cafeRes.data.cafe || cafeRes.data;

      if (!rawData || Object.keys(rawData).length === 0) {
        throw new Error("카페 데이터가 비어있습니다.");
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
          : rawData.allowedPetTypes
            ? rawData.allowedPetTypes.split(",").map((f) => f.trim())
            : [],
      };

      setCafe(normalized);

      try {
        const reviewRes = await axios.get(
          `http://localhost:8111/api/reviews/cafe/${id}`,
        );

        const reviewData = reviewRes.data;

        setReviews(
          Array.isArray(reviewData)
            ? reviewData
            : reviewData.reviews || [],
        );
      } catch (reviewError) {
        console.warn("리뷰 조회 실패:", reviewError);
        setReviews([]);
      }

      if (normalized.regionId) {
        try {
          const relRes = await axios.get("http://localhost:8111/api/cafes", {
            params: {
              regionId: normalized.regionId,
            },
          });

          const list = Array.isArray(relRes.data) ? relRes.data : [];

          setRecommendCafes(
            list
              .filter(
                (c) =>
                  String(c.cafeId || c.id) !== String(normalized.cafeId || id),
              )
              .slice(0, 4),
          );
        } catch (recommendError) {
          console.warn("추천 카페 조회 실패:", recommendError);
          setRecommendCafes([]);
        }
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
  }, [fetchAll]);

  if (loading) {
    return (
      <div className="cd-status-msg">카페 정보를 불러오는 중입니다... 🐾</div>
    );
  }

  if (!cafe) {
    return (
      <div className="cd-status-msg">
        카페 정보를 찾을 수 없습니다. (ID: {id})
      </div>
    );
  }

  return (
    <div className="cd-container">
      <section className="cd-gallery">
        <div className="cd-gallery-main">
          <img src={cafe.images[0]} alt={cafe.title} />
        </div>

        <div className="cd-gallery-sub">
          {[1, 2, 3, 4].map((_, idx) => (
            <div key={idx} className="cd-gallery-item">
              {cafe.images[idx + 1] ? (
                <img src={cafe.images[idx + 1]} alt={`Sub ${idx + 2}`} />
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
            <MapPin size={16} />
            <span>{cafe.address}</span>
            <span
              className="cd-map-link"
              onClick={() =>
                window.open(
                  cafe.naverMapUrl ||
                    `https://map.naver.com/v5/search/${encodeURIComponent(
                      cafe.address,
                    )}`,
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
              {cafe.facilityList.length > 0 ? (
                cafe.facilityList.map((f, i) => (
                  <div className="cd-facility-item" key={i}>
                    <div className="cd-icon-box">
                      <CheckCircle size={22} color="#10b981" />
                    </div>
                    <span className="cd-facility-text">{f}</span>
                  </div>
                ))
              ) : (
                <div className="cd-empty-text">등록된 시설 정보가 없습니다.</div>
              )}
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

          <section className="cd-section">
            <h3 className="cd-section-title">방문자 리뷰 ({reviews.length})</h3>

            <div className="cd-review-list">
              {reviews.length > 0 ? (
                reviews.map((r, i) => (
                  <div
                    className="cd-review-item"
                    key={r.reviewId || r.id || i}
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
              onClick={() => navigate("/reviews")}
            >
              전체 리뷰 보러가기 <ChevronRight size={18} />
            </button>
          </section>

          {recommendCafes.length > 0 && (
            <section className="cd-rec-section">
              <div className="cd-rec-header">
                <h3 className="cd-section-title">인기 추천 카페</h3>
                <span
                  className="cd-rec-all"
                  onClick={() => navigate("/cafes")}
                >
                  전체보기
                </span>
              </div>

              <div className="cd-rec-grid">
                {recommendCafes.map((rec) => (
                  <div
                    className="cd-rec-card"
                    key={rec.cafeId || rec.id}
                    onClick={() => navigate(`/cafes/${rec.cafeId || rec.id}`)}
                  >
                    <div className="cd-rec-img">
                      <img
                        src={
                          rec.imageUrls?.[0] ||
                          rec.cafeThumbnail ||
                          rec.image ||
                          "https://via.placeholder.com/300"
                        }
                        alt={rec.cafeName || rec.title || "추천 카페"}
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
                  cafe.naverMapUrl ||
                    `https://map.naver.com/v5/search/${encodeURIComponent(
                      cafe.address,
                    )}`,
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