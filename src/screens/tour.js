import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import BannerHome from "../components/BannerHome";
import TourList from "../components/TourList";
import {
  getCampingRoomsBySiteId,
  getAllCampingSites,
  getAllCampingInfor,
} from "../api/campingSiteService";

const TourScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const siteId = queryParams.get("siteId");

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);

        let data = [];

        // ✅ Luôn gọi danh sách phòng trước
        console.log("🏕️ Fetching all camping information...");
        data = await getAllCampingInfor();

        // Nếu có siteId, lọc thêm theo siteId
        if (siteId) {
          console.log("📍 Filtering by siteId:", siteId);
          const siteRooms = await getCampingRoomsBySiteId(siteId);

          // Gộp dữ liệu (hoặc chỉ lấy siteRooms, tùy bạn)
          data = siteRooms.length > 0 ? siteRooms : data;
        }

        // Chỉ lấy các tour active
        const activeTours = data.filter((tour) => tour.active !== false);
        setTours(activeTours);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu camping:", error);
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [siteId]);

  // Pagination
  const itemsPerPageCount = 6;
  const indexOfLastTour = currentPage * itemsPerPageCount;
  const indexOfFirstTour = indexOfLastTour - itemsPerPageCount;
  const currentTours = tours.slice(indexOfFirstTour, indexOfLastTour);
  const totalPages = Math.ceil(tours.length / itemsPerPageCount);

  return (
    <>
      <Link to="#" className="chatbot-fixed" title="Trợ lý ảo Campverse">
        <img src="/assets/images/login/chatbot.png" alt="Chatbot" />
      </Link>

      <BannerHome />

      <div className="tour-grid-wrap container">
        <div className="row" id="tours-container">
          {loading ? (
            <div className="col-12 text-center py-5">
              <h5>Đang tải danh sách camping...</h5>
            </div>
          ) : currentTours.length > 0 ? (
            <TourList
              tours={currentTours.map((tour) => ({
                id: tour.id,
                name: tour.name || tour.location,
                thumbnail: tour.thumbnail || "/assets/images/default.jpg",
                rate: tour.rate || 0,
                cityName: tour.campingSiteName || "",
              }))}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          ) : (
            <div className="col-12 text-center py-5">
              <h5>Không tìm thấy camping nào.</h5>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TourScreen;
