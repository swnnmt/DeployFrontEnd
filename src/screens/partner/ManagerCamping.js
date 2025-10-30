// src/pages/ManagerCamping.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import BannerHome from "../../components/partner/BannerHomePartner";
import ManagerCampingList from "../../components/partner/ManagerCampingList";

const ManagerCamping = (props) => {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCampings, setFilteredCampings] = useState([]);
  const [allCampings, setAllCampings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useState({
    filter: "all",
  });

  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).id : "guest";

  const handleSearch = (params) => {
    setSearchParams(params);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchCampings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("https://semiopen-felicia-unsimular.ngrok-free.dev/api/v1/camping");
        // Nếu API trả { data: [...] } thì điều chỉnh: res.data.data
        setAllCampings(Array.isArray(res.data) ? res.data : res.data || []);
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        setError("Không thể tải danh sách camping.");
        setAllCampings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampings();
  }, []);

  useEffect(() => {
    if (!allCampings || allCampings.length === 0) {
      setFilteredCampings([]);
      return;
    }

    let result = allCampings;

    // Lọc theo trường userId (dữ liệu mẫu của bạn có field userId)
    result = result.filter((camping) => camping.userId === userId);

    if (searchParams.filter === "active") {
      result = result.filter((camping) => camping.active === true);
    } else if (searchParams.filter === "in-progress") {
      result = result.filter((camping) => camping.active === false);
    }

    setFilteredCampings(result);
    setCurrentPage(1);
  }, [searchParams, allCampings, userId]);

  const indexOfLastCamping = currentPage * itemsPerPage;
  const indexOfFirstCamping = indexOfLastCamping - itemsPerPage;
  const currentCampings = filteredCampings.slice(
    indexOfFirstCamping,
    indexOfLastCamping
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCampings.length / itemsPerPage)
  );

  return (
    <>
      <BannerHome onSearch={handleSearch} />

      <div className="tour-grid-wrap">
        <div className="row" id="campings-container">
          <ManagerCampingList
            campings={currentCampings}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            loading={loading}
            error={error}
            noDataText="Không có camping phù hợp."
          />
        </div>
      </div>
    </>
  );
};

export default ManagerCamping;
