import React from "react";
import { useParams } from "react-router-dom";
import TourDetailPage from "./tourDetail";

const TourDetailWrapper = () => {
  const { campingId } = useParams(); // phải đúng với Route path

  if (!campingId) return <div className="container py-5">Không tìm thấy tour</div>;

  return (
    <TourDetailPage campingId={campingId} />
  );
};

export default TourDetailWrapper;



//import React, { useEffect, useState } from "react";
//import { useParams } from "react-router-dom";
//import { getCampingInforById } from "../api/tourService";
//import TourDetailPage from "./tourDetail";
//
//const TourDetailWrapper = () => {
//  const { id } = useParams();
//  const [camping, setCamping] = useState(null);
//  const [loading, setLoading] = useState(true);
//  const [error, setError] = useState("");
//
//  useEffect(() => {
//    const fetchCamping = async () => {
//      try {
//        const data = await getCampingInforById(id);
//        setCamping(data);
//      } catch (err) {
//        setError("Không thể tải thông tin khu cắm trại!");
//      } finally {
//        setLoading(false);
//      }
//    };
//    fetchCamping();
//  }, [id]);
//
//  if (loading)
//    return <div className="container py-5 text-center">Đang tải...</div>;
//  if (error)
//    return (
//      <div className="container py-5 text-danger text-center">{error}</div>
//    );
//  if (!camping)
//    return (
//      <div className="container py-5 text-center">
//        Không tìm thấy khu cắm trại
//      </div>
//    );
//
//  // Ánh xạ dữ liệu API sang format mà TourDetailPage đang dùng
//  const mappedTourDetail = {
//    id: camping.id,
//    title: camping.campingSiteName || camping.name,
//    description: camping.description,
//    location: camping.address,
//    priceAdult: camping.basePrice,
//    gallery: camping.galleries?.map((g) => g.imageUrl) || [],
//    tents: camping.tents || [],
//    services: camping.services || [],
//  };
//
//  return (
//    <TourDetailPage
//      tourDetail={mappedTourDetail}
//      title="Chi tiết khu cắm trại"
//      avgStar={camping.rate || 0}
//      tourRecommendations={[]} // có thể gọi thêm API gợi ý nếu muốn
//    />
//  );
//};
//
//export default TourDetailWrapper;
