import React, { useState } from "react";
import { api } from "../../api/axiosApi";
import "../../styles/modal/FindAccountModal.css";

const INITIAL_INPUT = {
  email: "",
  phone: "",
  newPassword: "",
  confirmPassword: "",
};

const FindAccountModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("email");
  const [step, setStep] = useState(1);
  const [inputData, setInputData] = useState(INITIAL_INPUT);
  const [foundEmail, setFoundEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const resetState = (nextTab = activeTab) => {
    setActiveTab(nextTab);
    setStep(1);
    setInputData(INITIAL_INPUT);
    setFoundEmail("");
    setMessage("");
    setIsSubmitting(false);
  };

  const closeModal = () => {
    resetState();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (tab) => {
    resetState(tab);
  };

  const handleFindEmail = async () => {
    const phone = inputData.phone.trim();
    setMessage("");
    setFoundEmail("");

    if (!phone) {
      setMessage("핸드폰 번호를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await api.auth.findEmail(phone);
      setFoundEmail(data.email);
    } catch (error) {
      setMessage(error.response?.data?.message ?? "일치하는 정보가 없습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyAndNext = async () => {
    const email = inputData.email.trim();
    const phone = inputData.phone.trim();
    setMessage("");

    if (!email || !phone) {
      setMessage("이메일과 핸드폰 번호를 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.auth.verifyReset({ email, phone });
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.message ?? "정보가 일치하지 않습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    const email = inputData.email.trim();
    const phone = inputData.phone.trim();
    const newPassword = inputData.newPassword;

    setMessage("");

    if (!newPassword || !inputData.confirmPassword) {
      setMessage("새 비밀번호를 입력해주세요.");
      return;
    }

    if (newPassword !== inputData.confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("비밀번호는 8자 이상 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.auth.resetPassword({ email, phone, newPassword });
      alert("비밀번호가 성공적으로 변경되었습니다. 새로운 비밀번호로 로그인해주세요.");
      closeModal();
    } catch (error) {
      setMessage(error.response?.data?.message ?? "비밀번호 변경에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="find-modal-content">
        <button className="close-x" onClick={closeModal} type="button">
          &times;
        </button>

        {step === 1 ? (
          <>
            <div className="tab-menu">
              <button
                className={activeTab === "email" ? "active" : ""}
                onClick={() => handleTabChange("email")}
                type="button"
              >
                이메일 찾기
              </button>
              <button
                className={activeTab === "password" ? "active" : ""}
                onClick={() => handleTabChange("password")}
                type="button"
              >
                비밀번호 찾기
              </button>
            </div>
            <div className="find-form">
              {activeTab === "password" && (
                <div className="find-input-group">
                  <label htmlFor="find-email">이메일</label>
                  <input
                    id="find-email"
                    type="email"
                    name="email"
                    value={inputData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              )}
              <div className="find-input-group">
                <label htmlFor="find-phone">핸드폰 번호</label>
                <input
                  id="find-phone"
                  type="tel"
                  name="phone"
                  placeholder="숫자만 입력"
                  value={inputData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>

              {activeTab === "email" && foundEmail && (
                <div className="find-result-box">
                  찾으시는 이메일: {foundEmail}
                </div>
              )}

              {message && <p className="find-message">{message}</p>}

              <button
                className="find-submit-btn"
                disabled={isSubmitting}
                onClick={
                  activeTab === "email" ? handleFindEmail : handleVerifyAndNext
                }
                type="button"
              >
                {isSubmitting
                  ? "확인 중..."
                  : activeTab === "email"
                    ? "이메일 찾기"
                    : "다음 단계"}
              </button>
            </div>
          </>
        ) : (
          <div className="reset-form">
            <h3>새 비밀번호 설정</h3>
            <p className="reset-desc">새로 사용할 비밀번호를 입력해주세요.</p>
            <div className="find-input-group">
              <label htmlFor="new-password">새 비밀번호</label>
              <input
                id="new-password"
                type="password"
                name="newPassword"
                placeholder="8자 이상 입력"
                value={inputData.newPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
            <div className="find-input-group">
              <label htmlFor="confirm-password">비밀번호 확인</label>
              <input
                id="confirm-password"
                type="password"
                name="confirmPassword"
                placeholder="비밀번호를 다시 입력하세요"
                value={inputData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            {message && <p className="find-message">{message}</p>}

            <button
              className="find-submit-btn"
              disabled={isSubmitting}
              onClick={handleResetPassword}
              type="button"
            >
              {isSubmitting ? "저장 중..." : "비밀번호 저장하기"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindAccountModal;
