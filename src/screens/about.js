import React from "react";
import { Link } from "react-router-dom";
import BannerHome from "../components/BannerHome";

const AboutPage = () => {
  return (
    <>
      <Link to="/#" className="chatbot-fixed" title="Trợ lý ảo Campverse">
        <img src={`/assets/images/login/chatbot.png`} alt="Chatbot" />
      </Link>
      <BannerHome />
      <style>{`
  @keyframes fall1 {
    0% { transform: translateY(0px) rotate(0deg); opacity: 0.9; }
    100% { transform: translateY(120px) rotate(360deg); opacity: 0; }
  }
  .leaf {
    position: absolute;
    color: #2e8b57; /* Màu xanh lá cây đậm */
    font-size: 18px;
    animation: fall1 4s linear infinite;
    pointer-events: none;
  }
  .leaf2 {
    left: 30px;
    font-size: 22px;
    animation-delay: 1s;
    color: #3cb371; /* Màu xanh lá tươi hơn */
  }
  .leaf3 {
    left: 60px;
    font-size: 20px;
    animation-delay: 2s;
    color: #228b22; /* ForestGreen */
  }
`}</style>

      {/* About Area */}
      <section className="about-area-two py-100 rel z-1">
        <div className="container">
          <div className="row justify-content-between">
            <div
              className="col-xl-3"
              data-aos="fade-right"
              data-aos-duration="1500"
              data-aos-offset="50"
            >
              <span className="subtitle mb-35">Về Campverse</span>
            </div>
            <div className="col-xl-9">
              <div
                className="about-page-content"
                data-aos="fade-left"
                data-aos-duration="1500"
                data-aos-offset="50"
              >
                <div className="row">
                  <div className="col-lg-8 pe-lg-5 me-lg-5">
                    <div className="section-title mb-25">
                      <h2>Hành trình của Campverse</h2>
                    </div>
                  </div>

                  <div className="col-md-4 d-flex justify-content-center">
                    <div
                      className="experience-years rmb-20 text-center"
                      style={{ position: "relative", padding: "10px" }}
                    >
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 500,
                          fontStyle: "italic",
                          color: "#444",
                          lineHeight: "1.6",
                          zIndex: 2,
                          position: "relative",
                        }}
                      >
                        "Khởi nguồn từ một nơi bình dị –
                        <br />
                        nơi gọi là{" "}
                        <span style={{ fontWeight: 700 }}>giảng đường</span>"
                      </div>
                      {/* Lá rơi hiệu ứng xanh lá */}
                      <div
                        className="leaf"
                        style={{ left: "10px", top: "0px" }}
                      >
                        🍃
                      </div>
                      <div className="leaf leaf2" style={{ top: "0px" }}>
                        🍃
                      </div>
                      <div className="leaf leaf3" style={{ top: "0px" }}>
                        🍃
                      </div>
                    </div>
                  </div>

                  <div
                    className="col-md-8"
                    style={{
                      marginLeft: "-10px", // dịch nhẹ vào để cân với bên trái
                      paddingRight: "10px",
                      textAlign: "justify",
                    }}
                  >
                    <p>
                      Campverse được bắt đầu từ những chiều hoàng hôn lặng lẽ
                      sau giảng đường. Sáu tâm hồn trẻ, mỗi người một ngả, gặp
                      nhau ở giao lộ của những khao khát được sống chậm, được
                      chạm vào thiên nhiên và lắng nghe chính mình.
                    </p>
                    <p>
                      Từ những chuyến đi đầy gió và bụi, từ những buổi chuyện
                      trò với người giữ rừng, giữ suối, chúng mình đã gom nhặt
                      từng niềm tin nhỏ để thắp lên một ngọn lửa cho một nền
                      tảng giúp kết nối con người với nhau qua những đêm cắm
                      trại, qua tiếng suối, qua ánh lửa bập bùng.
                    </p>
                    <p>
                      Campverse không phải là một dự án, mà là một lời mời – mời
                      bạn cùng đi, cùng chạm vào thiên nhiên, và chạm lại vào
                      chính tâm hồn mình.
                    </p>
                    <Link to="/tours" className="theme-btn style-three mt-30">
                      <span data-hover="Khám phá hành trình">
                        Khám phá hành trình
                      </span>
                      <i className="fal fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Vision & Mission */}
      <section className="about-features-area">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-4 col-md-6">
              <div className="about-feature-image" data-aos="fade-up">
                <img
                  src="/assets/images/about/about-feature1.jpg"
                  alt="About"
                />
              </div>
            </div>
            <div className="col-xl-4 col-md-6">
              <div
                className="about-feature-image"
                data-aos="fade-up"
                data-aos-delay="50"
              >
                <img
                  src="/assets/images/about/about-feature2.jpg"
                  alt="About"
                />
              </div>
            </div>
            <div className="col-xl-4 col-md-8">
              <div
                className="about-feature-boxes"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="feature-item style-three bgc-secondary">
                  <div className="icon-title">
                    <div className="icon">
                      <i className="flaticon-award-symbol"></i>
                    </div>
                    <h5>Tầm nhìn</h5>
                  </div>
                  <div className="content">
                    <p>
                      Trở thành nền tảng dẫn đầu về trải nghiệm cắm trại số hóa
                      và bền vững tại Việt Nam, nơi mỗi chuyến đi là hành trình
                      kết nối con người với thiên nhiên và chính mình.
                    </p>
                  </div>
                </div>
                <div className="feature-item style-three bgc-primary">
                  <div className="icon-title">
                    <div className="icon">
                      <i className="flaticon-tourism"></i>
                    </div>
                    <h5>Sứ mệnh</h5>
                  </div>
                  <div className="content">
                    <p>
                      Đơn giản hóa và cá nhân hóa hành trình cắm trại cho người
                      Việt, thông qua công nghệ thân thiện và dịch vụ minh bạch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us - Core Values */}
      <section className="about-us-area pt-70 pb-100 rel z-1">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-5 col-lg-6">
              <div className="about-us-content rmb-55" data-aos="fade-left">
                <div className="section-title mb-25">
                  <h2>Giá trị cốt lõi</h2>
                </div>
                <ul className="list-style-two mt-20">
                  <li>
                    <p>
                      <strong style={{ display: "block", marginBottom: "5px" }}>
                        Chạm thật – sống thật
                      </strong>
                      Chúng tôi lựa chọn sự chân thật trong mọi hành trình – ảnh
                      thật, cảm xúc thật, phản hồi thật.
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong style={{ display: "block", marginBottom: "5px" }}>
                        Công nghệ phục vụ cảm xúc
                      </strong>
                      Dữ liệu là công cụ, nhưng cảm xúc mới là kim chỉ nam –
                      Campverse thiết kế trải nghiệm bằng trái tim.
                    </p>
                  </li>
                  <li>
                    <p>
                      <strong style={{ display: "block", marginBottom: "5px" }}>
                        Cá nhân hóa từng trải nghiệm
                      </strong>
                      Mỗi người là một câu chuyện, và Campverse tôn trọng hành
                      trình riêng biệt đó trong thiên nhiên.
                    </p>
                  </li>
                </ul>

                <Link
                  to="/destination-details"
                  className="theme-btn mt-10 style-two"
                >
                  <span data-hover="Hành trình của bạn">
                    Hành trình của bạn
                  </span>
                  <i className="fal fa-arrow-right"></i>
                </Link>
              </div>
            </div>
            <div className="col-xl-7 col-lg-6" data-aos="fade-right">
              <div className="about-us-page">
                <img src="/assets/images/about/about-page.jpg" alt="About" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Các phần khác giữ nguyên hoặc ẩn nếu không phù hợp */}
      {/* Nếu không cần phần 'Team' hoặc 'Feature Two' thì có thể xóa hoặc comment lại tùy bạn */}
    </>
  );
};

export default AboutPage;