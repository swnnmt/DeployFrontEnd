// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      className="main-footer footer-two bgp-bottom bgc-black rel z-15 pt-100 pb-115"
      style={{ backgroundImage: "url(/clients/assets/images/backgrounds/footer-two.png)" }}
    >
      <div className="widget-area">
        <div className="container">
          <div className="row row-cols-xxl-5 row-cols-xl-4 row-cols-md-3 row-cols-2">
            <div className="col col-small" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
              <div className="footer-widget footer-text">
                <div className="footer-logo mb-40">
                 <Link to="/">
                  <img src="/assets/images/logos/logo3.png" alt="Logo" title="Logo" />
                </Link>
                </div>
                <div className="footer-map">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61349.64701146602!2d108.16542067386848!3d16.047164798501537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c792252a13%3A0xfc14e3a044436487!2sDa%20Nang%2C%20H%E1%BA%A3i%20Ch%C3%A2u%20District%2C%20Da%20Nang%2C%20Vietnam!5e0!3m2!1sen!2s!4v1729087157388!5m2!1sen!2s"
                    style={{ border: 0, width: '100%' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Da Nang Map"
                  />
                </div>
              </div>
            </div>

            <div className="col col-small" data-aos="fade-up" data-aos-delay="50">
              <div className="footer-widget footer-links ms-sm-5">
                <h5 className="footer-title">Dịch vụ</h5>
                <ul className="list-style-three">
                  <li><Link to="/team">Hướng dẫn viên du lịch tốt nhất</Link></li>
                  <li><Link to="/tours">Đặt tour</Link></li>
                  <li><Link to="/tours">Đặt vé</Link></li>
                </ul>
              </div>
            </div>

            <div className="col col-small" data-aos="fade-up" data-aos-delay="100">
              <div className="footer-widget footer-links ms-md-4">
                <h5 className="footer-title">Công ty</h5>
                <ul className="list-style-three">
                  <li><Link to="/about">Giới thiệu về công ty</Link></li>
                  <li><Link to="/contact">Việc làm và nghề nghiệp</Link></li>
                  <li><Link to="/contact">Liên hệ với chúng tôi</Link></li>
                </ul>
              </div>
            </div>

            <div className="col col-small" data-aos="fade-up" data-aos-delay="150">
              <div className="footer-widget footer-links ms-lg-4">
                <h5 className="footer-title">Điểm đến</h5>
                <ul className="list-style-three">
                  <li><Link to="/destination">Miền Bắc</Link></li>
                  <li><Link to="/destination">Miền Trung</Link></li>
                  <li><Link to="/destination">Miền Nam</Link></li>
                </ul>
              </div>
            </div>

            <div className="col col-md-6 col-10 col-small" data-aos="fade-up" data-aos-delay="200">
              <div className="footer-widget footer-contact">
                <h5 className="footer-title">Liên hệ</h5>
                <ul className="list-style-one">
                  <li><i className="fal fa-map-marked-alt"></i> FPT University</li>
                  <li><i className="fal fa-envelope"></i> <a href="mailto:Anhtraisaybye@gmail.com">Anhtraisaybye@gmail.com</a></li>
                  <li><i className="fal fa-phone-volume"></i> <a href="tel:+88012334588">+880 (123) 345 88</a></li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="footer-bottom bg-transparent pt-20 pb-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 text-center text-lg-start">
              <p className="copyright-text">
                &copy; 2024 <Link to="/">Campverse</Link>, All rights reserved
              </p>
            </div>
            <div className="col-lg-7 text-center text-lg-end">
              <ul className="footer-bottom-nav">
                <li><Link to="/about">Điều khoản</Link></li>
                <li><Link to="/about">Chính sách bảo mật</Link></li>
                <li><Link to="/about">Thông báo pháp lý</Link></li>
                <li><Link to="/about">Khả năng truy cập</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
