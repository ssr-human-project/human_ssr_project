import axios from "axios";

// ── 지역 매핑 ───────────────────────────────────────────
const REGION_ID_MAP = {
  seoul: 1,
  busan: 2,
  daegu: 3,
  incheon: 4,
  gwangju: 5,
  daejeon: 6,
  ulsan: 7,
  sejong: 8,
  gyeonggi: 9,
  gangwon: 10,
  chungbuk: 11,
  chungnam: 12,
  jeonbuk: 13,
  jeonnam: 14,
  gyeongbuk: 15,
  gyeongnam: 16,
  jeju: 17,
};

const REGION_CODE_MAP = Object.fromEntries(
  Object.entries(REGION_ID_MAP).map(([k, v]) => [v, k]),
);

// "seoul" → 1 / "1" → 1 / null → null
function toRegionId(val) {
  if (!val) return null;
  const n = Number(val);
  if (!isNaN(n) && n > 0) return n;
  return REGION_ID_MAP[val] ?? null;
}

// ── axios 인스턴스 ──────────────────────────────────────
const instance = axios.create({
  baseURL: "http://localhost:8111",
  timeout: 10000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// 응답 인터셉터: 401 → 로그아웃
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config?.skipAuthRedirect) {
      ["userId", "nickname", "role"].forEach((k) => localStorage.removeItem(k));
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

// ── 카페 필드 매핑 ─────────────────────────────────────
// 백엔드 CafeVO → 프론트 객체
function mapCafe(raw) {
  const c = raw?.cafe ?? raw; // getCafeDetail은 { cafe, ... } 래퍼 반환
  return {
    // 공통
    id: c.cafeId,
    cafeId: c.cafeId,
    title: c.cafeName ?? "",
    name: c.cafeName ?? "",
    content: c.description ?? "",
    // 지역
    region: REGION_CODE_MAP[c.regionId] ?? String(c.regionId ?? ""),
    regionId: c.regionId,
    // 연락처/위치
    address: c.address ?? "",
    phone: c.phone ?? "",
    website: c.website ?? "",
    mapUrl: c.naverMapUrl ?? "",
    latitude: c.latitude ?? 37.5665,
    longitude: c.longitude ?? 126.978,
    // 반려동물
    allowedPetTypes: c.allowedPetTypes ?? "",
    facilities: c.allowedPetTypes
      ? c.allowedPetTypes.split(",").map((s) => s.trim())
      : [],
    maxWeight: c.maxWeight ?? 0,
    weightLimit: c.maxWeight ? `최대 ${c.maxWeight}kg` : "All",
    category: c.category ?? "",
    // 미디어
    image: c.imageUrls?.[0] ?? "",
    images: c.imageUrls ?? [],
    // 운영정보
    notice: c.notice ?? "",
    businessHours: c.businessHours ?? "",
    menu: c.menu ?? [],
    // 통계
    rating: c.rating ?? 0,
    reviewCount: c.reviewCount ?? 0,
    favoriteCount: c.favoriteCount ?? 0,
    userId: c.userId ?? null,
  };
}

// 프론트 폼 → 백엔드 CafeVO
function toBackendCafe(form) {
  const maxWeightMatch = String(form.weightLimit ?? "").match(/[\d.]+/);
  return {
    cafeName: form.title ?? form.name ?? "",
    description: form.content ?? "",
    regionId: toRegionId(form.region) ?? 1,
    address: form.address ?? "",
    phone: form.phone ?? "",
    category: form.category ?? "",
    maxWeight: maxWeightMatch ? parseFloat(maxWeightMatch[0]) : 0,
    allowedPetTypes:
      Array.isArray(form.facilities) && form.facilities.length
        ? form.facilities.join(",")
        : (form.allowedPetTypes ?? ""),
    naverMapUrl: form.mapUrl ?? "",
    imageUrls: form.images ?? (form.image ? [form.image] : []),
    notice: form.notice ?? "",
    businessHours: form.businessHours ?? "",
    menu: form.menu ?? [],
    latitude: form.latitude ?? 37.5665,
    longitude: form.longitude ?? 126.978,
    userId: form.userId ?? null,
  };
}

// ── API ────────────────────────────────────────────────
export const api = {
  // ── 인증 ─────────────────────────────────────────────
  auth: {
    // POST /api/auth/login  body: { email, password }
    // 응답: { role, nickname, userId }
    login: async (email, password) => {
      const response = await instance.post(
        "/api/auth/login",
        {
          email,
          password,
        },
        {
          skipAuthRedirect: true,
        },
      );
      return response.data;
    },
    signup: async (userData) => {
      const response = await instance.post("/api/auth/signup", userData);
      return response.data;
    },
    checkEmail: async (email) => {
      const response = await instance.get("/api/auth/check-email", {
        params: { email },
        skipAuthRedirect: true,
      });
      return response.data; // boolean
    },
    checkNickname: async (nickname) => {
      const response = await instance.get("/api/auth/check-nickname", {
        params: { nickname },
        skipAuthRedirect: true,
      });
      return response.data; // boolean
    },
    findEmail: async (phone) => {
      const response = await instance.post(
        "/api/auth/find-email",
        { phone },
        { skipAuthRedirect: true },
      );
      return response.data;
    },
    verifyReset: async ({ email, phone }) => {
      const response = await instance.post(
        "/api/auth/verify-reset",
        { email, phone },
        { skipAuthRedirect: true },
      );
      return response.data;
    },
    resetPassword: async ({ email, phone, newPassword }) => {
      const response = await instance.post(
        "/api/auth/reset-password",
        { email, phone, newPassword },
        { skipAuthRedirect: true },
      );
      return response.data;
    },
    logout: async () => {
      const response = await instance.post("/api/auth/logout");
      return response.data;
    },
    me: async (config = {}) => {
      const response = await instance.get("/api/auth/me", config);
      return response.data;
    },
  },

  uploads: {
    images: async (files) => {
      const formData = new FormData();
      Array.from(files ?? []).forEach((file) => formData.append("files", file));

      const response = await instance.post("/api/uploads/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.imageUrls ?? [];
    },
  },

  // ── 지역 ─────────────────────────────────────────────
  regions: {
    getAll: async () => {
      const response = await instance.get("/api/regions");
      return response.data;
    },
  },

  // ── 카페 ─────────────────────────────────────────────
  cafes: {
    /**
     * GET /api/cafes/all        — 전체 (필터 없을 때)
     * GET /api/cafes/search     — 지역 필터 (regionId int 필수)
     * params: { regionId?, petTypes?, q? }
     */
    getAll: async (params = {}) => {
      const regionId = toRegionId(params.regionId);
      let response;
      if (regionId) {
        const query = { regionId };
        if (params.petTypes) query.petTypes = params.petTypes;
        response = await instance.get("/api/cafes/search", {
          params: query,
          paramsSerializer: (p) => {
            const sp = new URLSearchParams();
            Object.entries(p).forEach(([key, value]) => {
              if (Array.isArray(value)) value.forEach((v) => sp.append(key, v));
              else if (value != null) sp.append(key, value);
            });
            return sp.toString();
          },
        });
      } else {
        response = await instance.get("/api/cafes/all");
      }
      return (response.data ?? []).map(mapCafe);
    },

    // 기존 코드 호환용 search 별도 메서드
    search: async (params) => {
      const regionId = toRegionId(params.regionId);
      if (!regionId) return api.cafes.getAll();
      const response = await instance.get("/api/cafes/search", {
        params: { ...params, regionId },
        paramsSerializer: (p) => {
          const sp = new URLSearchParams();
          Object.entries(p).forEach(([key, value]) => {
            if (Array.isArray(value)) value.forEach((v) => sp.append(key, v));
            else if (value != null) sp.append(key, value);
          });
          return sp.toString();
        },
      });
      return (response.data ?? []).map(mapCafe);
    },

    getById: async (id) => {
      const response = await instance.get(`/api/cafes/${id}`);
      return mapCafe(response.data);
    },

    create: async (form) => {
      const response = await instance.post("/api/cafes", toBackendCafe(form));
      return response.data;
    },

    update: async (id, form) => {
      const body = { ...toBackendCafe(form), cafeId: id };
      const response = await instance.put(`/api/cafes/${id}`, body);
      return response.data;
    },

    delete: async (id) => {
      await instance.delete(`/api/cafes/${id}`);
    },
  },

  // ── 리뷰 ─────────────────────────────────────────────
  reviews: {
    getAll: async () => {
      const response = await instance.get("/api/reviews");
      return response.data;
    },
    getByCafeId: async (cafeId) => {
      const response = await instance.get(`/api/reviews/cafe/${cafeId}`);
      return response.data;
    },
    // CafeTest.jsx 호환
    getByCafe: async (cafeId) => {
      const response = await instance.get(`/api/reviews/cafe/${cafeId}`);
      return response.data;
    },
    create: async (review) => {
      const response = await instance.post("/api/reviews", review);
      return response.data;
    },
    update: async (id, review) => {
      const response = await instance.put(`/api/reviews/${id}`, review);
      return response.data;
    },
    delete: async (id) => {
      await instance.delete(`/api/reviews/${id}`);
    },
  },

  // ── 게시판 ────────────────────────────────────────────
  posts: {
    getAll: async () => {
      const response = await instance.get("/api/posts");
      return response.data;
    },
    getById: async (id) => {
      const response = await instance.get(`/api/posts/${id}`);
      return response.data;
    },
    create: async (post) => {
      const response = await instance.post("/api/posts", post);
      return response.data;
    },
    delete: async (id) => {
      await instance.delete(`/api/posts/${id}`);
    },
    getComments: async (postId) => {
      const response = await instance.get(`/api/posts/${postId}/comments`);
      return response.data;
    },
    addComment: async (postId, comment) => {
      const response = await instance.post(
        `/api/posts/${postId}/comments`,
        comment,
      );
      return response.data;
    },
  },

  // ── 펫시터 ────────────────────────────────────────────
  sitters: {
    getAll: async () => {
      const response = await instance.get("/api/pet-sitter");
      return response.data;
    },
    getById: async (id) => {
      const response = await instance.get(`/api/pet-sitter/${id}`);
      return response.data;
    },
    create: async (sitter) => {
      const response = await instance.post("/api/pet-sitter", sitter);
      return response.data;
    },
    update: async (id, sitter) => {
      const response = await instance.put(`/api/pet-sitter/${id}`, sitter);
      return response.data;
    },
    delete: async (id) => {
      await instance.delete(`/api/pet-sitter/${id}`);
    },
  },

  // ── 즐겨찾기 ──────────────────────────────────────────
  favorites: {
    getByUser: async (userId) => {
      const response = await instance.get(`/api/favorites/${userId}`);
      return response.data;
    },
    add: async (userId, cafeId) => {
      const response = await instance.post("/api/favorites", {
        userId,
        cafeId,
      });
      return response.data;
    },
    remove: async (userId, cafeId) => {
      await instance.delete(`/api/favorites/${userId}/${cafeId}`);
    },
    // 기존 toggle 호환
    toggle: async (cafeId) => {
      const userId = localStorage.getItem("userId");
      const response = await instance.post(`/api/favorites/toggle/${cafeId}`, {
        userId,
      });
      return response.data;
    },
  },

  // ── 마이페이지 ────────────────────────────────────────
  my: {
    getPosts: async (userId) => {
      const response = await instance.get("/api/myactivity", {
        params: { userId },
      });
      return response.data.posts ?? [];
    },
    getReviews: async (userId) => {
      const response = await instance.get("/api/myactivity", {
        params: { userId },
      });
      return response.data.reviews ?? [];
    },
  },
};

export default instance;
