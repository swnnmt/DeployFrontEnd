import React, { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { changePassword } from "../api/userSevices";
const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    if (
      !formData.oldPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError("Vui lòng điền đầy đủ thông tin");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu mới và xác nhận không khớp");
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await changePassword(
        formData.oldPassword,
        formData.newPassword,
        formData.confirmPassword
      );
      setSuccess("Đổi mật khẩu thành công!");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });

      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 1500);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Có lỗi xảy ra, vui lòng thử lại";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>
        {`
          .modal-backdrop-custom {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            z-index: 1050;
          }
          
          .modal-header-gradient {
            background: linear-gradient(135deg, #0d6efd 0%, #6610f2 100%);
            border-radius: 1rem 1rem 0 0;
          }
          
          .input-password-wrapper {
            position: relative;
          }
          
          .input-password {
            border-radius: 0.75rem;
            border: 2px solid #e9ecef;
            padding: 0.75rem 3rem 0.75rem 1rem;
            transition: all 0.2s;
          }
          
          .input-password:focus {
            border-color: #0d6efd;
            box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
          }
          
          .eye-icon-btn {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #6c757d;
            cursor: pointer;
            padding: 0.25rem;
            transition: color 0.2s;
          }
          
          .eye-icon-btn:hover {
            color: #495057;
          }
          
          .btn-gradient {
            background: linear-gradient(135deg, #0d6efd 0%, #6610f2 100%);
            border: none;
            border-radius: 0.75rem;
            font-weight: 600;
            transition: all 0.2s;
          }
          
          .btn-gradient:hover:not(:disabled) {
            background: linear-gradient(135deg, #0b5ed7 0%, #520dc2 100%);
            box-shadow: 0 0.5rem 1rem rgba(13, 110, 253, 0.3);
            transform: translateY(-1px);
          }
          
          .btn-gradient:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          
          .btn-cancel {
            border-radius: 0.75rem;
            font-weight: 600;
            transition: all 0.2s;
          }
          
          .alert-custom {
            border-radius: 0.75rem;
            border: 1px solid;
            display: flex;
            align-items: start;
            gap: 0.75rem;
          }
          
          .spinner-border-sm {
            width: 1.25rem;
            height: 1.25rem;
            border-width: 0.2em;
          }
        `}
      </style>

      <div className="modal-backdrop-custom" onClick={onClose}>
        <div className="modal show d-block" tabIndex="-1">
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content" style={{ borderRadius: "1rem" }}>
              {/* Header */}
              <div className="modal-header modal-header-gradient border-0 text-white position-relative">
                <div className="d-flex align-items-center gap-3">
                  <Lock color="#ffffff" strokeWidth={2.5} size={24} />

                  <h5 className="modal-title fw-bold mb-0">Đổi mật khẩu</h5>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={onClose}
                  disabled={loading}
                  aria-label="Close"
                  style={{
                    opacity: 0.9,
                  }}
                ></button>
              </div>

              {/* Body */}
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary small">
                    Mật khẩu cũ
                  </label>
                  <div className="input-password-wrapper">
                    <input
                      type={showPasswords.old ? "text" : "password"}
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleInputChange}
                      className="form-control input-password"
                      placeholder="Nhập mật khẩu cũ"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="eye-icon-btn"
                      onClick={() => togglePasswordVisibility("old")}
                      tabIndex={-1}
                    >
                      {showPasswords.old ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary small">
                    Mật khẩu mới
                  </label>
                  <div className="input-password-wrapper">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="form-control input-password"
                      placeholder="Nhập mật khẩu mới"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="eye-icon-btn"
                      onClick={() => togglePasswordVisibility("new")}
                      tabIndex={-1}
                    >
                      {showPasswords.new ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary small">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="input-password-wrapper">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="form-control input-password"
                      placeholder="Nhập lại mật khẩu mới"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="eye-icon-btn"
                      onClick={() => togglePasswordVisibility("confirm")}
                      tabIndex={-1}
                    >
                      {showPasswords.confirm ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger alert-custom mb-3">
                    <AlertCircle size={20} className="flex-shrink-0 mt-1" />
                    <div className="small fw-medium">{error}</div>
                  </div>
                )}

                {success && (
                  <div className="alert alert-success alert-custom mb-3">
                    <CheckCircle size={20} className="flex-shrink-0 mt-1" />
                    <div className="small fw-medium">{success}</div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="modal-footer border-0 px-4 pb-4 pt-0">
                <button
                  type="button"
                  className="btn btn-light btn-cancel flex-fill"
                  onClick={onClose}
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-gradient text-white flex-fill"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Đang xử lý...
                    </span>
                  ) : (
                    "Đổi mật khẩu"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordModal;
