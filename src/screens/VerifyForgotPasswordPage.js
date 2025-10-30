import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { verifyForgotOTP } from "../api/userSevices";

const VerifyForgotPasswordPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const email = localStorage.getItem("forgotEmail") || "";

  // style giống bạn gửi
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

  const handleChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;
    const digit = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Vui lòng nhập đủ 6 số OTP");
      return;
    }
    try {
      const res = await verifyForgotOTP(email, otpString);
      if (res) {
        setIsSuccess(true);
        localStorage.removeItem("forgotEmail");
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP không hợp lệ");
    }
  };

  const handleReset = () => {
    localStorage.removeItem("forgotEmail");
    navigate("/forgot-password");
  };

  // Nếu verify thành công thì show card
  if (isSuccess) {
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

  // Nếu chưa verify thì show form OTP
  return (
    <div className="container mt-5">
      <h2>Xác thực OTP</h2>
      <p>
        Nhập mã OTP đã gửi đến email: <strong>{email}</strong>
      </p>
      <form onSubmit={handleSubmit}>
        <div className="d-flex gap-2 mb-3">
          {otp.map((val, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              value={val}
              ref={(el) => (inputRefs.current[idx] = el)}
              onChange={(e) => handleChange(idx, e.target.value)}
              className="form-control text-center"
              style={{ width: "40px" }}
            />
          ))}
        </div>
        {error && <div className="text-danger mb-2">{error}</div>}
        <button className="btn btn-success">Xác nhận</button>
      </form>
    </div>
  );
};

export default VerifyForgotPasswordPage;
