import React from 'react';

const ServiceList = ({ services }) => {
  return (
    <div className="row">
      {services.map((service) => (
        <div className="col-xl-4 col-md-6" style={{ marginBottom: '30px' }} key={service.id}>
          <div
            className="destination-item service-grid style-three bgc-lighter block_services equal-block-fix"
            data-aos="fade-up"
            data-aos-duration="1500"
            data-aos-offset="50"
          >
            <div className="content equal-content-fix p-4">
              <div className="destination-header mb-3">
                <div className="icon text-primary" style={{ fontSize: '2rem' }}>
                  <i className={`fas ${service.icon}`}></i>
                </div>
              </div>
              <h5>{service.title}</h5>
              <p style={{ minHeight: '100px' }}>{service.description}</p>
              <div className="destination-footer">
                <a
                  href="/contact"
                  className="theme-btn style-two style-three"
                >
                  <span>Liên hệ</span> <i className="fal fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceList;
