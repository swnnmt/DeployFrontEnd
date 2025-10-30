import React, { useState } from 'react';
import ServiceList from '../components/ServiceList';
import { services } from '../data/mockData';
import { Link } from 'react-router-dom';
import BannerHome from '../components/BannerHome';
import BookingForm from '../components/BookingForm';

const Service = () => {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);

  const indexOfLastService = currentPage * itemsPerPage;
  const indexOfFirstService = indexOfLastService - itemsPerPage;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(services.length / itemsPerPage);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Gửi dữ liệu selectedServices và các input khác
    console.log('Đặt dịch vụ với các tùy chọn:', selectedServices);
  };

  return (
    <>
      <Link to="/#" className="chatbot-fixed" title="Trợ lý ảo Campverse">
        <img src={`/assets/images/login/chatbot.png`} alt="Chatbot" />
      </Link>
      <BannerHome />

      <div className="service-grid-wrap pt-100 pb-70">
        <div className="container">
          <div className="section-title text-center mb-40">
            <h2>Dịch Vụ Của Chúng Tôi</h2>
          </div>
          <div className="row">
            <ServiceList
              services={currentServices}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Booking Service Form */}
          <section className="contact-form-area py-70 rel z-1">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="comment-form bgc-lighter z-1 rel mb-30">
                    <form className="contactForm" onSubmit={handleSubmit}>
                      <div className="section-title text-center">
                        <h2>Đặt Dịch Vụ</h2>
                        <p>Vui lòng điền thông tin bên dưới để đặt dịch vụ</p>
                      </div>
                      <div className="row mt-35">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Họ và tên <span style={{ color: 'red' }}>*</span></label>
                            <input type="text" className="form-control" placeholder="Họ và tên" required />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Số điện thoại <span style={{ color: 'red' }}>*</span></label>
                            <input type="tel" className="form-control" placeholder="Số điện thoại" required />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>Email <span style={{ color: 'red' }}>*</span></label>
                            <input type="email" className="form-control" placeholder="Email" required />
                          </div>
                        </div>

                        <div className="col-md-12">
                          <BookingForm
                            selectedServices={selectedServices}
                            setSelectedServices={setSelectedServices}
                          />
                        </div>

                        <div className="col-md-12">
                          <div className="form-group">
                            <label>Ghi chú</label>
                            <textarea className="form-control" rows="4" placeholder="Ghi chú thêm (nếu có)"></textarea>
                          </div>
                        </div>

                        <div className="col-md-12 text-center">
                          <div className="form-group mb-0">
                            <button type="submit" className="theme-btn style-two">
                              <span>Gửi yêu cầu</span>
                              <i className="fal fa-paper-plane"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default Service;
