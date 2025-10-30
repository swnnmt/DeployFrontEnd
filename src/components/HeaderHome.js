import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../api/authService";
import UserProfileModal from "./UserProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";

// ✅ Giải mã JWT không cần backend
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

  // ✅ ADMIN có toàn bộ quyền (ADMIN, MAKE, CHECK, READ, DELETE)
  const isAdmin = [
    "ROLE_ADMIN",
    "ROLE_MAKE",
    "ROLE_CHECK",
    "ROLE_READ",
    "ROLE_DELETE",
  ].every((perm) => authorities.includes(perm));
  if (isAdmin) return "ADMIN";

  // ✅ PARTNER có 3 quyền: MAKE, CHECK, READ
  const isPartner = ["ROLE_MAKE", "ROLE_CHECK", "ROLE_READ"].every((perm) =>
    authorities.includes(perm)
  );
  if (isPartner) return "PARTNER";

  // ✅ USER có 2 quyền: MAKE, READ
  const isUser = ["ROLE_MAKE", "ROLE_READ"].every((perm) =>
    authorities.includes(perm)
  );
  if (isUser) return "USER";

  return "GUEST";
};

const HeaderHome = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const [showDropdown, setShowDropdown] = useState(false);
  const [profile, setProfile] = useState(null);
  const [userRole, setUserRole] = useState("GUEST"); // USER | PARTNER | GUEST
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const currentPath = location.pathname;
  const isActive = (path) => (currentPath === path ? "active" : "");
  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Nếu có dropdown mở và click không nằm trong menu
      if (
        showDropdown &&
        !event.target.closest(".menu-sidebar") &&
        !event.target.closest("#dropdownMenu")
      ) {
        setShowDropdown(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [showDropdown]);

  // ✅ Gọi API lấy profile & decode token
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = decodeToken(token);
        const role = getRoleFromToken(decoded);

        setUserRole(role); // 👉 Lưu lại role để hiển thị menu khác nhau

        const data = await getProfile(token);
        setProfile(data.data);
        localStorage.setItem("user", JSON.stringify(data.data));

        if (data.data?.reset === true) {
          setShowChangePasswordModal(true);
        }
      } catch (err) {
        console.error("Lỗi khi lấy profile:", err);
        setProfile(null);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Menu riêng cho từng role
  const renderMenu = () => {
    if (userRole === "PARTNER") {
      return (
        <div className="nav-outer mx-lg-auto ps-xxl-5 clearfix">
          <nav className="main-menu navbar-expand-lg">
            <div className="navbar-header">
              <div className="mobile-logo">
                <Link to="/">
                  <img
                    src="/clients/assets/images/logos/logo3 copy 2.png"
                    alt="Logo"
                    title="Logo"
                  />
                </Link>
              </div>
            </div>
            <div className="navbar-collapse collapse clearfix">
              <ul className="navigation clearfix">
                <li className={isActive("/")}>
                  <Link to="/">Trang chủ</Link>
                </li>
                <li className={isActive("/about")}>
                  <Link to="/about">Giới thiệu</Link>
                </li>
                <li className={isActive("/seller/managercamping")}>
                  <Link to="/seller/managercamping">Camping của tôi</Link>
                </li>
                <li className={isActive("/seller/createCamp")}>
                  <Link to="/seller/createCamp">Thêm Camping</Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      );
    }

    // USER hoặc khách
    return (
      <div className="nav-outer mx-lg-auto ps-xxl-5 clearfix">
        <nav className="main-menu navbar-expand-lg">
          <div className="navbar-header">
            <div className="mobile-logo">
              <Link to="/">
                <img
                  src="/assets/images/logos/logo3 copy 2.png"
                  alt="Logo"
                  style={{ width: "150px", height: "70px" }}
                />
              </Link>
            </div>
          </div>
          <div className="navbar-collapse collapse clearfix">
            <ul className="navigation clearfix">
              <li className={isActive("/")}>
                <Link to="/">Trang chủ</Link>
              </li>
              <li className={isActive("/about")}>
                <Link to="/about">Giới thiệu</Link>
              </li>
              <li className={isActive("/marketplace")}>
                <Link to="/marketplace">Marketplace</Link>
              </li>
              <li className={isActive("/community")}>
                <Link to="/community">Cộng đồng</Link>
              </li>
              <li className={isActive("/tours")}>
                <Link to="/tours">Điểm đến</Link>
              </li>
              <li className={isActive("/contact")}>
                <Link to="/contact">Liên hệ</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  };

  return (
    <>
      <header className="main-header header-one white-menu menu-absolute">
        <div className="header-upper py-30 rpy-0">
          <div className="container-fluid clearfix">
            <div className="header-inner rel d-flex align-items-center">
              {/* logo */}
              <div className="logo-outer">
                <div className="logo">
                  <Link to="/">
                    <img src="/assets/images/logos/logo3.png" alt="Logo" />
                  </Link>
                </div>
              </div>

              {/* menu */}
              {renderMenu()}

              {/* search + dropdown */}
              <div className="menu-btns py-10">
                {userRole !== "PARTNER" && (
                  <Link
                    to="/tours"
                    className="theme-btn style-two bgc-secondary"
                  >
                    <span data-hover="Đặt Ngay">Book Now</span>
                    <i className="fal fa-arrow-right"></i>
                  </Link>
                )}

                <div className="menu-sidebar">
                  <li className="drop-down">
                    <button
                      className="dropdown-toggle bg-transparent"
                      onClick={toggleDropdown}
                      style={{ color: "white" }}
                    >
                      {profile?.avatarUrl ? (
                        <img
                          className="img-account-profile rounded-circle"
                          src={profile.avatarUrl}
                          style={{ width: 36, height: 36 }}
                          alt="avatar"
                        />
                      ) : (
                        <i
                          className="bx bxs-user bx-tada"
                          style={{ fontSize: 36, color: "white" }}
                        ></i>
                      )}
                    </button>

                    {showDropdown && (
                      <ul
                        className="dropdown-menu show"
                        id="dropdownMenu"
                        style={{ position: "absolute", top: "50px", right: 0 }}
                      >
                        {profile ? (
                          <>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  setShowProfileModal(true);
                                  setShowDropdown(false);
                                }}
                              >
                                Thông tin cá nhân
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  setShowChangePasswordModal(true);
                                  setShowDropdown(false);
                                }}
                              >
                                Đổi mật khẩu
                              </button>
                            </li>
                            {userRole === "USER" && (
                              <li>
                                <Link
                                  to="/my-bookings"
                                  className="dropdown-item"
                                  onClick={() => setShowDropdown(false)}
                                >
                                  Camping đã đặt
                                </Link>
                              </li>
                            )}
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  logout();
                                  localStorage.removeItem("token");
                                  localStorage.removeItem("user");
                                  setProfile(null);
                                  setShowDropdown(false);
                                }}
                              >
                                Đăng xuất
                              </button>
                            </li>
                          </>
                        ) : (
                          <li>
                            <Link
                              to="/login"
                              onClick={() => setShowDropdown(false)}
                            >
                              Đăng nhập
                            </Link>
                          </li>
                        )}
                      </ul>
                    )}
                  </li>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      {showProfileModal && (
        <UserProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          userProfile={profile}
        />
      )}
      {showChangePasswordModal && (
        <ChangePasswordModal
          isOpen={showChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}
    </>
  );
};

export default HeaderHome;
