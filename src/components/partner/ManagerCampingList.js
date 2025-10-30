// src/components/ManagerCampingList.js
import React from "react";

const ManagerCampingList = ({
  campings,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (!campings || campings.length === 0) {
    return <p className="text-center">Hiện chưa có địa điểm nào.</p>;
  }

  return (
    <>
      {campings.map((camping, index) => (
        <div
          className="col-xl-4 col-md-6"
          style={{ marginBottom: "30px" }}
          key={index}
        >
          <div className="destination-item tour-grid style-three bgc-lighter">
            <div className="image">
              <span className="badge bgc-pink">Featured</span>
              <a href="#" className="heart">
                <i className="fas fa-heart"></i>
              </a>
              <img
                src={camping.thumbnail || "/images/no-image.jpg"}
                alt={camping.name || "Camping"}
                className="camping-img"
              />
            </div>
            <div className="content">
              <div className="destination-header">
                <span className="location">
                  <i className="fal fa-map-marker-alt"></i> {camping.address}
                </span>
                <div className="ratting">
                  {Array.from({ length: 5 }, (_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star ${
                        i < Math.round(camping.rate)
                          ? "text-warning"
                          : "text-muted"
                      }`}
                    ></i>
                  ))}
                  <span className="ms-2">({camping.rate?.toFixed(1)})</span>
                </div>
              </div>
              <h6>
                <a href={`/seller/camping/${camping.id}`}>{camping.name}</a>
              </h6>
              <ul className="blog-meta">
                <li>
                  <i className="far fa-list"></i>{" "}
                  {camping.services?.length || 0} dịch vụ
                </li>
                <li>
                  <i className="far fa-clock"></i>{" "}
                  {new Date(camping.createdAt).toLocaleDateString("vi-VN")}
                </li>
              </ul>
              <div className="destination-footer">
                <span className="price">
                  {camping.basePrice?.toLocaleString("vi-VN")} VND / đêm
                </span>
                <span
                  className={`status-badge ${
                    camping.active ? "active" : "in-process"
                  }`}
                >
                  {camping.active ? "Active" : "In-process"}
                </span>
                <a
                  href={`/seller/camping/${camping.id}`}
                  className="theme-btn style-two style-three"
                >
                  <i className="fal fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="col-lg-12">
        <ul className="pagination justify-content-center pt-15 flex-wrap">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage - 1)}
            >
              <i className="far fa-chevron-left"></i>
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li
              key={page}
              className={`page-item ${currentPage === page ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => onPageChange(page)}>
                {page}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage + 1)}
            >
              <i className="far fa-chevron-right"></i>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ManagerCampingList;
