import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const currentPath = location.pathname;
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  const isActive = (path) => (currentPath === path ? "active" : "");
  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  return (
    <header className="main-header header-one">
      <div className="header-upper bg-white py-30 rpy-0">
        <div className="container-fluid clearfix">
          <div className="header-inner rel d-flex align-items-center">
            {/* Logo */}
            <div className="logo-outer">
              <div className="logo">
                <Link to="/">
                  <img src="/assets/images/logos/logo3.png" alt="Logo" />
                </Link>
              </div>
            </div>

            {/* Navigation */}
            <div className="nav-outer mx-lg-auto ps-xxl-5 clearfix">
              <nav className="main-menu navbar-expand-lg">
                <div className="navbar-header">
                  <div className="mobile-logo">
                    <Link to="/">
                      <img
                        src="/clients/assets/images/logos/logo-two.png"
                        alt="Logo"
                      />
                    </Link>
                  </div>
                  <button
                    type="button"
                    className="navbar-toggle"
                    data-bs-toggle="collapse"
                    data-bs-target=".navbar-collapse"
                  >
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                </div>

                <div className="navbar-collapse collapse clearfix">
                  <ul className="navigation clearfix">
                    <li className={isActive("/")}>
                      {" "}
                      <Link to="/">Trang chủ</Link>
                    </li>
                    <li className={isActive("/about")}>
                      {" "}
                      <Link to="/about">Giới thiệu</Link>
                    </li>
                    <li className={isActive("/tours")}>
                      {" "}
                      <Link to="/tours">Điểm đến</Link>
                    </li>
                    <li className={isActive("/contact")}>
                      {" "}
                      <Link to="/contact">Liên hệ</Link>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>

            {/* Book now + User menu */}
            <div
              className="menu-btns py-10 d-flex align-items-center gap-3"
              style={{ position: "relative" }}
              ref={dropdownRef}
            >
              <Link to="/tours" className="theme-btn style-two bgc-secondary">
                <span data-hover="Đặt Ngay">Book Now</span>
                <i className="fal fa-arrow-right"></i>
              </Link>

              <div className="menu-sidebar drop-down">
                <button
                  className="dropdown-toggle bg-transparent border-0"
                  onClick={toggleDropdown}
                >
                  {user?.avatar ? (
                    <img
                      className="img-account-profile rounded-circle"
                      src={user.avatar}
                      style={{ width: 36, height: 36 }}
                      alt="avatar"
                    />
                  ) : (
                    <i
                      className="bx bxs-user bx-tada"
                      style={{ fontSize: 36, color: "black" }}
                    ></i>
                  )}
                </button>

                {showDropdown && (
                  <ul
                    className="dropdown-menu show"
                    style={{
                      position: "absolute",
                      top: "48px",
                      right: 0,
                      zIndex: 9999,
                      backgroundColor: "#fff",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      borderRadius: "6px",
                      minWidth: "200px",
                      padding: "0.5rem 0",
                    }}
                  >
                    {user?.username ? (
                      <>
                        <li>
                          <Link
                            to="/profile"
                            className="dropdown-item"
                            onClick={() => setShowDropdown(false)}
                          >
                            Thông tin cá nhân
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/my-tours"
                            className="dropdown-item"
                            onClick={() => setShowDropdown(false)}
                          >
                            Tour đã đặt
                          </Link>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={handleLogout}
                          >
                            Đăng xuất
                          </button>
                        </li>
                      </>
                    ) : (
                      <li>
                        <Link
                          to="/login"
                          className="dropdown-item"
                          onClick={() => setShowDropdown(false)}
                        >
                          Đăng nhập
                        </Link>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
