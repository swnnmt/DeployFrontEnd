import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function BannerHome({ onSearch }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const location = useLocation();

  useEffect(() => {
    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = false;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });

    const loadScripts = async () => {
      try {
        await loadScript("/assets/js/aos.js");
        if (window.AOS) {
          window.AOS.init();
        }
      } catch (error) {
        console.error("Failed to load script:", error);
      }
    };

    loadScripts();
  }, []);

  const handleFilter = (filterType) => {
    setActiveFilter(filterType);
    onSearch({ filter: filterType });
  };

  const getButtonClass = (filterType) =>
    `theme-btn px-6 py-2 ${activeFilter === filterType ? "active-btn" : ""}`;

  return (
    <section className="hero-area bgc-black pt-200 rpt-120 rel z-2">
      <div className="container-fluid">
        <h1
          className="hero-title"
          data-aos="flip-up"
          data-aos-delay="50"
          data-aos-duration="1500"
          data-aos-offset="50"
        >
          CAMPVERSE
        </h1>
        <div
          className="main-hero-image bgs-cover"
          style={{ backgroundImage: `url(/assets/images/hero/hero.jpg)` }}
        ></div>
      </div>

      {/* Chỉ hiển thị filter khi ở trang /managercamping */}
      {location.pathname === "/managercamping" && (
        <div className="container container-1400">
          <div
            className="search-filter-inner flex justify-center gap-4 mt-6"
            data-aos="zoom-out-down"
            data-aos-duration="1500"
            data-aos-offset="50"
          >
            <button
              type="button"
              className={getButtonClass("all")}
              onClick={() => handleFilter("all")}
            >
              <span>Tất cả Camping</span>
            </button>

            <button
              type="button"
              className={getButtonClass("active")}
              onClick={() => handleFilter("active")}
            >
              <span>Camping đã Active</span>
            </button>

            <button
              type="button"
              className={getButtonClass("in-progress")}
              onClick={() => handleFilter("in-progress")}
            >
              <span>Camping đang xem xét</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
