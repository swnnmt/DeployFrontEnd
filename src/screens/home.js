import React, { useEffect, useState } from "react";
import BannerHome from "../components/BannerHome";
import { Link, useNavigate } from "react-router-dom";
import ChatPopup from "../components/ChatPopup";
import axios from "axios";

export default function HomePage() {
  const [tours, setTours] = useState([]);
  const [toursPopular, setToursPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.AOS?.init();

    const fetchTours = async () => {
      try {
        const response = await axios.get("http://103.200.22.89:8080/api/v1/camping");
        const jsonData = response.data;

        // chỉ lấy tour đang active
        const activeTours = jsonData.filter((tour) => tour.active);

        // sắp xếp giảm dần theo bookedCount
        const sortedByBook = [...activeTours].sort(
          (a, b) => (b.bookedCount || 0) - (a.bookedCount || 0)
        );

        // lưu danh sách đầy đủ & top 4 tour có lượt book cao nhất
        setTours(activeTours);
        setToursPopular(sortedByBook.slice(0, 4));
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu camping:", error);
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) return <p className="text-center py-5">Đang tải dữ liệu...</p>;

  return (
    <>
      <BannerHome />

      <div className="form-back-drop"></div>

      {/* Destinations Area */}
      <section className="destinations-area bgc-black pt-100 pb-70 rel z-1">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div
                className="section-title text-white text-center counter-text-wrap mb-70"
                data-aos="fade-up"
                data-aos-duration="1500"
                data-aos-offset="50"
              >
                <h2>Khám phá kho báu việt nam cùng Campverse</h2>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            {tours.slice(0, 4).map((tour, index) => (
              <div className="col-xxl-3 col-xl-4 col-md-6 mb-4" key={index}>
                <div
                  className="destination-item block_tours"
                  data-aos="fade-up"
                  data-aos-duration="1500"
                  data-aos-offset="50"
                >
                  <div className="image">
                   <div className="ratting">
                      <i className="fas fa-star"></i>{" "}
                      {typeof tour.rating === "number" ? tour.rating.toFixed(1) : "Chưa có"}
                    </div>

                    <a href="#" className="heart">
                      <i className="fas fa-heart"></i>
                    </a>
                    <img
                      src={tour.thumbnail}
                      alt="Destination"
                    />
                  </div>
                  <div className="content">
                    <span className="location">
                      <i className="fal fa-map-marker-alt"></i>
                      {tour.destination}
                    </span>
                    <h5>
                      <Link to={`/camping-detail/${tour.id}`}>{tour.name}</Link>
                    </h5>
                    
                  </div>
                  <div className="destination-footer">
                    <span className="price">
                      <span>{tour.basePrice.toLocaleString() ?? 0}</span> VND /
                      người
                    </span>
                    <Link to={`/camping-detail/${tour.id}`} className="read-more">
                      Đặt ngay <i className="fal fa-angle-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Area */}
      <section className="about-us-area py-100 rpb-90 rel z-1">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-5 col-lg-6">
              <div
                className="about-us-content rmb-55"
                data-aos="fade-left"
                data-aos-duration="1500"
                data-aos-offset="50"
              >
                <div className="section-title mb-25">
                  <h2>
                    Du lịch với sự tự tin Lý do hàng đầu để chọn công ty chúng
                    tôi
                  </h2>
                </div>
                <p>
                  Chúng tôi sẽ nỗ lực hết mình để biến giấc mơ du lịch của bạn
                  thành hiện thực những viên ngọc ẩn và những điểm tham quan
                  không thể bỏ qua
                </p>
                <div className="divider counter-text-wrap mt-45 mb-55">
                  <span>
                    Chúng tôi có{" "}
                    <span>
                      <span
                        className="count-text plus"
                        data-speed="3000"
                        data-stop="5"
                      >
                        1
                      </span>{" "}
                      Năm
                    </span>{" "}
                    kinh nghiệm
                  </span>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="counter-item counter-text-wrap">
                      <span
                        className="count-text k-plus"
                        data-speed="2000"
                        data-stop="1"
                      >
                        3
                      </span>
                      <span className="counter-title">Điểm đến phổ biến</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="counter-item counter-text-wrap">
                      <span
                        className="count-text m-plus"
                        data-speed="3000"
                        data-stop="8"
                      >
                        1
                      </span>
                      <span className="counter-title">Khách hàng hài lòng</span>
                    </div>
                  </div>
                </div>
                <Link to="/destination" className="theme-btn mt-10 style-two">
                  <span data-hover="Khám phá Điểm đến">Khám phá Điểm đến</span>
                  <i className="fal fa-arrow-right"></i>
                </Link>
              </div>
            </div>
            <div
              className="col-xl-7 col-lg-6"
              data-aos="fade-right"
              data-aos-duration="1500"
              data-aos-offset="50"
            >
              <div className="about-us-image">
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <div className="shape" key={n}>
                    <img
                      src={`/assets/images/about/shape${n}.png`}
                      alt={`Shape ${n}`}
                    />
                  </div>
                ))}
                <img src="/assets/images/about/about.png" alt="About" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="popular-destinations-area rel z-1">
        <div className="container-fluid">
          <div className="popular-destinations-wrap br-20 bgc-lighter pt-100 pb-70">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div
                  className="section-title text-center counter-text-wrap mb-70"
                  data-aos="fade-up"
                  data-aos-duration="1500"
                  data-aos-offset="50"
                >
                  <h2>Khám phá các điểm đến phổ biến</h2>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Features Area */}

      {/* CTA Area */}
      <section className="cta-area pt-100 rel z-1">
  <div className="container-fluid">
    <div className="row">
      {tours.slice(0, 3).map((tour, index) => (
        <div
          className="col-xl-4 col-md-6"
          data-aos="zoom-in-down"
          data-aos-delay={index * 100}
          data-aos-duration="1500"
          data-aos-offset="50"
          key={index}
        >
          <div
  className="cta-item"
  style={{
    backgroundImage: `url(${tour.thumbnail || "/assets/images/cta/default.jpg"})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "10px",
    position: "relative",
    height: "300px", // có thể tùy chỉnh chiều cao
    overflow: "hidden",
  }}
>
  <div className="cta-title">
    <span className="theme-btn tour-name">{tour.name}</span>
  </div>

  <Link
    to={`/camping-detail/${tour.id}`}
    className="theme-btn style-two bgc-secondary explore-btn"
  >
    <span data-hover="Khám phá">Khám phá</span>
    <i className="fal fa-arrow-right"></i>
  </Link>
</div>

        </div>
      ))}
    </div>
  </div>
</section>


      <button
        onClick={() => setShowChat(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          zIndex: 9998,
          cursor: "pointer",
        }}
        title="Chat AI"
      >
        💬
      </button>
       <button
        onClick={() => navigate("/admin")}
        style={{
          position: "fixed",
          bottom: "100px",   // đặt cao hơn nút chat
          right: "20px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          zIndex: 9998,
          cursor: "pointer",
        }}
        title="Admin Dashboard"
      >
        📊
      </button>

      {showChat && <ChatPopup onClose={() => setShowChat(false)} />}
    </>
  );
}
