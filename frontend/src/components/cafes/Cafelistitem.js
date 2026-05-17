import { useNavigate } from "react-router-dom";
import { Star, MapPin, Heart } from "lucide-react";
import { useState } from "react";
import api from "../../api/axios";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600";

function getBadgeLabel(allowedPetTypes) {
  if (!allowedPetTypes) return "카페";

  const types = allowedPetTypes.split(",").map((t) => t.trim());

  if (types.includes("대형견")) return "대형 카페";
  if (types.includes("중형견")) return "중형 카페";
  if (types.includes("소형견")) return "소형 카페";

  return "감성 카페";
}

function toTagArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);

  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export default function CafeListItem({ cafe }) {
  const navigate = useNavigate();
  const [wished, setWished] = useState(false);

  const id = cafe.cafeId || cafe.id;
  const name = cafe.cafeName || cafe.title || "이름 없는 카페";
  const image =
    cafe.imageUrls?.[0] ||
    cafe.imageUrl ||
    cafe.image ||
    cafe.cafeThumbnail ||
    FALLBACK_IMAGE;
  const rating = Number(cafe.rating || 0);

  const petTags = toTagArray(cafe.allowedPetTypes || cafe.facilities);
  const facilityTags = toTagArray(cafe.facilities);

  const handleWish = async (e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    try {
      await api.post(`/favorites/${id}`);
      setWished((prev) => !prev);
    } catch (err) {
      console.error("찜하기 실패:", err);
    }
  };

  return (
    <div
      onClick={() => navigate(`/cafes/${id}`)}
      style={{
        display: "flex",
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #f0f0f0",
        overflow: "hidden",
        cursor: "pointer",
        transition: "box-shadow 0.2s, transform 0.2s",
        fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.09)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          position: "relative",
          width: 190,
          flexShrink: 0,
          background: "#efefef",
        }}
      >
        <img
          src={image}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            minHeight: 140,
          }}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
          referrerPolicy="no-referrer"
        />

        <span
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "rgba(30,30,30,0.72)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 8px",
            borderRadius: 6,
            backdropFilter: "blur(4px)",
          }}
        >
          {getBadgeLabel(cafe.allowedPetTypes)}
        </span>

        <button
          onClick={handleWish}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(255,255,255,0.85)",
            border: "none",
            borderRadius: "50%",
            width: 30,
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: wished ? "#f97316" : "#ccc",
            backdropFilter: "blur(4px)",
            transition: "color 0.15s",
          }}
        >
          <Heart size={15} fill={wished ? "#f97316" : "none"} />
        </button>
      </div>

      <div
        style={{
          flex: 1,
          padding: "18px 20px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#111",
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </h3>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexShrink: 0,
            }}
          >
            <Star
              style={{
                width: 14,
                height: 14,
                fill: "#facc15",
                color: "#facc15",
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>
              {rating.toFixed(1)}
            </span>
          </div>
        </div>

        <p
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 13,
            color: "#888",
            margin: 0,
          }}
        >
          <MapPin size={13} style={{ color: "#f97316", flexShrink: 0 }} />
          {cafe.address || "주소 정보 없음"}
        </p>

        {cafe.description && (
          <p
            style={{
              fontSize: 13,
              color: "#555",
              margin: 0,
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {cafe.description}
          </p>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: "auto",
            paddingTop: 10,
            borderTop: "1px solid #f5f5f5",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: "#aaa" }}>허용 무게</span>
            <span
              style={{
                padding: "3px 9px",
                borderRadius: 20,
                background: "#fff4ed",
                color: "#f97316",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {cafe.maxWeight ? `-${cafe.maxWeight}kg` : "All"}
            </span>
          </div>

          {petTags.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {petTags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  style={{
                    padding: "3px 9px",
                    borderRadius: 20,
                    background: "#f5f5f5",
                    color: "#555",
                    fontSize: 12,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {facilityTags.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginLeft: "auto",
              }}
            >
              <span style={{ fontSize: 11, color: "#aaa" }}>주요 시설</span>
              <div style={{ display: "flex", gap: 4 }}>
                {facilityTags.slice(0, 3).map((f) => (
                  <span
                    key={f}
                    style={{
                      padding: "3px 9px",
                      borderRadius: 20,
                      background: "#f5f5f5",
                      color: "#555",
                      fontSize: 12,
                    }}
                  >
                    {f}
                  </span>
                ))}

                {facilityTags.length > 3 && (
                  <span
                    style={{
                      padding: "3px 9px",
                      borderRadius: 20,
                      background: "#f5f5f5",
                      color: "#999",
                      fontSize: 12,
                    }}
                  >
                    +{facilityTags.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
