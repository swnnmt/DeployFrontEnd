import React, { useState } from "react";
import { Link } from "react-router-dom";
import BannerHome from "../components/BannerHome";
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sending contact data:", formData);
    // TODO: send data to backend
  };

  return (
    <>
      <Link to="/#" className="chatbot-fixed" title="Trợ lý ảo Campverse">
        <img src={`/assets/images/login/chatbot.png`} alt="Chatbot" />
      </Link>
      <BannerHome />
      {/* Contact Info Area */}
      <section className="contact-info-area pt-100 rel z-1">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-4">
              <div className="contact-info-content mb-30 rmb-55">
                <div className="section-title mb-30">
                  <h2>
                    Hãy nói chuyện với các hướng dẫn viên du lịch chuyên nghiệp
                    của chúng tôi
                  </h2>
                </div>
                <p>
                  Đội ngũ hỗ trợ tận tâm của chúng tôi luôn sẵn sàng hỗ trợ bạn
                  giải đáp mọi thắc mắc hoặc vấn đề, cung cấp các giải pháp
                  nhanh chóng và được cá nhân hóa để đáp ứng nhu cầu của bạn.
                </p>
                {/* <div className="features-team-box mt-40">
                  <h6>85+ Thành viên nhóm chuyên gia</h6>
                  <div className="feature-authors">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <img key={i} src={`/assets/images/features/feature-author${i}.jpg`} alt="Author" />
                    ))}
                    <span>+</span>
                  </div>
                </div> */}
              </div>
            </div>
            <div className="col-lg-8">
              <div className="row">
                <div className="col-md-6">
                  <div className="contact-info-item">
                    <div className="icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="content">
                      <h5>Cần trợ giúp và hỗ trợ</h5>
                      <div className="text">
                        <i className="far fa-envelope"></i>{" "}
                        <a href="mailto:campversecamping@gmail.com">
                          campversecamping@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="contact-info-item">
                    <div className="icon">
                      <i className="fab fa-facebook-f"></i>
                    </div>
                    <div className="content">
                      <h5>Fanpage</h5>
                      <div className="text">
                        <i className="fab fa-facebook"></i>{" "}
                        <a
                          href="https://www.facebook.com/profile.php?id=61571028377385"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          facebook.com/groups
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="contact-info-item">
                    <div className="icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="content">
                      <h5>Đại Học FPT</h5>
                      <div className="text">
                        <i className="fal fa-map-marker-alt"></i> Thạch Thất,
                        Hòa Lạc, Hà Nội
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="contact-info-item">
                    <div className="icon">
                      <img
                        src="/assets/images/icons/OIP.jpg"
                        alt="Zalo"
                        style={{ width: 90, height: 55 }}
                      />
                    </div>
                    <div className="content">
                      <h5>Liên hệ Zalo</h5>
                      <div className="text">
                        <i className="fal fa-phone"></i>{" "}
                        <a
                          href="https://zalo.me/0901234567"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          0866458780
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Contact Form Area */}
      {/* <section className="contact-form-area py-70 rel z-1">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="comment-form bgc-lighter z-1 rel mb-30 rmb-55">
                <form className="contactForm" onSubmit={handleSubmit}>
                  <div className="section-title">
                    <h2>Liên hệ</h2>
                  </div>
                  <p>
                    Địa chỉ email của bạn sẽ không được công bố. Các trường bắt
                    buộc được đánh dấu <span style={{ color: "red" }}>*</span>
                  </p>
                  <div className="row mt-35">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="name">
                          Họ và tên <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="form-control"
                          placeholder="Họ và tên"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="phone_number">
                          Số điện thoại <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          id="phone_number"
                          name="phone_number"
                          className="form-control"
                          placeholder="Số điện thoại"
                          value={formData.phone_number}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="email">
                          Địa chỉ Email <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-control"
                          placeholder="Nhập email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="message">
                          Nội dung <span style={{ color: "red" }}>*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          className="form-control"
                          rows="5"
                          placeholder="Nội dung"
                          value={formData.message}
                          onChange={handleChange}
                          required
                        ></textarea>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group mb-0">
                        <button type="submit" className="theme-btn style-two">
                          <span data-hover="Send Comments">Gửi</span>
                          <i className="fal fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="contact-images-part">
                <div className="row">
                  <div className="col-12">
                    <img
                      src="/assets/images/contact/contact1.jpg"
                      alt="Contact"
                    />
                  </div>
                  <div className="col-6">
                    <img
                      src="/assets/images/contact/contact2.jpg"
                      alt="Contact"
                    />
                  </div>
                  <div className="col-6">
                    <img
                      src="/assets/images/contact/contact3.jpg"
                      alt="Contact"
                    />
                  </div>
                </div>
                <div className="circle-logo">
                  <img
                    src="/assets/images/logos/logo3.png"
                    alt="Logo"
                    style={{ borderRadius: "50%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Contact Map */}
      <div className="contact-map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61349.64701146602!2d108.16542067386848!3d16.047164798501537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c792252a13%3A0xfc14e3a044436487!2sDa%20Nang%2C%20H%E1%BA%A3i%20Ch%C3%A2u%20District%2C%20Da%20Nang%2C%20Vietnam!5e0!3m2!1sen!2s!4v1729087157388!5m2!1sen!2s"
          style={{ border: 0, width: "100%" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </>
  );
};
export default ContactPage;
