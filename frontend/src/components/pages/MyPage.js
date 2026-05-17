import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/pages/MyPage.css";

const API_BASE_URL = "http://localhost:8111";

const emptyPetData = {
  petName: "",
  petType: "소형견",
  breed: "",
  sizeType: "소형견",
  weight: "",
  description: "",
};

const MyPage = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("profile");
  const [userData, setUserData] = useState(null);
  const [petData, setPetData] = useState(emptyPetData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPageData = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const nickname = localStorage.getItem("nickname");

      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      const fallbackUser = {
        userId,
        nickname: nickname || "회원",
        email: localStorage.getItem("email") || "",
        phone: localStorage.getItem("phone") || "",
      };

      if (!userId) {
        setUserData(fallbackUser);
        setLoading(false);
        return;
      }

      try {
        const userResponse = await axios.get(
          `${API_BASE_URL}/api/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setUserData({ ...fallbackUser, ...userResponse.data });
      } catch (error) {
        console.error("회원 정보 조회 실패:", error);
        setUserData(fallbackUser);
      }

      try {
        const petResponse = await axios.get(
          `${API_BASE_URL}/api/users/${userId}/pet`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (petResponse.data) {
          setPetData({
            petName: petResponse.data.petName || "",
            petType: petResponse.data.petType || "소형견",
            breed: petResponse.data.breed || "",
            sizeType: petResponse.data.sizeType || "소형견",
            weight: petResponse.data.weight ?? "",
            description: petResponse.data.description || "",
          });
        }
      } catch (error) {
        console.error("강아지 정보 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPageData();
  }, [navigate]);

  const handlePetChange = (e) => {
    const { name, value } = e.target;
    setPetData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!userId || !token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (!petData.petName.trim()) {
      alert("강아지 이름을 입력해주세요.");
      return;
    }

    try {
      // 1. 강아지 정보 저장
      const petPayload = {
        ...petData,
        weight: petData.weight === "" ? null : Number(petData.weight),
      };

      const petResponse = await axios.put(
        `${API_BASE_URL}/api/users/${userId}/pet`,
        petPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (petResponse.data) {
        setPetData({
          petName: petResponse.data.petName || "",
          petType: petResponse.data.petType || "소형견",
          breed: petResponse.data.breed || "",
          sizeType: petResponse.data.sizeType || "소형견",
          weight: petResponse.data.weight ?? "",
          description: petResponse.data.description || "",
        });
      }

      // 2. 전화번호 저장
      await axios.put(
        `${API_BASE_URL}/api/users/${userId}/phone`,
        {
          phone: userData.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("정보가 저장되었습니다.");
    } catch (error) {
      console.error("정보 저장 실패:", error);
      alert("정보 저장에 실패했습니다.");
    }
  };
  if (loading) return <div className="mypage-container">로딩 중...</div>;
  if (!userData) return null;

  const renderProfile = () => (
    <div className="content-section">
      <div className="info-card">
        <h3>집사 정보</h3>

        <div className="input-group-row">
          <div className="input-item full">
            <label>닉네임</label>
            <input type="text" value={userData.nickname || ""} readOnly />
          </div>
        </div>

        <div className="input-group-row">
          <div className="input-item full">
            <label>전화번호</label>
            <input
              type="text"
              value={userData.phone || ""}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
              placeholder="전화번호를 입력해주세요"
            />
          </div>
        </div>
      </div>

      <div className="info-card mt-30">
        <h3>강아지 정보</h3>

        <div className="input-group-row">
          <div className="input-item full">
            <label>이름</label>
            <input
              type="text"
              name="petName"
              value={petData.petName}
              onChange={handlePetChange}
              placeholder="예: 몽치"
            />
          </div>
        </div>

        <div className="input-group-row">
          <div className="input-item half">
            <label>견종</label>
            <input
              type="text"
              name="breed"
              value={petData.breed}
              onChange={handlePetChange}
              placeholder="예: 포메라니안"
            />
          </div>

          <div className="input-item half">
            <label>크기</label>
            <select
              name="sizeType"
              value={petData.sizeType}
              onChange={handlePetChange}
            >
              <option value="소형견">소형견 (7kg 이하)</option>
              <option value="중형견">중형견 (15kg 이하)</option>
              <option value="대형견">대형견 (15kg 초과)</option>
            </select>
          </div>
        </div>

        <div className="input-group-row">
          <div className="input-item half">
            <label>반려동물 구분</label>
            <select
              name="petType"
              value={petData.petType}
              onChange={handlePetChange}
            >
              <option value="소형견">소형견</option>
              <option value="중형견">중형견</option>
              <option value="대형견">대형견</option>
              <option value="고양이">고양이</option>
            </select>
          </div>

          <div className="input-item half">
            <label>몸무게</label>
            <input
              type="number"
              name="weight"
              value={petData.weight}
              onChange={handlePetChange}
              placeholder="예: 5.5"
            />
          </div>
        </div>

        <div className="input-group-row">
          <div className="input-item full">
            <label>강아지 소개</label>
            <textarea
              name="description"
              value={petData.description}
              onChange={handlePetChange}
              placeholder="예: 활발하고 사람을 좋아하는 3살 남아입니다."
            />
          </div>
        </div>
      </div>

      <button type="button" className="save-btn" onClick={handleSave}>
        저장하기
      </button>
    </div>
  );

  return (
    <div className="mypage-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>마이페이지</h2>
        </div>

        <ul className="menu-list">
          <li
            className={activeMenu === "profile" ? "active" : ""}
            onClick={() => setActiveMenu("profile")}
          >
            <i className="ri-user-line"></i> 내 정보
          </li>
          <li
            className={activeMenu === "wishlist" ? "active" : ""}
            onClick={() => setActiveMenu("wishlist")}
          >
            <i className="ri-heart-line"></i> 찜목록
          </li>
          <li
            className={activeMenu === "posts" ? "active" : ""}
            onClick={() => setActiveMenu("posts")}
          >
            <i className="ri-file-list-line"></i> 내 게시물
          </li>
          <li
            className={activeMenu === "reviews" ? "active" : ""}
            onClick={() => setActiveMenu("reviews")}
          >
            <i className="ri-star-line"></i> 리뷰
          </li>
        </ul>
      </div>

      <div className="main-content">
        {activeMenu === "profile" && renderProfile()}
        {activeMenu === "wishlist" && (
          <div className="content-section">
            <div className="no-data">
              <p>찜목록 기능은 추후 연결 예정입니다.</p>
            </div>
          </div>
        )}
        {activeMenu === "posts" && (
          <div className="content-section">
            <div className="no-data">
              <p>내 게시물 기능은 추후 연결 예정입니다.</p>
            </div>
          </div>
        )}
        {activeMenu === "reviews" && (
          <div className="content-section">
            <div className="no-data">
              <p>리뷰 기능은 추후 연결 예정입니다.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;
