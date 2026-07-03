import React, { useMemo, useState } from "react";
import "../../styles/pages/Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/axiosApi";

const TERM_CONTENT = `
[이용약관 및 개인정보 수집 동의]

1. 수집 항목: 이메일, 닉네임, 비밀번호, 연락처
2. 수집 목적: 꼬리사랑 회원 관리 및 서비스 제공
3. 보유 기간: 회원 탈퇴 시까지
4. 동의 거부권: 동의를 거부할 수 있으나 회원가입이 제한될 수 있습니다.

꼬리사랑을 이용해주셔서 감사합니다.
`;

const initialFormData = {
  email: "",
  nickname: "",
  password: "",
  confirmPassword: "",
  phone: "",
};

const PASSWORD_RULE_MESSAGE = "비밀번호는 영문과 숫자를 포함해 8~16자로 입력해주세요.";
const PHONE_RULE_MESSAGE = "연락처는 '-' 없이 숫자 11자리로 입력해주세요.";

const normalizePhone = (value) => value.replace(/\D/g, "").slice(0, 11);

const getPasswordError = (password) => {
  if (!password) return "";
  return /^(?=.*[A-Za-z])(?=.*\d).{8,16}$/.test(password)
    ? ""
    : PASSWORD_RULE_MESSAGE;
};

const getConfirmPasswordError = (password, confirmPassword) => {
  if (!confirmPassword) return "";
  return password === confirmPassword ? "" : "비밀번호가 일치하지 않습니다.";
};

