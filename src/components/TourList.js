import React from "react";
import { Link } from "react-router-dom";

const TourList = ({ tours, currentPage, totalPages, onPageChange }) => {
  if (!Array.isArray(tours) || tours.length === 0) {
    return (
      <div className="col-12 text-center py-5">Không có tour nào phù hợp.</div>
    );
  }

  return (
    <>
      {tours.map((tour, index) => (
        <div
          className="col-xl-4 col-md-6"
          style={{ marginBottom: "30px" }}
          key={index}
        >
          <div className="destination-item tour-grid style-three bgc-lighter">
            <div className="image">
              <img
                src={tour.thumbnail}
                alt={tour.name}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
            </div>
            <div className="content">
              <h6>
                <Link to={`/camping-detail/${tour.id}`}>{tour.name}</Link>
              </h6>
              <div className="ratting mb-2">
                {[1, 2, 3, 4, 5].map((i) =>
                  i <= Math.round(tour.rate) ? (
                    <i className="fas fa-star" key={i}></i>
                  ) : (
                    <i className="far fa-star" key={i}></i>
                  )
                )}
              </div>
              <div className="destination-footer">
                <span className="text-muted">{tour.cityName}</span>
                <Link
                  to={`/camping-detail/${tour.id}`}
                  className="theme-btn style-two style-three float-end"
                >
                  <i className="fal fa-arrow-right"></i>
                </Link>
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

export default TourList;
