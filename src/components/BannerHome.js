import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCampingSites } from "../api/campingSiteService";
import axios from "axios";


export default function BannerHome() {
  const formRef = useRef();
  const navigate = useNavigate();
  const [campingSites, setCampingSites] = useState([]);
  const fetched = useRef(false); // ✅ kiểm soát chỉ fetch 1 lần

useEffect(() => {
  const fetchCampingSites = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/camping-sites");
      console.log("Camping sites:", res.data);
      setCampingSites(res.data || []);
    } catch (err) {
      console.error("Error fetching camping sites:", err);
      setCampingSites([]); // đảm bảo không bị undefined
    }
  };
  fetchCampingSites();
}, []);
  
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
        await loadScript("/assets/js/jquery.datetimepicker.full.min.js");
        await loadScript("/assets/js/aos.js");

        if (window.$) {
          window.$(".datetimepicker").datetimepicker({
            format: "d/m/Y",
            timepicker: false,
          });
        }
        if (window.AOS) window.AOS.init();
      } catch (error) {
        console.error("❌ Failed to load script:", error);
      }
    };

    loadScripts();
  }, []);

  useEffect(() => {
    if (fetched.current) return; // ✅ bỏ qua lần thứ 2
    fetched.current = true;

    const fetchCampingSites = async () => {
      try {
        const data = await getAllCampingSites();
        setCampingSites(data || []);
      } catch (error) {
        console.error("❌ Lỗi khi gọi API:", error);
      }
    };
    fetchCampingSites();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    console.log("Form submitted:", {
      destination: formData.get("destination"),
      startDate: formData.get("start_date"),
      endDate: formData.get("end_date"),
    });
    navigate(`/tours?siteId=${formData.get("destination")}`);
  };

  return (
    <section className="hero-area bgc-black pt-200 rpt-120 rel z-2">
      <div className="container-fluid" style={{ marginBottom: "40px" }}>
        <h1
          className="hero-title"
          style={{ marginTop: "100px" }}
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

      <form ref={formRef} onSubmit={handleSubmit} id="search_form">
        <div className="container container-1400">
          <div
            className="search-filter-inner"
            data-aos="zoom-out-down"
            data-aos-duration="1500"
            data-aos-offset="50"
          >
            {/* Điểm đến */}
            <div className="filter-item clearfix">
              <div className="icon">
                <i className="fal fa-map-marker-alt"></i>
              </div>
              <span className="title">Điểm đến</span>
              <select
                key={campingSites.length} // 👈 thêm dòng này
                name="destination"
                id="destination"
                required
              >
                <option value="">Chọn điểm đến</option>
                {campingSites.length > 0 ? (
                  campingSites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.location}
                    </option>
                  ))
                ) : (
                  <option disabled>Đang tải...</option>
                )}
              </select>
            </div>

            {/* Ngày đi */}
            <div className="filter-item clearfix">
              <div className="icon">
                <i className="fal fa-calendar-alt"></i>
              </div>
              <span className="title">Ngày khởi hành</span>
              <input
                type="text"
                name="start_date"
                className="datetimepicker datetimepicker-custom"
                placeholder="Chọn ngày đi"
                readOnly
              />
            </div>

            {/* Ngày về */}
            <div className="filter-item clearfix">
              <div className="icon">
                <i className="fal fa-calendar-alt"></i>
              </div>
              <span className="title">Ngày kết thúc</span>
              <input
                type="text"
                name="end_date"
                className="datetimepicker datetimepicker-custom"
                placeholder="Chọn ngày về"
                readOnly
              />
            </div>

            {/* Nút tìm kiếm */}
            <div className="search-button">
              <button className="theme-btn" type="submit">
                <span data-hover="Tìm kiếm">Tìm kiếm</span>
                <i className="far fa-search"></i>
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