const getApiErrorMessage = (error, fallbackMessage) => {
  if (!error.response) {
    return "서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인해주세요.";
  }

  if (error.response.status >= 500) {
    return "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }

  return fallbackMessage;
};

const Signup = () => {
  const navigate = useNavigate();

  const [isAgreed, setIsAgreed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateStatus, setDuplicateStatus] = useState({
    email: "idle",
    nickname: "idle",
  });

  const livePasswordError =
    fieldErrors.password || getPasswordError(formData.password);
  const liveConfirmPasswordError =
    fieldErrors.confirmPassword ||
    getConfirmPasswordError(formData.password, formData.confirmPassword);

  const canSubmit = useMemo(
    () =>
      duplicateStatus.email === "available" &&
      duplicateStatus.nickname === "available" &&
      !isSubmitting,
    [duplicateStatus, isSubmitting],
  );

  const validateForm = () => {
    const errors = {};
    const email = formData.email.trim();
    const nickname = formData.nickname.trim();
    const password = formData.password;
    const phone = formData.phone.trim();
    const passwordError = getPasswordError(password);
    const confirmPasswordError = getConfirmPasswordError(
      password,
      formData.confirmPassword,
    );

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "올바른 이메일 형식으로 입력해주세요.";
    }

    if (nickname.length < 2 || nickname.length > 12) {
      errors.nickname = "닉네임은 2~12자로 입력해주세요.";
    }

    if (passwordError) {
      errors.password = passwordError;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "비밀번호 확인을 입력해주세요.";
    } else if (confirmPasswordError) {
      errors.confirmPassword = confirmPasswordError;
    }

    if (!/^010\d{8}$/.test(phone)) {
      errors.phone = PHONE_RULE_MESSAGE;
    }

    if (!isAgreed) {
      errors.agreement = "이용약관 및 개인정보 수집에 동의해주세요.";
    }

    if (duplicateStatus.email !== "available") {
      errors.email = "이메일 중복 확인을 완료해주세요.";
    }

    if (duplicateStatus.nickname !== "available") {
      errors.nickname = "닉네임 중복 확인을 완료해주세요.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue = name === "phone" ? normalizePhone(value) : value;

    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setFormMessage("");

    if (name === "email" || name === "nickname") {
      setDuplicateStatus((prev) => ({ ...prev, [name]: "idle" }));
    }
  };

  const checkDuplicate = async (field) => {
    const value = formData[field].trim();
    const isEmail = field === "email";

    if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setFieldErrors((prev) => ({
        ...prev,
        email: "올바른 이메일 형식으로 입력해주세요.",
      }));
      return;
    }

    if (!isEmail && (value.length < 2 || value.length > 12)) {
      setFieldErrors((prev) => ({
        ...prev,
        nickname: "닉네임은 2~12자로 입력해주세요.",
      }));
      return;
    }

    setDuplicateStatus((prev) => ({ ...prev, [field]: "checking" }));

    try {
      const duplicated = isEmail
        ? await api.auth.checkEmail(value)
        : await api.auth.checkNickname(value);

      setDuplicateStatus((prev) => ({
        ...prev,
        [field]: duplicated ? "duplicated" : "available",
      }));
      setFieldErrors((prev) => ({
        ...prev,
        [field]: duplicated
          ? `이미 사용 중인 ${isEmail ? "이메일" : "닉네임"}입니다.`
          : "",
      }));
    } catch (error) {
      console.error("중복 확인 실패:", error);
      setDuplicateStatus((prev) => ({ ...prev, [field]: "idle" }));
      setFieldErrors((prev) => ({
        ...prev,
        [field]: getApiErrorMessage(
          error,
          "중복 확인 중 오류가 발생했습니다.",
        ),
      }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setFormMessage("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await api.auth.signup({
        email: formData.email.trim(),
        nickname: formData.nickname.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
      });

      alert("회원가입이 완료되었습니다");
navigate("/login", { replace: true });
    } catch (error) {
      console.error("회원가입 실패:", error);
      setFormMessage(
        getApiErrorMessage(
          error,
          "회원가입에 실패했습니다. 입력 정보를 다시 확인해주세요.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDuplicateMessage = (field) => {
    if (duplicateStatus[field] === "available") {
      return (
        <p className="field-message success">
          사용 가능한 {field === "email" ? "이메일" : "닉네임"}입니다.
        </p>
      );
    }

    if (fieldErrors[field]) {
      return <p className="field-message error">{fieldErrors[field]}</p>;
    }

    return null;
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <div className="logo-area">
          <div className="temp-logo-icon" aria-hidden="true">
            🐾
          </div>
          <span className="logo-text">꼬리사랑</span>
        </div>
        <p className="sub-title">회원 정보를 입력하고 꼬리사랑을 시작해보세요.</p>

        <form className="auth-form" onSubmit={handleSignup} noValidate>
          <h2>회원가입</h2>

          <div className="input-group">
            <label htmlFor="signup-email">이메일</label>
            <div className="input-with-button">
              <input
                id="signup-email"
                type="email"
                name="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
              <button
                type="button"
                className="check-btn"
                onClick={() => checkDuplicate("email")}
                disabled={duplicateStatus.email === "checking"}
              >
                {duplicateStatus.email === "checking" ? "확인중" : "중복확인"}
              </button>
            </div>
            {renderDuplicateMessage("email")}
          </div>

          <div className="input-group">
            <label htmlFor="signup-nickname">닉네임</label>
            <div className="input-with-button">
              <input
                id="signup-nickname"
                type="text"
                name="nickname"
                placeholder="2~12자 닉네임"
                value={formData.nickname}
                onChange={handleChange}
                autoComplete="nickname"
                required
              />
              <button
                type="button"
                className="check-btn"
                onClick={() => checkDuplicate("nickname")}
                disabled={duplicateStatus.nickname === "checking"}
              >
                {duplicateStatus.nickname === "checking" ? "확인중" : "중복확인"}
              </button>
            </div>
            {renderDuplicateMessage("nickname")}
          </div>

          <div className="input-group">
            <label htmlFor="signup-password">비밀번호</label>
            <input
              id="signup-password"
              type="password"
              name="password"
              placeholder="영문과 숫자 포함 8~16자"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            {livePasswordError && (
              <p className="field-message error">{livePasswordError}</p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="signup-confirm-password">비밀번호 확인</label>
            <input
              id="signup-confirm-password"
              type="password"
              name="confirmPassword"
              placeholder="비밀번호를 한 번 더 입력해주세요"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            {liveConfirmPasswordError && (
              <p className="field-message error">{liveConfirmPasswordError}</p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="signup-phone">연락처</label>
            <input
              id="signup-phone"
              type="tel"
              name="phone"
              placeholder="01000000000"
              value={formData.phone}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={11}
              autoComplete="tel"
              required
            />
            {fieldErrors.phone && (
              <p className="field-message error">{fieldErrors.phone}</p>
            )}
          </div>

          <div className="term-options">
            <label className="term-label">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => {
                  setIsAgreed(e.target.checked);
                  setFieldErrors((prev) => ({ ...prev, agreement: "" }));
                }}
              />
              <span>이용약관 및 개인정보 수집에 동의합니다.</span>
            </label>
            <button
              type="button"
              className="text-link-button term-view-link"
              onClick={() => setShowModal(true)}
            >
              약관 보기
            </button>
          </div>
          {fieldErrors.agreement && (
            <p className="field-message error">{fieldErrors.agreement}</p>
          )}

          {showModal && (
            <div className="term-modal-overlay">
              <div className="term-modal-content" role="dialog" aria-modal="true">
                <h3>이용약관</h3>
                <pre className="term-text">{TERM_CONTENT}</pre>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setShowModal(false)}
                >
                  닫기
                </button>
              </div>
            </div>
          )}

          {formMessage && (
            <p
              className={`form-message ${
                formMessage.includes("완료") ? "success" : "error"
              }`}
            >
              {formMessage}
            </p>
          )}

          <button
            type="submit"
            className="main-submit-btn signup-btn"
            disabled={!canSubmit}
          >
            {isSubmitting ? "가입 중..." : "가입하기"}
          </button>
        </form>

        <p className="bottom-link">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="login-link">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
