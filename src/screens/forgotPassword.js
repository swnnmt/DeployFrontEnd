import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { resendOTP, forgotPassword, verifyForgotOTP } from "../api/userSevices";

const ForgotPasswordPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const timerRef = useRef(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Countdown effect
  useEffect(() => {
    if (isOtpStep) {
      inputRefs.current = inputRefs.current.slice(0, 6);
      startCountdown();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [isOtpStep]);

  const startCountdown = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setCountdown(60);
    setCanResend(false);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle email submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email) {
      setError("Vui lòng nhập địa chỉ email");
      return;
    }
    if (!validateEmail(email)) {
      setError("Định dạng email không hợp lệ");
      return;
    }
    setIsLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res) {
        setIsEmailSent(true);
        setIsOtpStep(true);
        setSuccess(
          "Email khôi phục mật khẩu đã được gửi thành công! Vui lòng nhập OTP để xác thực."
        );
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input change
  const handleChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;
    const digit = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError("");
    if (digit && index < 5) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 0);
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        setTimeout(() => {
          inputRefs.current[index - 1]?.focus();
        }, 0);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "Delete") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const digits = pasteData.replace(/\D/g, "").slice(0, 6);
    if (digits.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = digits[i] || "";
      }
      setOtp(newOtp);
      const nextEmptyIndex = newOtp.findIndex((val) => val === "");
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
    }
  };

  // Handle OTP submit
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Vui lòng nhập đủ 6 ký tự OTP");
      return;
    }
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await verifyForgotOTP(email, otpString);
      if (res) {
        setSuccess("Mật khẩu mới đã được gửi về email của bạn!");
        setIsOtpStep(false);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Xác thực OTP thất bại. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (!canResend || isLoading) return;
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await resendOTP(email);
      if (res) {
        setSuccess("Đã gửi lại mã OTP!");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        startCountdown();
      }
    } catch (err) {
      setError("Không thể gửi lại OTP. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setEmail("");
    setOtp(["", "", "", "", "", ""]);
    setIsEmailSent(false);
    setIsOtpStep(false);
    setError("");
    setSuccess("");
  };

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  };

  const cardStyle = {
    maxWidth: "450px",
    borderRadius: "1rem",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  };

  const iconContainerStyle = {
    width: "5rem",
    height: "5rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
    backdropFilter: "blur(10px)",
  };

  if (isEmailSent) {
    // Nếu đang ở bước nhập OTP
    if (isOtpStep) {
      return (
        <div
          className="d-flex align-items-center justify-content-center p-4"
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #e3f2fd 0%, #c5cae9 100%)",
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: "400px",
              borderRadius: "1rem",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <div
                  className="d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{
                    width: "4rem",
                    height: "4rem",
                    backgroundColor: "#e3f2fd",
                    borderRadius: "50%",
                  }}
                >
                  <svg
                    width="32"
                    height="32"
                    fill="none"
                    stroke="#1976d2"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h2 className="h3 fw-bold text-dark mb-2">Xác thực OTP</h2>
                <p className="text-muted mb-2">
                  Nhập mã 6 số đã được gửi đến email{" "}
                  <strong className="text-primary">{email}</strong>
                </p>
                <div className="d-flex justify-content-center align-items-center mb-3">
                  <div
                    className={`px-3 py-1 rounded-pill ${
                      countdown > 0 ? "bg-primary" : "bg-success"
                    }`}
                    style={{ fontSize: "0.9rem" }}
                  >
                    <span className="text-white fw-medium">
                      {countdown > 0 ? (
                        <>
                          ⏰ Mã hết hạn sau:{" "}
                          {`${String(Math.floor(countdown / 60)).padStart(
                            2,
                            "0"
                          )}:${String(countdown % 60).padStart(2, "0")}`}
                        </>
                      ) : (
                        <>✅ Có thể gửi lại mã</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <form onSubmit={handleOtpSubmit}>
                <div
                  className="d-flex justify-content-center mb-3"
                  style={{ gap: "0.5rem" }}
                >
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      onFocus={(e) => e.target.select()}
                      style={{
                        width: "3rem",
                        height: "3rem",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        textAlign: "center",
                        borderRadius: "0.5rem",
                        color: "#000",
                        backgroundColor: digit ? "#f8f9fa" : "#fff",
                        border: `2px solid ${
                          error
                            ? "#dc3545"
                            : success
                            ? "#198754"
                            : digit
                            ? "#0d6efd"
                            : "#ced4da"
                        }`,
                        outline: "none",
                        fontFamily: "monospace, sans-serif",
                        lineHeight: "1",
                        padding: "0",
                        margin: "0",
                      }}
                      disabled={isLoading}
                    />
                  ))}
                </div>
                {error && (
                  <div className="text-center mb-3">
                    <small className="text-danger fw-medium">{error}</small>
                  </div>
                )}
                {success && (
                  <div className="text-center mb-3">
                    <small className="text-success fw-medium">{success}</small>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isLoading || otp.join("").length !== 6}
                  className={`btn w-100 py-2 mb-3 ${
                    isLoading || otp.join("").length !== 6
                      ? "btn-secondary"
                      : "btn-primary"
                  }`}
                >
                  {isLoading ? (
                    <div className="d-flex align-items-center justify-content-center">
                      <div
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Đang xác thực...
                    </div>
                  ) : (
                    "Xác thực OTP"
                  )}
                </button>
              </form>
              <div className="d-flex justify-content-between align-items-center border-top pt-3">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isLoading || !canResend}
                  className="btn btn-link text-primary p-0 text-decoration-none"
                  style={{ fontSize: "0.875rem" }}
                >
                  Gửi lại mã
                </button>
                <button
                  type="button"
                  onClick={() => setOtp(["", "", "", "", "", ""])}
                  disabled={isLoading}
                  className="btn btn-link text-secondary p-0 text-decoration-none"
                  style={{ fontSize: "0.875rem" }}
                >
                  Xóa tất cả
                </button>
              </div>
              <div className="mt-3 p-3 bg-light rounded">
                <p
                  className="text-center mb-0"
                  style={{ fontSize: "0.75rem", color: "#6c757d" }}
                >
                  <strong>Demo:</strong> Nhập{" "}
                  <code className="bg-white px-1 rounded">123456</code> để xác
                  thực thành công
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    // Nếu đã xác thực OTP thành công
    return (
      <div
        className="d-flex align-items-center justify-content-center p-4"
        style={containerStyle}
      >
        <div className="card bg-white" style={cardStyle}>
          <div className="card-body p-5">
            <div className="text-center">
              <div
                className="d-flex align-items-center justify-content-center mx-auto mb-4"
                style={{
                  width: "5rem",
                  height: "5rem",
                  backgroundColor: "#d4edda",
                  borderRadius: "50%",
                }}
              >
                <svg width="36" height="36" fill="#28a745" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="h3 fw-bold text-dark mb-3">Thành công!</h2>
              <p className="text-muted mb-4">
                Mật khẩu mới đã được gửi về email: <br />
                <strong className="text-primary">{email}</strong>
              </p>
              <div className="alert alert-info" role="alert">
                <div className="d-flex align-items-center">
                  <span className="me-2">💡</span>
                  <div className="text-start">
                    <strong>Lưu ý:</strong>
                    <ul className="mb-0 mt-1" style={{ fontSize: "0.9rem" }}>
                      <li>Kiểm tra cả thư mục spam/junk</li>
                      <li>Mật khẩu mới chỉ sử dụng được 1 lần</li>
                      <li>Đăng nhập và đổi mật khẩu ngay sau khi nhận được</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate("/login")}
                >
                  Quay lại đăng nhập
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleReset}
                >
                  Gửi lại email khác
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center p-4"
      style={containerStyle}
    >
      <div className="card bg-white" style={cardStyle}>
        <div className="card-body p-5">
          {/* Header */}
          <div className="text-center mb-4">
            {/* Icon */}
            <div
              className="d-flex align-items-center justify-content-center mx-auto mb-4"
              style={iconContainerStyle}
            >
              <svg width="40" height="40" fill="#667eea" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .51-.1 1-.24 1.46l-1.13-1.13c.08-.27.12-.55.12-.83 0-1.93-1.57-3.5-3.5-3.5S8.75 10.57 8.75 12.5s1.57 3.5 3.5 3.5c.28 0 .56-.04.83-.12l1.13 1.13C13.75 16.9 12.9 17 12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5z" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
            </div>

            <h2 className="h3 fw-bold text-dark mb-2">Quên mật khẩu?</h2>
            <p className="text-muted">
              Không sao! Nhập email của bạn và chúng tôi sẽ gửi OTP khôi phục
              mật khẩu.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="form-label fw-semibold">
                Địa chỉ Email
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  className={`form-control border-start-0 ${
                    error ? "border-danger" : success ? "border-success" : ""
                  }`}
                  id="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  disabled={isLoading}
                  style={{
                    fontSize: "1rem",
                    padding: "0.75rem 1rem",
                  }}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-danger" role="alert">
                <div className="d-flex align-items-center">
                  <span className="me-2">⚠️</span>
                  {error}
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="alert alert-success" role="alert">
                <div className="d-flex align-items-center">
                  <span className="me-2">✅</span>
                  {success}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="d-grid mb-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`btn btn-lg ${
                  isLoading ? "btn-secondary" : "btn-primary"
                }`}
                style={{ padding: "0.75rem" }}
              >
                {isLoading ? (
                  <div className="d-flex align-items-center justify-content-center">
                    <div
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Đang gửi...
                  </div>
                ) : (
                  <>📧 Gửi mã OTP khôi phục</>
                )}
              </button>
            </div>
          </form>

          {/* Back to Login */}
          <div className="text-center">
            <button
              type="button"
              className="btn btn-link text-decoration-none p-0"
              onClick={() => navigate("/login")}
              disabled={isLoading}
            >
              <svg
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="me-1"
              >
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
              Quay lại đăng nhập
            </button>
          </div>

          {/* Help Section */}
          <div className="mt-4 pt-4 border-top">
            <div className="text-center">
              <small className="text-muted">
                Cần hỗ trợ? Liên hệ{" "}
                <a
                  href="mailto:support@example.com"
                  className="text-decoration-none"
                >
                  campverse8386@gmail.com
                </a>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
