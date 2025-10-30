import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderLogin from "../components/HeaderLogin";
import FooterLogin from "../components/FooterHome";
import { login } from "../api/authService";
import { register } from "../api/userSevices";
import { registerPartner } from "../api/partnerService";
import "material-design-iconic-font/dist/css/material-design-iconic-font.min.css";
import "./AuthPage.css";

const AuthPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [registerType, setRegisterType] = useState("user"); // 'user' hoặc 'partner'
  const [nameCamping, setNameCamping] = useState("");
  const [addressCamping, setAddressCamping] = useState("");
  const [addressPartner, setAddressPartner] = useState("");
  const [descriptionCamping, setDescriptionCamping] = useState("");
  const [campingImage, setCampingImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Lỗi decode token:", e);
      return null;
    }
  };

  const getRoleFromToken = (decoded) => {
    if (!decoded || !decoded.roles) return "GUEST";

    const authorities = decoded.roles.map((r) => r.authority);

    const isAdmin = [
      "ROLE_ADMIN",
      "ROLE_MAKE",
      "ROLE_CHECK",
      "ROLE_READ",
      "ROLE_DELETE",
    ].every((perm) => authorities.includes(perm));
    if (isAdmin) return "ADMIN";

    if (authorities.includes("ROLE_PARTNER")) return "PARTNER";
    if (authorities.includes("ROLE_USER")) return "USER";
    return "GUEST";
  };
  const navigate = useNavigate();

  const switchRegisterType = (type) => {
    setRegisterType(type);
    setError("");
    setCampingImage([]);
    setImagePreview([]);
    if (type === "partner") {
      setRole("PARTNER");
    } else {
      setRole("USER");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      console.log("Login success:", res);
      const token = localStorage.getItem("token");
      const decoded = decodeToken(token);
      const role = getRoleFromToken(decoded);
      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    const newImagePreviews = [];
    let hasError = false;

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Vui lòng chọn file ảnh hợp lệ (JPG, PNG, GIF, v.v.)!");
        hasError = true;
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(`Kích thước ảnh "${file.name}" không được vượt quá 5MB!`);
        hasError = true;
        return;
      }

      newImages.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        newImagePreviews.push(reader.result);
        if (newImagePreviews.length === newImages.length) {
          setCampingImage((prevImages) => [...prevImages, ...newImages]);
          setImagePreview((prevPreviews) => [
            ...prevPreviews,
            ...newImagePreviews,
          ]);
          setError("");
        }
      };
      reader.readAsDataURL(file);
    });

    if (hasError) {
      setCampingImage([]);
      setImagePreview([]);
    }
  };

  const removeImage = (indexToRemove) => {
    setCampingImage((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
    setImagePreview((prevPreviews) =>
      prevPreviews.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    if (registerType === "partner" && campingImage.length === 0) {
      setError("Vui lòng tải lên ảnh khu camping!");
      return;
    }

    setLoading(true);

    try {
      const res = await register(
        firstName,
        lastName,
        phoneNumber,
        registerType === "partner" ? addressPartner : address,
        department,
        email,
        gender,
        password,
        role
      );

      if (res) {
        console.log("Register success:", res);
        console.log("Camping image:", campingImage);
        localStorage.setItem("registeredEmail", email);
        navigate("/verify-otp");
      } else {
        setError("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPartner = async (e) => {
    e.preventDefault();
    setError("");

    if (campingImage.length === 0) {
      setError("Vui lòng tải lên ít nhất 1 ảnh khu camping!");
      return;
    }

    setLoading(true);

    try {
      const imageUrls = imagePreview.length > 0 ? imagePreview : [];

      const partnerData = {
        firstName,
        lastName,
        phoneNumber,
        address_partner: addressPartner,
        address_camping: addressCamping,
        email,
        name_camping: nameCamping,
        description_camping: descriptionCamping,
        imageUrls,
        role: "PARTNER",
      };

      const res = await registerPartner(partnerData);
      console.log("Register partner success:", res);
      navigate("/login");
    } catch (err) {
      console.error("Register partner failed:", err);
      setError(err.message || "Đăng ký đối tác thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderLogin />
      <div className="auth-page-wrapper">
        <div className="auth-container">
          {/* LOGIN TAB */}
          {activeTab === "login" && (
            <div className="auth-content fade-in">
              <div className="row g-0">
                <div className="col-lg-6 auth-image-section">
                  <div className="image-wrapper">
                    <img
                      src="/assets/images/login/signin-image.jpg"
                      alt="sign in"
                      className="auth-image"
                    />
                  </div>
                </div>

                <div className="col-lg-6 auth-form-section">
                  <div className="form-container">
                    <div className="form-header">
                      <h2>Đăng nhập</h2>
                      <p>Nhập thông tin để tiếp tục</p>
                    </div>

                    <form onSubmit={handleLogin} className="auth-form">
                      <div className="form-group">
                        <label htmlFor="username_login">Email</label>
                        <div className="input-with-icon">
                          <i className="zmdi zmdi-email"></i>
                          <input
                            type="email"
                            id="username_login"
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="password_login">Mật khẩu</label>
                        <div className="input-with-icon">
                          <i className="zmdi zmdi-lock"></i>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password_login"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-control"
                          />
                          <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i
                              className={`zmdi ${
                                showPassword ? "zmdi-eye-off" : "zmdi-eye"
                              }`}
                            ></i>
                          </button>
                        </div>
                      </div>

                      <div className="form-options">
                        <button
                          type="button"
                          className="forgot-password-link"
                          onClick={() => navigate("/forgotPassword")}
                        >
                          Quên mật khẩu?
                        </button>
                      </div>

                      {error && <div className="error-message">{error}</div>}

                      <button
                        type="submit"
                        className="btn-submit btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner"></span>
                            Đang đăng nhập...
                          </>
                        ) : (
                          "Đăng nhập"
                        )}
                      </button>

                      <div className="divider">
                        <span>hoặc đăng ký tài khoản mới</span>
                      </div>

                      <div className="register-shortcuts">
                        <button
                          type="button"
                          className="btn-register-shortcut user"
                          onClick={() => {
                            setActiveTab("register");
                            setRegisterType("user");
                          }}
                        >
                          <i className="zmdi zmdi-account-add"></i>
                          <div className="shortcut-content">
                            <span className="title">Đăng ký thành viên</span>
                            <span className="subtitle">
                              Tài khoản người dùng
                            </span>
                          </div>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REGISTER TAB */}
          {activeTab === "register" && (
            <div className="auth-content fade-in">
              <div className="row g-0">
                <div className="col-lg-6 auth-form-section">
                  <div className="form-container">
                    <div className="form-header">
                      <h2>Đăng ký tài khoản</h2>
                      <p>Tạo tài khoản mới để bắt đầu</p>
                    </div>

                    {/* SUB TAB NAVIGATION FOR REGISTER TYPES */}
                    <div className="register-type-tabs">
                      <button
                        type="button"
                        className={`register-type-btn ${
                          registerType === "user" ? "active" : ""
                        }`}
                        onClick={() => switchRegisterType("user")}
                      >
                        <i className="zmdi zmdi-account"></i>
                        <span>Tài khoản thường</span>
                      </button>
                      <button
                        type="button"
                        className={`register-type-btn ${
                          registerType === "partner" ? "active" : ""
                        }`}
                        onClick={() => switchRegisterType("partner")}
                      >
                        <i className="zmdi zmdi-store"></i>
                        <span>Đối tác</span>
                      </button>
                    </div>

                    <form
                      onSubmit={
                        registerType === "partner"
                          ? handleRegisterPartner
                          : handleRegister
                      }
                    >
                      {/* COMMON FIELDS */}
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="firstName">Họ</label>
                            <div className="input-with-icon">
                              <i className="zmdi zmdi-account"></i>
                              <input
                                type="text"
                                id="firstName"
                                placeholder="Nhập họ"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="form-control"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="lastName">Tên</label>
                            <div className="input-with-icon">
                              <i className="zmdi zmdi-account-circle"></i>
                              <input
                                type="text"
                                id="lastName"
                                placeholder="Nhập tên"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="form-control"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-with-icon">
                          <i className="zmdi zmdi-email"></i>
                          <input
                            type="email"
                            id="email"
                            placeholder="Nhập email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="phoneNumber">Số điện thoại</label>
                        <div className="input-with-icon">
                          <i className="zmdi zmdi-phone"></i>
                          <input
                            type="tel"
                            id="phoneNumber"
                            placeholder="Nhập số điện thoại"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            className="form-control"
                          />
                        </div>
                      </div>

                      {registerType === "user" ? (
                        <>
                          <div className="form-group">
                            <label htmlFor="address">Địa chỉ</label>
                            <div className="input-with-icon">
                              <i className="zmdi zmdi-pin"></i>
                              <input
                                type="text"
                                id="address"
                                placeholder="Nhập địa chỉ"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                className="form-control"
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label htmlFor="department">
                                  Công việc hiện tại
                                </label>
                                <div className="input-with-icon">
                                  <i className="zmdi zmdi-city"></i>
                                  <input
                                    type="text"
                                    id="department"
                                    placeholder="Công việc của bạn"
                                    value={department}
                                    onChange={(e) =>
                                      setDepartment(e.target.value)
                                    }
                                    required
                                    className="form-control"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label htmlFor="gender">Giới tính</label>
                                <div className="input-with-icon">
                                  <i className="zmdi zmdi-male-female"></i>
                                  <select
                                    id="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    required
                                    className="form-control"
                                  >
                                    <option value="">Chọn giới tính</option>
                                    <option value="MALE">Nam</option>
                                    <option value="FEMALE">Nữ</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="password">Mật khẩu</label>
                            <div className="input-with-icon">
                              <i className="zmdi zmdi-lock"></i>
                              <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="form-control"
                              />
                              <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                <i
                                  className={`zmdi ${
                                    showPassword ? "zmdi-eye-off" : "zmdi-eye"
                                  }`}
                                ></i>
                              </button>
                            </div>
                          </div>

                          <div className="form-group">
                            <label htmlFor="confirmPassword">
                              Xác nhận mật khẩu
                            </label>
                            <div className="input-with-icon">
                              <i className="zmdi zmdi-lock-outline"></i>
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                placeholder="Nhập lại mật khẩu"
                                value={confirmPassword}
                                onChange={(e) =>
                                  setConfirmPassword(e.target.value)
                                }
                                required
                                className="form-control"
                              />
                              <button
                                type="button"
                                className="toggle-password"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                <i
                                  className={`zmdi ${
                                    showConfirmPassword
                                      ? "zmdi-eye-off"
                                      : "zmdi-eye"
                                  }`}
                                ></i>
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="form-group">
                            <label htmlFor="address_partner">
                              Địa chỉ đối tác
                            </label>
                            <div className="input-with-icon">
                              <i className="zmdi zmdi-pin"></i>
                              <input
                                type="text"
                                id="address_partner"
                                placeholder="Nhập địa chỉ của bạn"
                                value={addressPartner}
                                onChange={(e) =>
                                  setAddressPartner(e.target.value)
                                }
                                required
                                className="form-control"
                              />
                            </div>
                          </div>

                          <div className="section-title">
                            <i className="zmdi zmdi-nature"></i>
                            Thông tin khu camping
                          </div>

                          <div className="form-group">
                            <label htmlFor="name_camping">
                              Tên khu camping
                            </label>
                            <div className="input-with-icon">
                              <i className="zmdi zmdi-city"></i>
                              <input
                                type="text"
                                id="name_camping"
                                placeholder="Nhập tên khu camping"
                                value={nameCamping}
                                onChange={(e) => setNameCamping(e.target.value)}
                                required
                                className="form-control"
                              />
                            </div>
                          </div>

                          <div className="form-group">
                            <label htmlFor="address_camping">
                              Địa chỉ khu camping
                            </label>
                            <div className="input-with-icon">
                              <i className="zmdi zmdi-pin"></i>
                              <input
                                type="text"
                                id="address_camping"
                                placeholder="Nhập địa chỉ khu camping"
                                value={addressCamping}
                                onChange={(e) =>
                                  setAddressCamping(e.target.value)
                                }
                                required
                                className="form-control"
                              />
                            </div>
                          </div>

                          <div className="form-group">
                            <label htmlFor="description_camping">
                              Mô tả khu camping
                            </label>
                            <div className="input-with-icon">
                              <i className="zmdi zmdi-comment-text"></i>
                              <textarea
                                id="description_camping"
                                placeholder="Mô tả chi tiết về khu camping của bạn"
                                value={descriptionCamping}
                                onChange={(e) =>
                                  setDescriptionCamping(e.target.value)
                                }
                                required
                                className="form-control"
                                rows="4"
                              />
                            </div>
                          </div>

                          <div className="form-group">
                            <label htmlFor="campingImages" className="d-block">
                              Hình ảnh khu camping
                              {campingImage.length === 0 && (
                                <span className="required-badge">Bắt buộc</span>
                              )}
                            </label>
                            <div className="upload-area">
                              <input
                                type="file"
                                id="campingImages"
                                accept="image/*"
                                multiple
                                className="d-none"
                                onChange={handleImageChange}
                              />
                              <label
                                htmlFor="campingImages"
                                className="upload-label"
                              >
                                <div className="upload-content">
                                  <i className="zmdi zmdi-cloud-upload"></i>
                                  <p>
                                    {campingImage.length > 0
                                      ? `${campingImage.length} ảnh đã chọn`
                                      : "Nhấn để chọn ảnh hoặc kéo thả vào đây"}
                                  </p>
                                  <span>
                                    Định dạng: JPG, PNG, GIF (tối đa 5MB/ảnh)
                                  </span>
                                </div>
                              </label>
                            </div>

                            {imagePreview.length > 0 && (
                              <div className="image-preview-grid">
                                {imagePreview.map((preview, index) => (
                                  <div key={index} className="preview-item">
                                    <img
                                      src={preview}
                                      alt={`Preview ${index + 1}`}
                                    />
                                    <button
                                      type="button"
                                      className="remove-image"
                                      onClick={() => removeImage(index)}
                                    >
                                      <i className="zmdi zmdi-close"></i>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {error && <div className="error-message">{error}</div>}

                      <button
                        type="submit"
                        className={`btn-submit ${
                          registerType === "partner"
                            ? "btn-warning"
                            : "btn-success"
                        }`}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner"></span>
                            Đang đăng ký...
                          </>
                        ) : (
                          <>
                            <i className="zmdi zmdi-check"></i>
                            {registerType === "partner"
                              ? "Đăng ký làm đối tác"
                              : "Đăng ký ngay"}
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                <div className="col-lg-6 auth-image-section">
                  <div className="image-wrapper">
                    <img
                      src="/assets/images/login/signup-image.jpg"
                      alt="sign up"
                      className="auth-image"
                    />
                    <div className="image-overlay">
                      <h3>Tham gia cùng chúng tôi!</h3>
                      <p>Bắt đầu hành trình khám phá</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <FooterLogin />
    </>
  );
};

export default AuthPage;
