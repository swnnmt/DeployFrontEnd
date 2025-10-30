import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function FooterHome() {
  useEffect(() => {
    // Tránh load script nhiều lần
    const loadScript = (src, isExternal = false) =>
      new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve(); // Skip if already loaded

        const script = document.createElement("script");
        script.src = src;
        script.async = false;
        if (isExternal) script.crossOrigin = "anonymous";
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });

    const loadScriptsSequentially = async () => {
      const scriptSources = [
        "/assets/js/jquery-3.6.0.min.js",
        "/assets/js/bootstrap.min.js",
        "/assets/js/appear.min.js",
        "/assets/js/slick.min.js",
        "/assets/js/jquery.magnific-popup.min.js",
        "/assets/js/jquery.nice-select.min.js",
        "/assets/js/imagesloaded.pkgd.min.js",
        "/assets/js/skill.bars.jquery.min.js",
        "/assets/js/jquery-ui.min.js",
        "/assets/js/isotope.pkgd.min.js",
        "/assets/js/aos.js",
        "/assets/js/script.js",
        "/assets/js/custom-js.js",
        "/assets/js/jquery.datetimepicker.full.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js",
        `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}`,
      ];

      try {
        for (const src of scriptSources) {
          await loadScript(src, src.startsWith("http"));
        }

        // Initialize AOS & datetime picker after load
        if (window.AOS) window.AOS.init();
        if (window.$) {
          window.$(".datetimepicker").datetimepicker({
            format: "Y-m-d",
            timepicker: false,
          });
        }
      } catch (err) {
        console.error("Failed to load footer scripts:", err);
      }
    };

    loadScriptsSequentially();
  }, []);

  return (
    <footer
      className="main-footer bgs-cover overlay rel z-1 pb-25"
      style={{
        backgroundImage: `url("/assets/images/backgrounds/footer.jpg")`,
      }}
    >
      <div className="container">
        <div className="footer-top pt-100 pb-30">
          <div className="row justify-content-between">
            <div
              className="col-xl-5 col-lg-6"
              data-aos="fade-up"
              data-aos-duration="1500"
              data-aos-offset="50"
            >
              <div className="footer-widget footer-text">
                <div className="footer-logo mb-25">
                  <Link to="/">
                    <img
                      src="/assets/images/logos/logo3 copy 2.png"
                      alt="Logo"
                      title="Logo"
                      style={{ width: "150px", height: "70px" }}
                    />
                  </Link>
                </div>
                <p>
                  Chúng tôi biên soạn các hành trình riêng biệt phù hợp với sở
                  thích của bạn, đảm bảo mọi chuyến đi đều liền mạch và làm
                  phong phú thêm những viên ngọc ẩn giấu
                </p>
                <div className="social-style-one mt-15">
                  <a href="https://www.facebook.com/profile.php?id=61571028377385">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="/contact">
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a href="/contact">
                    <i className="fab fa-pinterest"></i>
                  </a>
                  <a href="/contact">
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </div>
            </div>

            <div
              className="col-xl-5 col-lg-6"
              data-aos="fade-up"
              data-aos-delay="50"
              data-aos-duration="1500"
              data-aos-offset="50"
            ></div>
          </div>
        </div>
      </div>

      <div className="widget-area pt-95 pb-45">
        <div className="container">
          <div className="row row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-2">
            <FooterColumn
              title="Dịch vụ"
              links={[
                { to: "/tours", label: "Đặt tour" },
                { to: "/tours", label: "Đặt vé" },
              ]}
            />

            <FooterColumn
              title="Công ty"
              delay="50"
              links={[
                { to: "/about", label: "Giới thiệu về công ty" },
                { to: "/contact", label: "Việc làm và nghề nghiệp" },
                { to: "/contact", label: "Liên hệ với chúng tôi" },
              ]}
            />

            <div
              className="col col-md-6 col-10 col-small"
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="1500"
              data-aos-offset="50"
            >
              <div className="footer-widget footer-contact">
                <div className="footer-title">
                  <h5>Liên hệ</h5>
                </div>
                <ul className="list-style-one">
                  <li>
                    <i className="fal fa-map-marked-alt"></i> FPT, Thach That,
                    Hoa Lac, Ha Noi
                  </li>
                  <li>
                    <i className="fal fa-envelope"></i>{" "}
                    <a href="mailto:campversecamping@gmail.com">
                      campversecamping@gmail.com
                    </a>
                  </li>
                  <li>
                    <i className="fal fa-clock"></i> Thứ 2 - Thứ 6, 08am - 05pm
                  </li>
                  <li>
                    <i className="fal fa-phone-volume"></i>{" "}
                    <a href="tel:+88012334588">0866458780</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom pt-20 pb-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 text-center text-lg-start">
              <p>
                @Copy 2025 <Link to="/">Campverse</Link>, All rights reserved
              </p>
            </div>
            <div className="col-lg-7 text-center text-lg-end">
              <ul className="footer-bottom-nav">
                {/* <li>
                  <Link to="/about">Điều khoản</Link>
                </li>
                <li>
                  <Link to="/about">Chính sách bảo mật</Link>
                </li>
                <li>
                  <Link to="/about">Thông báo pháp lý</Link>
                </li>
                <li>
                  <Link to="/about">Khả năng truy cập</Link>
                </li> */}
              </ul>
            </div>
          </div>
          <button className="scroll-top scroll-to-target" data-target="html">
            <img src="/assets/images/icons/scroll-up.png" alt="Scroll Up" />
          </button>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links, delay = "0" }) {
  return (
    <div
      className="col col-small"
      data-aos="fade-up"
      data-aos-delay={delay}
      data-aos-duration="1500"
      data-aos-offset="50"
    >
      <div className="footer-widget footer-links">
        <div className="footer-title">
          <h5>{title}</h5>
        </div>
        <ul className="list-style-three">
          {links.map((link, index) => (
            <li key={index}>
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
