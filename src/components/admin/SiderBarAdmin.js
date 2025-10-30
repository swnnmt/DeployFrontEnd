"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
const Sidebar = ({ activeSection, setActiveSection }) => {
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [profile, setProfile] = useState(null);
  const { logout } = useAuth();
  useEffect(() => {
    fetchPendingRequestsCount();
  }, []);

  const fetchPendingRequestsCount = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/partner-requests/count`
      );

      if (!response.ok) {
        throw new Error("API không khả dụng");
      }

      const data = await response.json();
      setPendingRequestsCount(data.count || 0);
    } catch (error) {
      console.error("Lỗi khi tải số lượng yêu cầu:", error);
      // Mock data for camping website
      setPendingRequestsCount(5);
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Tổng Quan",
      icon: "📊",
    },
    {
      id: "users",
      label: "Khách Hàng Camping",
      icon: "🏕️",
    },
    {
      id: "partners",
      label: "Đối Tác Camping",
      icon: "🤝",
    },
    {
      id: "partner-requests",
      label: "Yêu Cầu Đối Tác",
      icon: "📋",
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : null,
      isLoading: isLoading,
    },
    {
      id: "invoices",
      label: "Quản Lý Hóa Đơn",
      icon: "🧾",
    },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <span className="logo-icon">🏕️</span>
          <h2>Camping Admin</h2>
        </div>
        <p className="admin-subtitle">Hệ thống quản lý</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? "active" : ""}`}
            onClick={() => setActiveSection(item.id)}
            title={item.description}
          >
            <div className="nav-content">
              <div className="nav-main">
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`nav-badge ${item.isLoading ? "loading" : ""}`}
                >
                  {item.isLoading ? "..." : item.badge}
                </span>
              )}
            </div>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="home-btn"
          title="Về trang chủ"
          onClick={() => (window.location.href = "/")}
        >
          <span>🏠</span>
          <span>Trang chủ</span>
        </button>

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
          <span>🚪</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
