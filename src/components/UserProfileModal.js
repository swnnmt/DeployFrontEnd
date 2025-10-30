import React, { useState, useEffect } from "react";
import { getProfile } from "../api/authService";
import { updateProfile } from "../api/userSevices";
import { Camera, Mail } from "lucide-react";

const UserProfileModal = ({ isOpen, onClose, userProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile || {});
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const localUser = JSON.parse(localStorage.getItem("user"));
      if (localUser) {
        setProfile(localUser);
        setEditedProfile(localUser);
      }

      const fetchProfile = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("Không tìm thấy token, vui lòng login lại");
            return;
          }

          const data = await getProfile(token);
          setProfile(data.data);
          setEditedProfile(data.data);
          localStorage.setItem("user", JSON.stringify(data.data));
        } catch (err) {
          console.error("Lỗi khi load profile:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 🖼️ Xử lý chọn ảnh & convert sang base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile((prev) => ({
          ...prev,
          avatarUrl: reader.result, // base64 string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const res = await updateProfile(
        editedProfile.firstName,
        editedProfile.lastName,
        editedProfile.phoneNumber,
        editedProfile.address,
        editedProfile.department,
        editedProfile.gender,
        editedProfile.avatarUrl // 👈 gửi base64 avatar
      );

      const updatedData = res?.data || res;

      setProfile(updatedData);
      setEditedProfile(updatedData);
      localStorage.setItem("user", JSON.stringify(updatedData));

      setIsEditing(false);
      setSelectedImage(null);
      console.log("Profile updated:", updatedData);
    } catch (err) {
      console.error("Lỗi khi cập nhật profile:", err);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setSelectedImage(null);
    setIsEditing(false);
  };

  const getGenderDisplay = (gender) =>
    gender === "MALE" ? "Nam" : gender === "FEMALE" ? "Nữ" : "Khác";

  const getAvatarInitials = (firstName, lastName) =>
    `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content" style={{ borderRadius: "1rem" }}>
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">
              {isEditing ? "Chỉnh sửa thông tin" : "Thông tin cá nhân"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              style={{ fontSize: "0.8rem" }}
            ></button>
          </div>

          <div className="modal-body pt-2">
            {/* 🖼️ Avatar Section */}
            <div className="text-center mb-4 position-relative">
              {editedProfile.avatarUrl ? (
                <img
                  src={editedProfile.avatarUrl}
                  alt="Avatar"
                  className="rounded-circle object-cover"
                  style={{ width: "90px", height: "90px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold"
                  style={{
                    width: "90px",
                    height: "90px",
                    backgroundColor: "#0d6efd",
                    fontSize: "1.5rem",
                  }}
                >
                  {getAvatarInitials(profile.firstName, profile.lastName)}
                </div>
              )}

              {/* Nút camera khi chỉnh sửa */}
              {isEditing && (
                <>
                  <label
                    htmlFor="avatarUpload"
                    className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-2 cursor-pointer"
                    style={{ cursor: "pointer" }}
                  >
                    <Camera size={16} color="#fff" />
                  </label>
                  <input
                    type="file"
                    id="avatarUpload"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </>
              )}

              <h6 className="mt-2 mb-0 fw-bold">
                {profile.firstName} {profile.lastName}
              </h6>
              <small className="text-muted">{profile.email}</small>
            </div>

            {/* Form thông tin */}
            <div className="row g-3">
              {/* Họ */}
              <div className="col-6">
                <label className="form-label fw-semibold text-muted">Họ</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editedProfile.firstName || ""}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                  />
                ) : (
                  <div className="p-2 bg-light rounded">
                    {profile.firstName}
                  </div>
                )}
              </div>

              {/* Tên */}
              <div className="col-6">
                <label className="form-label fw-semibold text-muted">Tên</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editedProfile.lastName || ""}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                  />
                ) : (
                  <div className="p-2 bg-light rounded">{profile.lastName}</div>
                )}
              </div>

              {/* Email */}
              <div className="col-12">
                <label className="form-label fw-semibold text-muted">
                  Email
                </label>
                <div className="p-2 bg-light rounded d-flex align-items-center">
                  <Mail size={16} className="me-2 text-primary" />
                  {profile.email}
                </div>
              </div>

              {/* Số điện thoại */}
              <div className="col-6">
                <label className="form-label fw-semibold text-muted">
                  Số điện thoại
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    className="form-control"
                    value={editedProfile.phoneNumber || ""}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                  />
                ) : (
                  <div className="p-2 bg-light rounded d-flex align-items-center">
                    <span className="me-2">📱</span>
                    {profile.phoneNumber}
                  </div>
                )}
              </div>

              {/* Giới tính */}
              <div className="col-6">
                <label className="form-label fw-semibold text-muted">
                  Giới tính
                </label>
                {isEditing ? (
                  <select
                    className="form-select"
                    value={editedProfile.gender || ""}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                ) : (
                  <div className="p-2 bg-light rounded d-flex align-items-center">
                    {getGenderDisplay(profile.gender)}
                  </div>
                )}
              </div>

              {/* Phòng ban */}
              <div className="col-6">
                <label className="form-label fw-semibold text-muted">
                  Phòng ban
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editedProfile.department || ""}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                  />
                ) : (
                  <div className="p-2 bg-light rounded d-flex align-items-center">
                    <span className="me-2">🏢</span>
                    {profile.department}
                  </div>
                )}
              </div>

              {/* Địa chỉ */}
              <div className="col-6">
                <label className="form-label fw-semibold text-muted">
                  Địa chỉ
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editedProfile.address || ""}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                  />
                ) : (
                  <div className="p-2 bg-light rounded d-flex align-items-center">
                    <span className="me-2">📍</span>
                    {profile.address}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 pt-2 d-flex flex-column gap-2">
            {isEditing ? (
              <div className="d-flex gap-2 w-100">
                <button
                  type="button"
                  className="btn btn-outline-secondary flex-fill"
                  onClick={handleCancel}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-primary flex-fill"
                  onClick={handleSave}
                >
                  Lưu thay đổi
                </button>
              </div>
            ) : (
              <>
                <div className="d-flex gap-2 w-100">
                  <button
                    type="button"
                    className="btn btn-outline-primary flex-fill"
                    onClick={() => {
                      setEditedProfile(profile);
                      setIsEditing(true);
                    }}
                  >
                    ✏️ Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary flex-fill"
                    onClick={onClose}
                  >
                    Đóng
                  </button>
                </div>

                {/* ✅ Nút mới: Đăng bán */}
                <button
                  type="button"
                  className="btn btn-success w-100"
                  onClick={() => {
                    onClose();
                    window.location.href = "/marketplace/create"; // chuyển trang tạo sản phẩm
                  }}
                >
                  🛒 Đăng bán
                </button>

                {/* ✅ Nút mới: Sản phẩm của tôi */}
                <button
                  type="button"
                  className="btn btn-info w-100"
                  onClick={() => {
                    onClose();
                    window.location.href = "/marketplace/my-products"; // chuyển trang danh sách sản phẩm
                  }}
                >
                  📦 Sản phẩm của tôi
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
