import React, { useState, useRef, useEffect } from "react";
import { activeAccount, resendOTP } from "../api/userSevices";
import { useNavigate } from "react-router-dom";

const OTPInputPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(60); // Thêm countdown state
  const [canResend, setCanResend] = useState(false); // Thêm state kiểm soát resend
  const inputRefs = useRef([]);
  const timerRef = useRef(null); // Ref cho timer
  const navigate = useNavigate();
  const email = localStorage.getItem("registeredEmail");

  // Initialize refs and start countdown
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
    console.log("Starting countdown..."); // Debug log
    startCountdown(); // Bắt đầu đếm ngược khi component mount

    return () => {
      console.log("Cleaning up timer..."); // Debug log
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Debug countdown changes
  useEffect(() => {
    console.log("Countdown:", countdown, "Can resend:", canResend);
  }, [countdown, canResend]);

  // Start countdown timer
  const startCountdown = () => {
    console.log("startCountdown called"); // Debug log

    // Clear existing timer if any
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setCountdown(60);
    setCanResend(false);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        console.log("Timer tick:", prev); // Debug log
        if (prev <= 1) {
          console.log("Timer finished!"); // Debug log
          setCanResend(true);
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    console.log("Timer started with ID:", timerRef.current); // Debug log
  };

  // Format time display (mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle input change
  const handleChange = (index, value) => {
    // Only allow numbers and limit to 1 character
    if (!/^\d*$/.test(value)) return;

    // Take only the last character if multiple characters are entered
    const digit = value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError("");

    // Auto focus next input
    if (digit && index < 5) {
      // Use setTimeout to ensure state update is complete
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
        // Clear current input if it has value
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // If current input is empty, clear and focus previous input
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

      // Focus the next empty input or last input
      const nextEmptyIndex = newOtp.findIndex((val) => val === "");
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
    }
  };

  // Submit OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Vui lòng nhập đầy đủ 6 số OTP");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await activeAccount(otpString);

      if (res && res.meta?.code === "200") {
        setSuccess("Xác thực OTP thành công!");
        setError("");
        localStorage.clear();
        navigate("/login");
      } else {
        setError(
          res?.meta?.message || "Mã OTP không chính xác. Vui lòng thử lại."
        );
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
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
      if (res && res.meta?.code === "200") {
        setSuccess("Đã gửi lại mã OTP!");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        startCountdown(); // Restart countdown sau khi gửi lại
      }
    } catch (err) {
      setError("Không thể gửi lại OTP. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all inputs
  const handleClear = () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setSuccess("");
    inputRefs.current[0]?.focus();
  };

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e3f2fd 0%, #c5cae9 100%)",
  };

  const cardStyle = {
    maxWidth: "400px",
    borderRadius: "1rem",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  };

  const iconContainerStyle = {
    width: "4rem",
    height: "4rem",
    backgroundColor: "#e3f2fd",
    borderRadius: "50%",
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center p-4"
      style={containerStyle}
    >
      <div className="card" style={cardStyle}>
        <div className="card-body p-4">
          {/* Header */}
          <div className="text-center mb-4">
            <div
              className="d-flex align-items-center justify-content-center mx-auto mb-3"
              style={iconContainerStyle}
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
              Nhập mã 6 số đã được gửi đến số điện thoại của bạn
            </p>
            {/* Countdown Timer */}
            <div className="d-flex justify-content-center align-items-center mb-3">
              <div
                className={`px-3 py-1 rounded-pill ${
                  countdown > 0 ? "bg-primary" : "bg-success"
                }`}
                style={{ fontSize: "0.9rem" }}
              >
                <span className="text-white fw-medium">
                  {countdown > 0 ? (
                    <>⏰ Mã hết hạn sau: {formatTime(countdown)}</>
                  ) : (
                    <>✅ Có thể gửi lại mã</>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit}>
            {/* OTP Input Fields */}
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
                    transition: "all 0.2s ease-in-out",
                    color: "#000000 !important",
                    backgroundColor: digit ? "#f8f9fa" : "#ffffff",
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
                    boxShadow: digit
                      ? "0 0 0 0.2rem rgba(13, 110, 253, 0.25)"
                      : "none",
                    fontFamily: "monospace, sans-serif",
                    lineHeight: "1",
                    padding: "0",
                    margin: "0",
                  }}
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* Error/Success Messages */}
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

            {/* Submit Button */}
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

          {/* Action Buttons */}
          <div className="d-flex justify-content-between align-items-center border-top pt-3">
            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading}
              className="btn btn-link text-primary p-0 text-decoration-none"
              style={{ fontSize: "0.875rem" }}
            >
              Gửi lại mã
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading}
              className="btn btn-link text-secondary p-0 text-decoration-none"
              style={{ fontSize: "0.875rem" }}
            >
              Xóa tất cả
            </button>
          </div>

          {/* Demo Info */}
          <div className="mt-3 p-3 bg-light rounded">
            <p
              className="text-center mb-0"
              style={{ fontSize: "0.75rem", color: "#6c757d" }}
            >
              <strong>Demo:</strong> Nhập{" "}
              <code className="bg-white px-1 rounded">123456</code> để xác thực
              thành công
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPInputPage;
