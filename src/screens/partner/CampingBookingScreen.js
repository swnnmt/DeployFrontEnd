import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BannerHome from "../../components/partner/BannerHomePartner";
import axios from "axios";
import "./CampingBookingScreen.css";

const CampingBookingScreen = () => {
  const { campingInforId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [tentsMap, setTentsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  // pagination
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://semiopen-felicia-unsimular.ngrok-free.dev/api/v1/camping/booking/${campingInforId}?page=${page}&size=${size}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data;
        const bookingsData = data.content || [];
        setBookings(bookingsData);
        setTotalPages(data.totalPages || 0);

        // Lấy thông tin lều
        const tentPromises = bookingsData.map((b) =>
          axios.get(`https://semiopen-felicia-unsimular.ngrok-free.dev/api/tents/byTentId/${b.campingTentId}`)
        );
        const tentResponses = await Promise.all(tentPromises);
        const tentMapData = {};
        tentResponses.forEach((r) => {
          if (r.data && r.data.id) tentMapData[r.data.id] = r.data;
        });
        setTentsMap(tentMapData);
      } catch (err) {
        console.error("Lỗi khi load booking:", err);
        setError("Không tải được danh sách booking");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [campingInforId, page, size, refresh]);

  // Format helper
  const fmtDate = (iso) =>
    iso ? new Date(iso).toLocaleString("vi-VN", { hour12: false }) : "-";
  const fmtPrice = (val) =>
    val === null || val === undefined
      ? "-"
      : `${Number(val).toLocaleString("vi-VN")} VND`;

  // ✅ Hàm cập nhật trạng thái booking
  const handleCompleteBooking = async (bookingId) => {
    if (!window.confirm("Xác nhận chuyển booking này sang COMPLETED?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://semiopen-felicia-unsimular.ngrok-free.dev/api/v1/bookings/${bookingId}/completed`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Đã chuyển sang COMPLETED thành công!");
      setRefresh((r) => !r); // reload danh sách
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      alert("Không thể cập nhật trạng thái.");
    }
  };

  if (loading) return <p>Đang tải danh sách booking...</p>;
  if (error) return <p>{error}</p>;
  if (!bookings.length) return <p>Chưa có booking nào.</p>;

  return (
    <div>
      <BannerHome />
      <div className="container py-4">
        <h2>Danh sách booking</h2>
        <Link to={`/seller/camping/${campingInforId}`} className="btn btn-secondary mb-3">
          ← Quay lại camping
        </Link>

        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Tên người dùng</th>
              <th>Lều</th>
              <th>Dịch vụ</th>
              <th>Thời gian bắt đầu</th>
              <th>Thời gian kết thúc</th>
              <th>Tổng giá</th>
              <th>Trạng thái</th>
              <th>Thời gian tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => {
              const tent = tentsMap[b.campingTentId] || {};
              return (
                <tr key={b.bookingId}>
                  <td>{b.bookingId}</td>
                  <td>{b.userName || "-"}</td>
                  <td>{tent.tentName || "-"}</td>
                  <td>
                    {b.serviceNames?.length > 0
                      ? b.serviceNames.join(", ")
                      : "-"}
                  </td>
                  <td>{fmtDate(b.startTime)}</td>
                  <td>{fmtDate(b.endTime)}</td>
                  <td>{fmtPrice(b.totalPrice)}</td>
                  <td
                    className={
                      b.status === "PENDING"
                        ? "status-pending"
                        : b.status === "COMPLETED"
                        ? "status-confirmed"
                        : "status-cancelled"
                    }
                  >
                    {b.status === "PENDING"
                      ? "⏳ Đang xử lý"
                      : b.status === "COMPLETED"
                      ? "✅ Hoàn tất"
                      : "❌ Hủy"}
                  </td>
                  <td>{fmtDate(b.createdAt)}</td>
                  <td>
                    {b.status === "PENDING" && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleCompleteBooking(b.bookingId)}
                      >
                        Hoàn tất ✅
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-outline-primary mx-2"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Trang trước
          </button>
          <span>
            Trang {page + 1} / {totalPages}
          </span>
          <button
            className="btn btn-outline-primary mx-2"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Trang sau →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampingBookingScreen;
